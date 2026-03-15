import React from 'react';
import { Play, Pause, Square, AlertCircle, RotateCcw, Maximize2 } from 'lucide-react';
import { usePostpone } from '../context/PostponeContext';
import { useWidgets } from '../components/FloatingWidgets';

export default function Postpone() {
    const { openWidget } = useWidgets();
    const {
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
    } = usePostpone();

    const getDayProgressPct = () => {
        const elapsed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        return (elapsed / 86400) * 100;
    };

    const effTotal = totalWorkSeconds + totalLostSeconds;
    const efficiency = effTotal > 0 ? Math.round((totalWorkSeconds / effTotal) * 100) : null;

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Postpone
                    </h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>
                        Foco basado en compromiso activo. Declara iniciar sesión y evita distracciones.
                    </p>
                </div>
                <button
                    onClick={() => openWidget('postpone')}
                    style={{
                        padding: '0.6rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                        borderRadius: '10px', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                    }}
                >
                    <Maximize2 size={16} /> Abrir en ventana
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                
                {/* Visualizer card */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hora local</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{getDayProgressPct().toFixed(1)}% del día</span>
                    </div>

                    <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: 'var(--text-1)', tabularNums: 'true', lineHeight: 1, marginBottom: '2rem' }}>
                        {formatHMS(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())}
                    </div>

                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-hover)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <div style={{ height: '100%', width: `${getDayProgressPct()}%`, background: 'var(--text-2)', transition: 'width 1s linear' }} />
                    </div>

                    <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        {currentState === 'idle' && (
                            <p style={{ color: 'var(--text-3)', textAlign: 'center', fontWeight: 500 }}>
                                Declara que vas a trabajar.<br />
                                El sistema medirá tu foco real.
                            </p>
                        )}
                        {currentState === 'working' && (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Tiempo de foco activo</p>
                                <p style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 900, color: 'var(--text-1)', tabularNums: 'true', lineHeight: 1 }}>
                                    {formatHMS(currentBlockElapsed())}
                                </p>
                            </div>
                        )}
                        {currentState === 'distracted' && (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Tiempo fuera de foco</p>
                                <p style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 900, color: 'var(--red)', tabularNums: 'true', lineHeight: 1, animation: 'pulse 1.5s infinite' }}>
                                    {formatHMS(currentBlockElapsed())}
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', width: '100%' }}>
                        {currentState === 'idle' && (
                            <>
                                <button onClick={handleStart} className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Play size={18} fill="currentColor" /> Iniciar Sesión de Foco
                                </button>
                                {(stats.work > 0 || stats.lost > 0) && (
                                    <button onClick={handleReset} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-3)', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <RotateCcw size={18} />
                                    </button>
                                )}
                            </>
                        )}
                        {currentState === 'working' && (
                            <>
                                <button onClick={handleLostFocus} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                    <AlertCircle size={18} /> Perdí el foco
                                </button>
                                <button onClick={handleEnd} style={{ padding: '1rem', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-2)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                    <Square size={18} fill="currentColor" /> Terminar
                                </button>
                            </>
                        )}
                        {currentState === 'distracted' && (
                            <>
                                <button onClick={handleResume} style={{ flex: 1, padding: '1rem', background: 'var(--red)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                    <Play size={18} fill="currentColor" /> Retomar trabajo
                                </button>
                                <button onClick={handleEnd} style={{ padding: '1rem', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-2)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                                    <Square size={18} fill="currentColor" /> Terminar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '2rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                            Estadísticas de Hoy
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Foco Total</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', tabularNums: 'true', lineHeight: 1 }}>
                                    {formatHMS(totalWorkSeconds)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Tiempo Perdido</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--red)', tabularNums: 'true', lineHeight: 1 }}>
                                    {formatHMS(totalLostSeconds)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Eficiencia</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', tabularNums: 'true', lineHeight: 1 }}>
                                    {efficiency !== null ? `${efficiency}%` : '—'}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Interrupciones</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', tabularNums: 'true', lineHeight: 1 }}>
                                    {stats.interruptions}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                                {efficiency !== null && (
                                    <>
                                        <div style={{ height: '100%', width: `${efficiency}%`, background: 'var(--text-1)', transition: 'width 0.5s' }} />
                                        <div style={{ height: '100%', width: `${100 - efficiency}%`, background: 'var(--red)', transition: 'width 0.5s' }} />
                                    </>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Foco</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Distracción</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
