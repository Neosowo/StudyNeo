/**
 * usePro.js
 * Gestiona el estado Pro del usuario.
 * - Lee/escribe isPro en Firestore bajo users/{uid}
 * - Activa con código de un solo uso (colección proCodes)
 * - Persiste localmente para funcionar offline
 */
import { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import {
    doc, getDoc, runTransaction, serverTimestamp, onSnapshot
} from 'firebase/firestore'

const LS_PRO_KEY = 'sd_is_pro'

export function usePro() {
    const [isPro, setIsPro] = useState(() => localStorage.getItem(LS_PRO_KEY) === 'true')
    const [proInfo, setProInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const checkProStatus = (data) => {
        const pro = !!data.isPro
        localStorage.setItem(LS_PRO_KEY, pro ? 'true' : 'false')
        setIsPro(pro)
        if (pro) setProInfo({ activatedAt: data.proActivatedAt, code: data.proCode })
    }

    // Escuchar estado Pro desde Firestore en tiempo real
    useEffect(() => {
        if (!auth.currentUser) return

        const uid = auth.currentUser.uid
        const userRef = doc(db, 'users', uid)

        // Listener en tiempo real
        const unsubscribe = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                checkProStatus(snap.data())
            }
        }, (err) => {
            console.error("Error en listener de Pro:", err)
        })

        return () => unsubscribe()
    }, [auth.currentUser?.uid])

    /**
     * Activar Pro con un código único.
     * Flujo:
     * 1. Lee proCodes/{code} para verificar que existe y no fue usado.
     * 2. En transacción: marca el código como usado y activa isPro en el usuario.
     */
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
            setError('Debes estar autenticado para activar un código.')
            setLoading(false)
            return false
        }

        if (!navigator.onLine) {
            setError('Necesitas conexión a internet para activar el código.')
            setLoading(false)
            return false
        }

        try {
            const uid = auth.currentUser.uid
            const codeRef = doc(db, 'proCodes', trimmed)
            const userRef = doc(db, 'users', uid)

            await runTransaction(db, async (tx) => {
                const codeSnap = await tx.get(codeRef)
                if (!codeSnap.exists()) throw new Error('El código no existe. Verifica que lo copiaste correctamente.')
                const codeData = codeSnap.data()
                if (codeData.used) throw new Error('Este código ya fue usado. Contacta a studyneo.sup@gmail.com.')
                if (codeData.expiresAt && codeData.expiresAt.toDate() < new Date()) throw new Error('Este código ha expirado.')

                // Marcar código como usado
                tx.update(codeRef, {
                    used: true,
                    usedBy: uid,
                    usedByEmail: auth.currentUser.email,
                    usedAt: serverTimestamp()
                })

                // Activar Pro en el usuario
                tx.set(userRef, {
                    isPro: true,
                    proCode: trimmed,
                    proActivatedAt: serverTimestamp(),
                    email: auth.currentUser.email,
                    uid: uid,
                }, { merge: true })
            })

            localStorage.setItem(LS_PRO_KEY, 'true')
            setIsPro(true)
            setProInfo({ code: trimmed, activatedAt: new Date().toISOString() })
            setLoading(false)
            return true
        } catch (err) {
            setError(err.message || 'Error al activar el código. Inténtalo más tarde.')
            setLoading(false)
            return false
        }
    }

    return { isPro, proInfo, loading, error, activateCode, setError }
}
