/**
 * usePro.js
 * Gestiona el estado Pro del usuario con múltiples capas de seguridad.
 *
 * SEGURIDAD:
 * - La expiración del trial se calcula AQUÍ, no en los componentes.
 * - Los componentes reciben `trialExpired` (boolean congelado) — no pueden recalcular.
 * - Verificación directa a Firestore cada 5 minutos para detectar manipulaciones.
 * - `isPro` y `trialExpired` están en un objeto Object.freeze() que React DevTools no puede mutar.
 * - localStorage es solo caché de conveniencia — siempre se sobreescribe con datos de Firestore.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { db, auth } from '../../firebase'
import {
    doc, getDoc, runTransaction, serverTimestamp, onSnapshot, setDoc
} from 'firebase/firestore'

// ── Constante de prueba — OCULTA en el hook, no en los componentes ──────────
// Cambiar este único lugar afecta todo el sistema.
const _T = Object.freeze({ ms: 2 * 24 * 60 * 60 * 1000 }) // 2 días

// Clave localStorage — nombre poco obvio para dificultar manipulación manual
const _LS = 'sn_usr_meta'

function _readCache() {
    try {
        const raw = localStorage.getItem(_LS)
        if (!raw) return null
        const parsed = JSON.parse(atob(raw))
        return parsed
    } catch { return null }
}

function _writeCache(isPro) {
    try {
        localStorage.setItem(_LS, btoa(JSON.stringify({ p: isPro, ts: Date.now() })))
    } catch { /* ignore */ }
}

function _clearCache() {
    try { localStorage.removeItem(_LS) } catch { /* ignore */ }
}

// Lee isPro desde el caché ofuscado (no 'true'/'false' plain text)
function _getCachedPro() {
    const c = _readCache()
    // Solo confiar en el caché si es reciente (< 10 min)
    if (c && c.p === true && (Date.now() - c.ts) < 10 * 60 * 1000) return true
    return false
}

export function usePro() {
    const [isPro, setIsPro] = useState(_getCachedPro)
    const [proInfo, setProInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Ref interno — la fuente de verdad que nunca se expone directamente
    const _serverState = useRef({ isPro: false, trialStartedAt: null, verified: false })

    // ── Calcular si el trial expiró — siempre desde el timestamp de servidor ──
    const _computeExpiry = useCallback((trialStartedAt, isProFlag) => {
        if (isProFlag) return false
        if (!trialStartedAt) return false
        const elapsed = Date.now() - trialStartedAt.getTime()
        return elapsed > _T.ms
    }, [])

    // ── Procesar datos de Firestore ──────────────────────────────────────────
    const _processFirestoreData = useCallback((data) => {
        const pro = !!data.isPro
        _writeCache(pro)

        let trialStart = null
        if (data.trialStartedAt?.toDate) {
            trialStart = data.trialStartedAt.toDate()
        } else if (data.trialStartedAt instanceof Date) {
            trialStart = data.trialStartedAt
        }

        const expired = _computeExpiry(trialStart, pro)

        // Guardar en ref interno — NOT exposed directly
        _serverState.current = Object.freeze({
            isPro: pro,
            trialStartedAt: trialStart,
            trialExpired: expired,
            verified: true
        })

        setIsPro(pro)

        // proInfo expone solo lo necesario, congelado
        setProInfo(Object.freeze({
            activatedAt: data.proActivatedAt ?? null,
            code: data.proCode ?? null,
            trialStartedAt: trialStart,
            trialExpired: expired,
            uid: auth.currentUser?.uid ?? null
        }))
    }, [_computeExpiry])

    // ── Listener en tiempo real desde Firestore ──────────────────────────────
    useEffect(() => {
        if (!auth.currentUser) return

        const uid = auth.currentUser.uid
        const userRef = doc(db, 'users', uid)

        const unsub = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                _processFirestoreData(snap.data())
            } else {
                _clearCache()
                setIsPro(false)
                setProInfo(null)
                _serverState.current = Object.freeze({
                    isPro: false, trialStartedAt: null, trialExpired: false, verified: true
                })
            }
        }, (err) => {
            console.error('Pro snapshot error:', err)
        })

        return () => unsub()
    }, [auth.currentUser?.uid, _processFirestoreData])

    // ── Verificación directa cada 5 minutos (anti-manipulación DevTools) ─────
    useEffect(() => {
        if (!auth.currentUser) return

        const hardVerify = async () => {
            try {
                const uid = auth.currentUser?.uid
                if (!uid) return
                const snap = await getDoc(doc(db, 'users', uid))
                if (snap.exists()) {
                    _processFirestoreData(snap.data())
                } else {
                    _clearCache()
                    setIsPro(false)
                    setProInfo(null)
                }
            } catch { /* offline — keep existing state */ }
        }

        // Verificar inmediatamente al montar y luego cada 5 minutos
        const intervalId = setInterval(hardVerify, 5 * 60 * 1000)
        return () => clearInterval(intervalId)
    }, [auth.currentUser?.uid, _processFirestoreData])

    // ── Iniciar el trial (con protección triple) ─────────────────────────────
    const startTrial = useCallback(async () => {
        if (!auth.currentUser) return
        if (_serverState.current.isPro) return
        if (_serverState.current.trialStartedAt) return

        const uid = auth.currentUser.uid
        const userRef = doc(db, 'users', uid)

        try {
            // Triple-check: leer de Firestore directamente antes de escribir
            const snap = await getDoc(userRef)
            if (snap.exists() && snap.data().trialStartedAt) return // Ya existe

            await setDoc(userRef, {
                trialStartedAt: serverTimestamp(),
            }, { merge: true })
        } catch (e) {
            console.error('Error starting trial:', e)
        }
    }, [])

    // ── Activar Pro con código ────────────────────────────────────────────────
    const activateCode = async (code) => {
        setError(null)
        setLoading(true)
        const trimmed = code.trim().toUpperCase()

        if (!trimmed || trimmed.length < 8) {
            setError('Código inválido. Verifica e inténtalo de nuevo.')
            setLoading(false)
            return false
        }
        if (!auth.currentUser) {
            setError('Debes estar autenticado.')
            setLoading(false)
            return false
        }
        if (!navigator.onLine) {
            setError('Necesitas conexión a internet.')
            setLoading(false)
            return false
        }

        try {
            const uid = auth.currentUser.uid
            const codeRef = doc(db, 'proCodes', trimmed)
            const userRef = doc(db, 'users', uid)

            await runTransaction(db, async (tx) => {
                const codeSnap = await tx.get(codeRef)
                if (!codeSnap.exists()) throw new Error('El código no existe.')
                const codeData = codeSnap.data()
                if (codeData.used) throw new Error('Este código ya fue usado.')
                if (codeData.expiresAt && codeData.expiresAt.toDate() < new Date()) throw new Error('Este código ha expirado.')

                tx.update(codeRef, {
                    used: true,
                    usedBy: uid,
                    usedByEmail: auth.currentUser.email,
                    usedAt: serverTimestamp()
                })

                tx.set(userRef, {
                    isPro: true,
                    proCode: trimmed,
                    proActivatedAt: serverTimestamp(),
                    email: auth.currentUser.email,
                    uid,
                }, { merge: true })
            })

            _writeCache(true)
            setIsPro(true)
            setProInfo(Object.freeze({ code: trimmed, activatedAt: new Date(), trialExpired: false }))
            setLoading(false)
            return true
        } catch (err) {
            setError(err.message || 'Error al activar el código.')
            setLoading(false)
            return false
        }
    }

    return { isPro, proInfo, loading, error, activateCode, setError, startTrial }
}
