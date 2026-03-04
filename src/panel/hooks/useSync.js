import { useState, useEffect, useRef } from 'react'
import { db, auth } from '../../firebase'
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { usePro } from './usePro'

export function useSync() {
    const { isPro } = usePro()
    const syncInterval = isPro ? 60 : 300 // 1 min vs 5 mins
    const [lastSync, setLastSync] = useState(() => localStorage.getItem('sd_last_sync'))
    const [nextSyncIn, setNextSyncIn] = useState(syncInterval)
    const [isDirty, setIsDirty] = useState(false)
    const isDirtyRef = useRef(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [isOffline, setIsOffline] = useState(!navigator.onLine)
    const [isQuotaExceeded, setIsQuotaExceeded] = useState(false)

    useEffect(() => {
        const handleOnline = () => setIsOffline(false)
        const handleOffline = () => setIsOffline(true)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        isDirtyRef.current = isDirty
    }, [isDirty])

    useEffect(() => {
        const handleStorage = () => setIsDirty(true)
        window.addEventListener('storage', handleStorage)

        if (auth.currentUser && !lastSync) {
            performSync('pull')
        }

        const interval = setInterval(() => {
            setNextSyncIn(prev => {
                if (prev <= 1) {
                    performSync(isDirtyRef.current ? 'full' : 'pull') // Solo empuja si hay cambios, siempre descarga
                    return syncInterval
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            window.removeEventListener('storage', handleStorage)
            clearInterval(interval)
        }
    }, [auth.currentUser?.uid])

    const performSync = async (type = 'full') => {
        if (!navigator.onLine || !auth.currentUser || isSyncing || isQuotaExceeded) return

        setIsSyncing(true)
       

        try {
            const userId = auth.currentUser.uid
            const localMeta = JSON.parse(localStorage.getItem('sd_meta') || '{}')
            const cloudStates = {}

            // 1. DESCARGA
            const snapshot = await getDocs(collection(db, 'users', userId, 'settings'))
            snapshot.forEach((docSnap) => {
                const key = docSnap.id
                const cloudData = docSnap.data()
                const cloudValue = cloudData.value
                const cloudUpdated = cloudData.updatedAt || '0'
                cloudStates[key] = cloudUpdated
                const localUpdated = localMeta[key] || '0'

                if (cloudUpdated > localUpdated) {
                    const cloudString = typeof cloudValue === 'string' ? cloudValue : JSON.stringify(cloudValue)
                    localStorage.setItem(key, cloudString)
                    localMeta[key] = cloudUpdated
                }
            })

            // 2. SUBIDA
            if (type === 'push' || type === 'full') {
                const keys = Object.keys(localStorage).filter(k => k.startsWith('sd_') && k !== 'sd_last_sync' && k !== 'sd_meta')
                await Promise.all(keys.map(async (key) => {
                    const localUpdated = localMeta[key] || '0'
                    const cloudUpdated = cloudStates[key] || '0'
                    if (localUpdated > cloudUpdated) {
                        const rawValue = localStorage.getItem(key)
                        let data
                        try { data = JSON.parse(rawValue) } catch { data = rawValue }
                        const docRef = doc(db, 'users', userId, 'settings', key)
                        await setDoc(docRef, { value: data, updatedAt: localUpdated }, { merge: true })
                    }
                }))
            }

            localStorage.setItem('sd_meta', JSON.stringify(localMeta))
            const now = new Date().toISOString()
            localStorage.setItem('sd_last_sync', now)
            setLastSync(now)
            setIsDirty(false)
           
            window.dispatchEvent(new Event('sd_sync_update'))
        } catch (error) {
            if (error.code === 'permission-denied') {
                console.warn("[Sync] Permisos insuficientes en Firebase. Pausando sincronicación para no generar spam.")
                setIsQuotaExceeded(true) // Pausamos la sync para evitar spam de ciclos infinitos
            } else {
                console.error("[Sync] Error en ciclo:", error)
                if (error.code === 'resource-exhausted' || error.message?.includes('quota')) {
                    setIsQuotaExceeded(true)
                }
            }
        } finally {
            setIsSyncing(false)
        }
    }

    const formatNextSync = () => {
        if (isOffline) return "Sin conexión"
        if (isQuotaExceeded) return "Sincronización deshabilitada"
        const mins = Math.floor(nextSyncIn / 60)
        const secs = nextSyncIn % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return {
        lastSync,
        nextSyncIn,
        formatNextSync,
        performSync,
        isDirty,
        isSyncing,
        isOffline,
        isQuotaExceeded
    }
}
