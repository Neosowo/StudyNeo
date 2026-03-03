import { useState, useEffect, useRef } from 'react'

/**
 * Hook de persistencia local ultra resiliente.
 * Maneja tanto JSON como strings planos y reacciona a cambios externos (Sync).
 */
export function useLocalStorage(key, initialValue) {
    const [stored, setStored] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            if (item === null) return initialValue
            try {
                return JSON.parse(item)
            } catch {
                return item
            }
        } catch (error) {
            console.warn(`[LocalStorage] Error crítico leyendo ${key}:`, error)
            return initialValue
        }
    })

    const storedRef = useRef(stored)

    useEffect(() => {
        storedRef.current = stored
    }, [stored])

    // Escuchar cambios externos (desde useSync o de otras pestañas)
    useEffect(() => {
        const handleExternalUpdate = () => {
            try {
                const item = window.localStorage.getItem(key)
                if (item === null) return

                let newValue
                try {
                    newValue = JSON.parse(item)
                } catch {
                    newValue = item
                }

                if (JSON.stringify(newValue) !== JSON.stringify(storedRef.current)) {
                    setStored(newValue)
                    storedRef.current = newValue
                }
            } catch (e) {
                // Silenciamos fallos de parseo en el sync
            }
        }

        window.addEventListener('storage', handleExternalUpdate)
        window.addEventListener('sd_sync_update', handleExternalUpdate)
        return () => {
            window.removeEventListener('storage', handleExternalUpdate)
            window.removeEventListener('sd_sync_update', handleExternalUpdate)
        }
    }, [key])

    const updateMeta = (key) => {
        try {
            const meta = JSON.parse(localStorage.getItem('sd_meta') || '{}')
            meta[key] = new Date().toISOString()
            localStorage.setItem('sd_meta', JSON.stringify(meta))
        } catch (e) { }
    }

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedRef.current) : value
            setStored(valueToStore)
            storedRef.current = valueToStore

            const stringified = typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
            window.localStorage.setItem(key, stringified)

            // Registramos el timestamp de esta actualización
            if (key.startsWith('sd_')) updateMeta(key)

            // Disparamos el evento para que otros hooks useLocalStorage con la misma key se actualicen
            window.dispatchEvent(new Event('storage'))
        } catch (e) {
            console.error(`[LocalStorage] Error guardando ${key}:`, e)
        }
    }

    return [stored, setValue]
}
