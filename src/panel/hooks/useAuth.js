import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth'

const isValidEmailDomain = (email) => {
    const emailLower = email.toLowerCase().trim();
    return emailLower.endsWith('@gmail.com') || emailLower.endsWith('@hotmail.com') || emailLower.endsWith('@outlook.com');
};

export function useAuth() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sd_user')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(true)

    // Escuchar cambios de otros componentes o sincronización diferida
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'sd_user' || !e.key) {
                const saved = localStorage.getItem('sd_user')
                if (saved) setUser(JSON.parse(saved))
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.addEventListener('storage', handleStorage)
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                if (!firebaseUser.emailVerified) {
                    setUser(null)
                    localStorage.removeItem('sd_user')
                    setLoading(false)
                    return
                }

                const u = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    createdAt: firebaseUser.metadata.creationTime,
                    emailVerified: firebaseUser.emailVerified
                }

                // --- NUEVO: Guardar/Actualizar en Firestore ---
                const userRef = doc(db, 'users', firebaseUser.uid)
                setDoc(userRef, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    lastLogin: serverTimestamp()
                }, { merge: true }).catch(err => console.error("Error al sincronizar usuario:", err))
                // ----------------------------------------------

                localStorage.setItem('sd_user', JSON.stringify(u))
                setUser(u)
            } else {
                localStorage.removeItem('sd_user')
                setUser(null)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const login = async (email, password) => {
        // --- NUEVO: Sanitización y Control de Fuerza Bruta ---
        const sanitizedEmail = email.trim().toLowerCase()
        const attempts = parseInt(localStorage.getItem(`sd_att_${sanitizedEmail}`) || '0')
        const lastAttempt = parseInt(localStorage.getItem(`sd_lock_${sanitizedEmail}`) || '0')
        const now = Date.now()

        // Bloqueo de 5 minutos si falló más de 5 veces
        if (attempts >= 5 && (now - lastAttempt) < 300000) {
            const remaining = Math.ceil((300000 - (now - lastAttempt)) / 60000)
            return { error: `Demasiados intentos. Tu cuenta está bloqueada por ${remaining} minuto(s).` }
        }

        try {
            const result = await signInWithEmailAndPassword(auth, sanitizedEmail, password)
            if (!result.user.emailVerified) {
                return { error: 'Por favor, verifica tu correo electrónico para continuar.', needsVerification: true }
            }

            // Resetear intentos si el login es exitoso
            localStorage.removeItem(`sd_att_${sanitizedEmail}`)
            localStorage.removeItem(`sd_lock_${sanitizedEmail}`)

            // Registrar actividad de seguridad
            const userRef = doc(db, 'users', result.user.uid)
            setDoc(userRef, {
                security: {
                    lastIp: 'Fetching...', // Se puede mejorar con un servicio de IP
                    userAgent: navigator.userAgent,
                    lastActivity: serverTimestamp()
                }
            }, { merge: true })

            return { ok: true, user: result.user }
        } catch (error) {
            // Incrementar intentos fallidos
            localStorage.setItem(`sd_att_${sanitizedEmail}`, (attempts + 1).toString())
            localStorage.setItem(`sd_lock_${sanitizedEmail}`, now.toString())

            let msg = 'Error al iniciar sesión'
            if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado'
            if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta'
            if (error.code === 'auth/invalid-credential') msg = 'Credenciales inválidas'
            if (error.code === 'auth/too-many-requests') msg = 'Demasiados intentos fallidos. Intenta más tarde.'

            return { error: msg }
        }
    }

    const register = async (name, email, password) => {
        if (!isValidEmailDomain(email)) {
            return { error: 'Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com' }
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(result.user, { displayName: name })
            await sendEmailVerification(result.user)

            return { ok: true, needsVerification: true }
        } catch (error) {
            let msg = 'Error al registrarse'
            if (error.code === 'auth/email-already-in-use') msg = 'Este correo ya está en uso'
            if (error.code === 'auth/operation-not-allowed') msg = 'Registro no habilitado'
            if (error.code === 'auth/weak-password') msg = 'La contraseña es muy debil'
            return { error: msg }
        }
    }

    const logout = async () => {
        await signOut(auth)
        localStorage.removeItem('sd_user')
        setUser(null)
    }

    const updateUser = async (data) => {
        if (!auth.currentUser) return
        try {
            const updates = {}
            if (data.name) updates.displayName = data.name
            if (data.photoURL !== undefined) updates.photoURL = data.photoURL

            if (Object.keys(updates).length > 0) {
                await updateProfile(auth.currentUser, {
                    displayName: updates.displayName || auth.currentUser.displayName,
                    photoURL: updates.photoURL !== undefined ? updates.photoURL : auth.currentUser.photoURL
                })
            }

            const u = { ...user, ...data }
            setUser(u)
            localStorage.setItem('sd_user', JSON.stringify(u))

            // Disparar evento para que useSync capture el cambio en el perfil
            window.dispatchEvent(new Event('storage'))
        } catch (error) {
            console.error("Error al actualizar usuario:", error)
        }
    }

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email)
            return { ok: true }
        } catch (error) {
            console.error("Firebase Reset Error:", error.code, error.message)
            let msg = 'Error al enviar el correo'
            if (error.code === 'auth/user-not-found') msg = 'No existe una cuenta con este correo'
            if (error.code === 'auth/too-many-requests') msg = 'Demasiados intentos. Intenta más tarde.'
            return { error: msg }
        }
    }

    return { user, login, register, logout, updateUser, resetPassword, loading }
}
