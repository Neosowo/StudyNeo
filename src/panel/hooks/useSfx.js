/**
 * useSfx — Global UI sound-feedback hook
 * Reads 'sd_sound_enabled' from localStorage before playing.
 */
const SFX_URLS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    delete: 'https://assets.mixkit.co/active_storage/sfx/256/256-preview.mp3',
    pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    tab: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    toggle: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    create: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
}

const VOLUMES = {
    click: 0.25, success: 0.35, delete: 0.3, pop: 0.25, tab: 0.2, toggle: 0.2, create: 0.35,
}

export function useSfx() {
    const play = (type = 'click') => {
        try {
            const enabled = JSON.parse(localStorage.getItem('sd_sound_enabled') ?? 'true')
            if (!enabled) return
            const url = SFX_URLS[type] ?? SFX_URLS.click
            const audio = new Audio(url)
            audio.volume = VOLUMES[type] ?? 0.25
            audio.play().catch(() => { })
        } catch { }
    }

    return { play }
}
