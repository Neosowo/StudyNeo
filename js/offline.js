// =====================================================
// PyNeo Offline Manager
// Gestión de estado online/offline + sincronización
// =====================================================

(function () {
    'use strict';

    // ── Registro del Service Worker ───────────────────
    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        const pageUrl = location.href;
        const basePath = pageUrl.endsWith('/') ? pageUrl : pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1);
        const swUrl = basePath + 'sw.js';
        const scopeDir = new URL(basePath).pathname;

        navigator.serviceWorker.register(swUrl, { scope: scopeDir })
            .then(reg => {
                console.log('[Offline] SW registrado:', reg.scope);

                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'SYNC_COMPLETE') {
                        handleReconnection();
                    }
                });

                if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            })
            .catch(err => console.warn('[Offline] SW no disponible:', err.message));
    }

    // ── Estilos de animación (inyectados una sola vez) ─
    function injectStyles() {
        if (document.getElementById('pyneo-offline-styles')) return;
        const style = document.createElement('style');
        style.id = 'pyneo-offline-styles';
        style.textContent = `
            @keyframes pulse-green {
                0%, 100% { opacity: 1; transform: scale(1); }
                50%       { opacity: 0.7; transform: scale(1.3); }
            }
            @keyframes blink-red {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0.3; }
            }
            @keyframes pulse-wifi {
                0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
                50%       { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
            }
        `;
        document.head.appendChild(style);
    }

    // ── Notificación que aparece y desaparece ─────────
    let toastTimeout = null;

    function showNetworkNotification(isOnline) {
        injectStyles();

        // Usar showNotification de app.js si ya está cargada (mismo sistema)
        if (typeof showNotification === 'function') {
            if (isOnline) {
                showNotification('✅ Conexión restaurada — sincronizando', 'success');
            } else {
                showNotification('📡 Sin conexión — modo offline', 'error');
            }
            return;
        }

        // Fallback: toast simple que desaparece solo
        const existing = document.getElementById('pyneo-network-toast');
        if (existing) existing.remove();
        if (toastTimeout) clearTimeout(toastTimeout);

        const color = isOnline
            ? { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', text: '#86efac', dot: '#22c55e', anim: 'pulse-green' }
            : { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#fca5a5', dot: '#ef4444', anim: 'blink-red' };

        const toast = document.createElement('div');
        toast.id = 'pyneo-network-toast';
        toast.style.cssText = `
            position:fixed; top:80px; left:50%;
            transform:translateX(-50%) translateY(-12px);
            z-index:9999; display:flex; align-items:center; gap:10px;
            padding:10px 20px; border-radius:50px;
            background:${color.bg}; border:1px solid ${color.border}; color:${color.text};
            font-family:'Google Sans Code','JetBrains Mono',monospace;
            font-size:12px; font-weight:700; letter-spacing:0.04em;
            backdrop-filter:blur(16px); box-shadow:0 8px 32px rgba(0,0,0,0.4);
            opacity:0; transition:opacity 0.35s ease, transform 0.35s ease;
            pointer-events:none; white-space:nowrap;
        `;
        toast.innerHTML = `
            <span style="width:8px;height:8px;border-radius:50%;background:${color.dot};box-shadow:0 0 8px ${color.dot};flex-shrink:0;animation:${color.anim} 1s infinite;"></span>
            <span>${isOnline ? 'Conexión restaurada' : 'Sin conexión — modo offline'}</span>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
            });
        });

        const delay = isOnline ? 3000 : 5000;
        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
        }, delay);
    }

    // ── Helper: pausar/reanudar Firebase cuando esté listo
    function controlFirebaseNetwork(action, retries) {
        if (retries === undefined) retries = 15;
        if (typeof db !== 'undefined' && db && typeof db[action] === 'function') {
            db[action]().catch(() => { });
        } else if (retries > 0) {
            setTimeout(() => controlFirebaseNetwork(action, retries - 1), 500);
        }
    }

    // ── Sincronización automática con Firebase ────────
    function handleReconnection() {
        console.log('[Offline] Reconectado. Sincronizando...');

        if (typeof db !== 'undefined' && db && typeof currentUser !== 'undefined' && currentUser) {
            try {
                const progressEl = document.getElementById('overall-progress');
                const userProgress = progressEl ? progressEl.innerText : '0%';
                const userColor = typeof getUserColor === 'function' ? getUserColor(currentUser) : '#ffffff';

                db.collection('presence').doc(currentUser).set({
                    user: currentUser,
                    lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                    progress: userProgress,
                    color: userColor
                }).then(() => {
                    console.log('[Offline] Presencia sincronizada.');
                }).catch(err => console.warn('[Offline] Error al sincronizar:', err));
            } catch (e) {
                console.warn('[Offline] Firebase no disponible aún:', e);
            }
        }
    }

    // ── Listeners de red ──────────────────────────────
    function setupNetworkListeners() {
        let offlineNotified = false;

        window.addEventListener('online', () => {
            offlineNotified = false;

            // Reactivar Firebase
            controlFirebaseNetwork('enableNetwork');

            showNetworkNotification(true);
            handleReconnection();

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.sync.register('pyneo-sync').catch(() => { });
                });
            }
        });

        window.addEventListener('offline', () => {
            // Pausar Firebase → elimina el spam de errores WebChannelConnection
            controlFirebaseNetwork('disableNetwork');

            if (!offlineNotified) {
                offlineNotified = true;
                showNetworkNotification(false);
            }
        });

        // Estado inicial: si ya está offline al cargar
        if (!navigator.onLine) {
            offlineNotified = true;
            setTimeout(() => {
                showNetworkNotification(false);
                controlFirebaseNetwork('disableNetwork');
            }, 1500); // delay para que Firebase se inicialice primero
        }
    }

    // ── API pública para chat.js ──────────────────────
    window.PyNeoOffline = {
        isOnline: () => navigator.onLine,

        showChatOfflineMessage: function (messagesContainer) {
            if (!messagesContainer) return;
            injectStyles();

            messagesContainer.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1rem;text-align:center;gap:12px;">
                    <div style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.1);border:1.5px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;animation:pulse-wifi 2s infinite;">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23"/>
                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
                            <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                            <line x1="12" y1="20" x2="12.01" y2="20"/>
                        </svg>
                    </div>
                    <p style="font-size:13px;font-weight:700;color:#fca5a5;margin:0;">Sin conexión a internet</p>
                    <p style="font-size:11px;color:#64748b;line-height:1.5;margin:0;">
                        El chat global requiere internet.<br>
                        Se abrirá automáticamente al reconectar.
                    </p>
                    <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:#475569;margin-top:4px;">
                        <span style="width:6px;height:6px;border-radius:50%;background:#ef4444;animation:blink-red 1s infinite;"></span>
                        Esperando conexión…
                    </div>
                </div>
            `;
        }
    };

    // ── Inicialización ────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            registerServiceWorker();
            setupNetworkListeners();
        });
    } else {
        registerServiceWorker();
        setupNetworkListeners();
    }

})();
