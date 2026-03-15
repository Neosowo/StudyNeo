import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const PostponeContext = createContext();

const STORAGE_KEY = 'sd_postpone_stats';
const LIVE_KEY = 'sd_postpone_live';

export function usePostpone() {
    return useContext(PostponeContext);
}

export function PostponeProvider({ children }) {
    const [now, setNow] = useState(new Date());
    const [currentState, setCurrentState] = useState('idle'); // 'idle', 'working', 'distracted'
    const [blockStart, setBlockStart] = useState(null);
    const [stats, setStats] = useState({ work: 0, lost: 0, interruptions: 0 });
    const [isMuted, setIsMuted] = useState(false); // If we want to add sound later, but for now just state

    const getTodayKey = () => new Date().toISOString().slice(0, 10);

    useEffect(() => {
        // First load
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.date === getTodayKey()) {
                    setStats({
                        work: data.workSeconds || 0,
                        lost: data.lostSeconds || 0,
                        interruptions: data.interruptions || 0
                    });
                }
            }
            // Also attempt to recover live session if we want to survive reloads
            const liveRaw = localStorage.getItem(LIVE_KEY);
            if (liveRaw) {
                const liveData = JSON.parse(liveRaw);
                if (liveData.date === getTodayKey() && liveData.blockStart) {
                    setCurrentState(liveData.currentState);
                    setBlockStart(liveData.blockStart);
                }
            }
        } catch (e) {}
    }, []);

    // Listen to Sync
    useEffect(() => {
        const handleSync = () => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.date === getTodayKey()) {
                    setStats({
                        work: data.workSeconds || 0,
                        lost: data.lostSeconds || 0,
                        interruptions: data.interruptions || 0
                    });
                }
            }
        };
        window.addEventListener('sd_sync_update', handleSync);
        return () => window.removeEventListener('sd_sync_update', handleSync);
    }, []);

    const savePersisted = (newStats) => {
        try {
            const dataToSave = {
                date: getTodayKey(),
                workSeconds: newStats.work,
                lostSeconds: newStats.lost,
                interruptions: newStats.interruptions
            };
            const stringified = JSON.stringify(dataToSave);
            localStorage.setItem(STORAGE_KEY, stringified);

            // Sincronización Inmediata a Firebase
            try {
                const meta = JSON.parse(localStorage.getItem('sd_meta') || '{}');
                const nowStr = new Date().toISOString();
                meta[STORAGE_KEY] = nowStr;
                localStorage.setItem('sd_meta', JSON.stringify(meta));
                window.dispatchEvent(new Event('storage'));

                if (auth?.currentUser) {
                    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', STORAGE_KEY);
                    setDoc(docRef, { value: dataToSave, updatedAt: nowStr }, { merge: true }).catch(() => {});
                }
            } catch (e) {}

        } catch (e) {}
    };

    // Save live session state to recover from F5
    useEffect(() => {
        try {
            if (currentState !== 'idle' && blockStart) {
                const dataToSave = { date: getTodayKey(), currentState, blockStart };
                const stringified = JSON.stringify(dataToSave);
                localStorage.setItem(LIVE_KEY, stringified);

                // Auto-sync LIVE as well so it survives
                const meta = JSON.parse(localStorage.getItem('sd_meta') || '{}');
                const nowStr = new Date().toISOString();
                meta[LIVE_KEY] = nowStr;
                localStorage.setItem('sd_meta', JSON.stringify(meta));
                window.dispatchEvent(new Event('storage'));

                if (auth?.currentUser) {
                    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', LIVE_KEY);
                    setDoc(docRef, { value: dataToSave, updatedAt: nowStr }, { merge: true }).catch(() => {});
                }
            } else {
                localStorage.removeItem(LIVE_KEY);
                if (auth?.currentUser) {
                     // We don't strictly need to delete it from Firebase, but we keep it clean
                     const meta = JSON.parse(localStorage.getItem('sd_meta') || '{}');
                     meta[LIVE_KEY] = new Date().toISOString();
                     localStorage.setItem('sd_meta', JSON.stringify(meta));
                }
            }
        } catch(e) {}
    }, [currentState, blockStart]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentBlockElapsed = () => {
        if (!blockStart) return 0;
        return (Date.now() - blockStart) / 1000;
    };

    const totalWorkSeconds = stats.work + (currentState === 'working' ? currentBlockElapsed() : 0);
    const totalLostSeconds = stats.lost + (currentState === 'distracted' ? currentBlockElapsed() : 0);

    const commitBlock = () => {
        if (!blockStart) return stats;
        const elapsed = Math.floor(currentBlockElapsed());
        let newStats = { ...stats };
        if (currentState === 'working') {
            newStats.work += elapsed;
        } else if (currentState === 'distracted') {
            newStats.lost += elapsed;
        }
        setStats(newStats);
        return newStats;
    };

    const handleStart = () => {
        setCurrentState('working');
        setBlockStart(Date.now());
    };

    const handleLostFocus = () => {
        const newStats = commitBlock();
        newStats.interruptions += 1;
        setStats(newStats);
        savePersisted(newStats);
        
        setCurrentState('distracted');
        setBlockStart(Date.now());
    };

    const handleResume = () => {
        const newStats = commitBlock();
        setStats(newStats);
        savePersisted(newStats);

        setCurrentState('working');
        setBlockStart(Date.now());
    };

    const handleEnd = () => {
        const newStats = commitBlock();
        setStats(newStats);
        savePersisted(newStats);

        setCurrentState('idle');
        setBlockStart(null);
    };

    const handleReset = () => {
        setCurrentState('idle');
        setBlockStart(null);
        const newStats = { work: 0, lost: 0, interruptions: 0 };
        setStats(newStats);
        savePersisted(newStats);
    };

    const formatHMS = (seconds) => {
        const s = Math.max(0, Math.floor(seconds));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const contextValue = {
        now,
        currentState,
        stats,
        currentBlockElapsed,
        totalWorkSeconds,
        totalLostSeconds,
        handleStart,
        handleLostFocus,
        handleResume,
        handleEnd,
        handleReset,
        formatHMS
    };

    return (
        <PostponeContext.Provider value={contextValue}>
            {children}
        </PostponeContext.Provider>
    );
}
