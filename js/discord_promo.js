const DISCORD_HIDE_KEY = 'PyNeo-discord-hide';
const DISCORD_SESSION_HIDE = 'PyNeo-discord-session-hide';
const DISCORD_LINK = 'https://discord.gg/wxU5A53br4'; // Reemplázalo con tu link real de Discord

function initDiscordPromo() {
    const hideStatus = localStorage.getItem(DISCORD_HIDE_KEY);
    if (hideStatus === 'permanent') return;

    // Si ya lo ocultó en esta sesión, no molestar
    if (sessionStorage.getItem(DISCORD_SESSION_HIDE)) return;

    createDiscordUI();
}

function createDiscordUI() {
    // Evitar duplicados
    if (document.getElementById('discord-promo')) return;

    const promo = document.createElement('div');
    promo.id = 'discord-promo';
    // Estilos base usando Tailwind para coherencia
    promo.className = 'fixed bottom-6 left-6 z-[150] max-w-[320px] md:max-w-sm animate-fade-in-up';

    promo.innerHTML = `
        <div class="bg-[#1e1f22]/95 border border-[#5865f2]/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <!-- Discord-like glow -->
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-[#5865f2]/10 rounded-full blur-3xl group-hover:bg-[#5865f2]/20 transition-all duration-700"></div>
            
            <div class="flex items-start gap-4 relative z-10">
                <div class="w-12 h-12 bg-[#5865f2] rounded-2xl flex items-center justify-center shadow-lg shadow-[#5865f2]/20 shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                    <i class="fab fa-discord text-2xl text-white"></i>
                </div>
                <div>
                    <h4 class="text-white font-black text-lg leading-tight mb-1">¡Comunidad Discord! 🚀</h4>
                    <p class="text-gray-400 text-[11px] leading-relaxed mb-4">Únete para resolver dudas, compartir tus códigos y conocer a otros estudiantes de PyNeo.</p>
                    
                    <div class="flex flex-col gap-2">
                        <a href="${DISCORD_LINK}" target="_blank" onclick="handleDiscordAction('join')" 
                           class="bg-[#5865f2] hover:bg-[#4752c4] text-white text-center py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#5865f2]/30 active:scale-95">
                            Unirse ahora
                        </a>
                        <div class="flex gap-2">
                            <button onclick="handleDiscordAction('later')" 
                                    class="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg text-[10px] font-bold transition-all border border-white/5 uppercase tracking-wider">
                                Recordar más tarde
                            </button>
                            <button onclick="handleDiscordAction('never')" 
                                    class="flex-1 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-red-400 py-2 rounded-lg text-[10px] font-bold transition-all border border-white/5 uppercase tracking-wider">
                                No mostrar más
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Close icon small -->
            <button onclick="handleDiscordAction('later')" class="absolute top-3 right-3 text-gray-600 hover:text-white transition-colors">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>
    `;

    document.body.appendChild(promo);
}

function handleDiscordAction(action) {
    const promo = document.getElementById('discord-promo');
    if (promo) {
        promo.classList.remove('animate-fade-in-up');
        promo.classList.add('animate-fade-out-down');
    }

    setTimeout(() => {
        if (promo) promo.remove();

        if (action === 'later') {
            sessionStorage.setItem(DISCORD_SESSION_HIDE, 'true');
        } else if (action === 'never') {
            localStorage.setItem(DISCORD_HIDE_KEY, 'permanent');
        } else if (action === 'join') {
            // Si se une, lo ocultamos permanentemente para no molestar más
            localStorage.setItem(DISCORD_HIDE_KEY, 'permanent');
        }
    }, 500);
}

if (!document.getElementById('discord-promo-styles')) {
    const style = document.createElement('style');
    style.id = 'discord-promo-styles';
    style.textContent = `
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-out-down {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(30px) scale(0.95); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-out-down { animation: fade-out-down 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
    `;
    document.head.appendChild(style);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDiscordPromo, 3000);
    });
} else {
    setTimeout(initDiscordPromo, 3000);
}
