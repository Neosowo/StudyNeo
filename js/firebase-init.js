const firebaseConfig = {
    apiKey: "AIzaSyAo5xKTrkOqFQrs8T9n42RJb7HZ307UB5E",
    authDomain: "chromatic-realm-321912.firebaseapp.com",
    projectId: "chromatic-realm-321912",
    storageBucket: "chromatic-realm-321912.firebasestorage.app",
    messagingSenderId: "938232603302",
    appId: "1:938232603302:web:bbce7484e0c71d93370a67",
    measurementId: "G-8QNQZ7LSE3"
};

let db = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        console.log('[Firebase] Inicializado correctamente.');
    } catch (e) {
        console.error('[Firebase] Error al inicializar:', e);
    }
}

// Iniciar automáticamente si el SDK está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
} else {
    initFirebase();
}

function getUserColor(username) {
    const currentUser = localStorage.getItem('pyneo_chat_user');
    // If it's me, use my unlocked color OR default to white (novato)
    if (username === currentUser) {
        return localStorage.getItem('PyNeo-user-color') || '#ffffff';
    }

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#f472b6', '#38bdf8', '#c084fc', '#4ade80', '#fbbf24', '#f87171'];
    return colors[Math.abs(hash) % colors.length];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
