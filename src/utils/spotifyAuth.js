/**
 * Spotify PKCE OAuth — Popup flow (no full page redirect).
 * Client ID from VITE_SPOTIFY_CLIENT_ID env variable.
 * Redirect URI = <origin>/callback.html  (works on localhost AND GitHub Pages)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'user-top-read',
    'user-read-currently-playing',
].join(' ')

/** The callback URI — always <origin>/callback.html */
function getCallbackUri() {
    // In dev (Vite): http://localhost:5173/callback.html
    // In XAMPP (built): needs /StudyNeo/callback.html
    // On GitHub Pages: https://neosowo.github.io/StudyNeo/callback.html
    const base = window.location.origin + window.location.pathname
        .replace(/\/index\.html$/, '')  // strip index.html
        .replace(/\/?$/, '/')           // ensure trailing slash
    return base + 'callback.html'
}

export function getCurrentRedirectUri() {
    return getCallbackUri()
}

function base64urlEncode(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function generatePKCE() {
    const verifier = base64urlEncode(crypto.getRandomValues(new Uint8Array(48)))
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const challenge = base64urlEncode(hash)
    return { verifier, challenge }
}

async function exchangeCode(code, redirectUri, verifier) {
    const res = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: CLIENT_ID,
            code_verifier: verifier,
        }),
    })
    if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`)
    return res.json()
}

/**
 * Opens a popup to Spotify auth, waits for callback, exchanges code.
 * Returns { ok: true } on success, { ok: false, error } on failure.
 */
export async function connectSpotify() {
    const { verifier, challenge } = await generatePKCE()
    const state = crypto.getRandomValues(new Uint8Array(12))
        .reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')
    const redirectUri = getCallbackUri()

    // Store PKCE data for the exchange
    localStorage.setItem('spotify_pkce_verifier', verifier)
    localStorage.setItem('spotify_pkce_state', state)
    localStorage.setItem('spotify_redirect_uri', redirectUri)
    // Clear any stale callback data
    localStorage.removeItem('spotify_callback_code')
    localStorage.removeItem('spotify_callback_state')
    localStorage.removeItem('spotify_callback_error')

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: redirectUri,
        state,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    })

    const authUrl = `${SPOTIFY_AUTH_URL}?${params}`
    const popup = window.open(authUrl, 'SpotifyAuth',
        'width=480,height=660,scrollbars=yes,popup=yes')

    return new Promise((resolve) => {
        // Listen for postMessage from callback.html (same origin)
        const onMessage = async (event) => {
            if (event.data?.type !== 'SPOTIFY_CALLBACK') return
            window.removeEventListener('message', onMessage)
            clearInterval(pollInterval)
            popup?.close()
            await finishExchange(event.data.code, event.data.state, state, verifier, redirectUri, resolve)
        }
        window.addEventListener('message', onMessage)

        // Fallback: poll localStorage (cross-origin or blocked postMessage)
        const pollInterval = setInterval(async () => {
            const code = localStorage.getItem('spotify_callback_code')
            const callbackState = localStorage.getItem('spotify_callback_state')
            const error = localStorage.getItem('spotify_callback_error')

            if (error) {
                clearInterval(pollInterval)
                window.removeEventListener('message', onMessage)
                localStorage.removeItem('spotify_callback_error')
                resolve({ ok: false, error })
                return
            }

            if (code && callbackState) {
                clearInterval(pollInterval)
                window.removeEventListener('message', onMessage)
                popup?.close()
                localStorage.removeItem('spotify_callback_code')
                localStorage.removeItem('spotify_callback_state')
                await finishExchange(code, callbackState, state, verifier, redirectUri, resolve)
                return
            }

            // Popup closed without completing
            if (popup?.closed) {
                clearInterval(pollInterval)
                window.removeEventListener('message', onMessage)
                resolve({ ok: false, error: 'Ventana cerrada' })
            }
        }, 600)
    })
}

async function finishExchange(code, callbackState, expectedState, verifier, redirectUri, resolve) {
    if (callbackState !== expectedState) {
        resolve({ ok: false, error: 'State mismatch (CSRF check failed)' })
        return
    }
    try {
        const data = await exchangeCode(code, redirectUri, verifier)
        localStorage.setItem('spotify_access_token', data.access_token)
        if (data.refresh_token) localStorage.setItem('spotify_refresh_token', data.refresh_token)
        localStorage.setItem('spotify_token_expires', String(Date.now() + data.expires_in * 1000))
        localStorage.removeItem('spotify_pkce_verifier')
        localStorage.removeItem('spotify_pkce_state')
        resolve({ ok: true })
    } catch (e) {
        resolve({ ok: false, error: e.message })
    }
}

export async function refreshSpotifyToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token')
    if (!refreshToken) return null
    try {
        const res = await fetch(SPOTIFY_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
            }),
        })
        if (!res.ok) return null
        const data = await res.json()
        localStorage.setItem('spotify_access_token', data.access_token)
        localStorage.setItem('spotify_token_expires', String(Date.now() + data.expires_in * 1000))
        return data.access_token
    } catch { return null }
}

export function getSpotifyToken() {
    const token = localStorage.getItem('spotify_access_token')
    const expires = parseInt(localStorage.getItem('spotify_token_expires') || '0')
    if (!token || Date.now() >= expires - 60000) return null
    return token
}

export function isSpotifyConnected() {
    return !!getSpotifyToken() || !!localStorage.getItem('spotify_refresh_token')
}

export function disconnectSpotify() {
    ['spotify_access_token', 'spotify_refresh_token', 'spotify_token_expires',
        'spotify_pkce_verifier', 'spotify_pkce_state',
        'spotify_redirect_uri', 'spotify_callback_code', 'spotify_callback_state',
    ].forEach(k => localStorage.removeItem(k))
}

export async function fetchSpotifyProfile(token) {
    try {
        const res = await fetch('https://api.spotify.com/v1/me',
            { headers: { Authorization: `Bearer ${token}` } })
        return res.ok ? res.json() : null
    } catch { return null }
}

export async function fetchSpotifyPlaylists(token) {
    try {
        const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20',
            { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return []
        const data = await res.json()
        return data.items || []
    } catch { return [] }
}
