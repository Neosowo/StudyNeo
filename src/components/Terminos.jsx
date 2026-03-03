import { BookOpen, ArrowLeft, FileText, CheckSquare, AlertTriangle, Zap, Scale, RefreshCw, ShieldOff, Mail } from 'lucide-react'

function PageHeader({ onBack }) {
    return (
        <header style={{
            background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
            position: 'sticky', top: 0, zIndex: 100
        }}>
            <button
                onClick={onBack}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600,
                    fontSize: '0.875rem', padding: '6px 10px', borderRadius: '8px', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
                <ArrowLeft size={16} /> Volver al inicio
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                <div style={{
                    width: '1.875rem', height: '1.875rem', borderRadius: '9px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <BookOpen size={14} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', fontSize: '1rem' }}>StudyNeo</span>
            </div>
        </header>
    )
}

function Section({ icon: Icon, title, children }) {
    return (
        <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '16px', padding: '1.75rem', marginBottom: '1.25rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '11px',
                    background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    <Icon size={18} color="var(--accent)" />
                </div>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>{title}</h2>
            </div>
            <div style={{ color: 'var(--text-3)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
                {children}
            </div>
        </div>
    )
}

export default function Terminos({ onBack }) {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            <PageHeader onBack={onBack} />

            <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
                {/* Hero */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <FileText size={26} color="var(--accent)" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                                Términos de Uso
                            </h1>
                            <p style={{ color: 'var(--text-4)', fontSize: '0.8125rem', margin: '4px 0 0' }}>
                                Vigentes desde: 03 de marzo de 2026 · StudyNeo
                            </p>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1.75, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem 1.25rem', margin: 0 }}>
                        Al crear una cuenta o usar StudyNeo, aceptas estos términos. Están escritos en español claro y sin jerga legal innecesaria porque creo que mereces entender qué estás aceptando. Si tienes alguna duda, escríbeme.
                    </p>
                </div>

                <Section icon={CheckSquare} title="1. ¿Qué es StudyNeo?">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo es una aplicación web gratuita de productividad académica diseñada para ayudarte a organizar tu estudio. Incluye herramientas como:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.4rem' }}>Editor de notas persistente</li>
                        <li style={{ marginBottom: '0.4rem' }}>Flashcards con repetición espaciada</li>
                        <li style={{ marginBottom: '0.4rem' }}>Gestor de tareas y proyectos</li>
                        <li style={{ marginBottom: '0.4rem' }}>Calendario de exámenes y eventos</li>
                        <li style={{ marginBottom: '0.4rem' }}>Temporizador Pomodoro</li>
                        <li style={{ marginBottom: '0.4rem' }}>Seguimiento de hábitos con racha diaria</li>
                        <li>Sincronización en la nube opcional</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        StudyNeo es un proyecto personal creado por Erick. No es una empresa, no tiene financiación externa y se mantiene activo gracias al esfuerzo personal y el apoyo voluntario de la comunidad.
                    </p>
                </Section>

                <Section icon={Scale} title="2. Aceptación de los términos">
                    <p style={{ marginBottom: '0.75rem' }}>
                        Al acceder a StudyNeo, registrarte con una cuenta o simplemente usar la aplicación, confirmas que:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Has leído y comprendido estos Términos de Uso.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Aceptas cumplirlos en su totalidad.</li>
                        <li>Si eres menor de 13 años, que tienes el permiso de un adulto responsable para usar la app.</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        Si no estás de acuerdo con alguno de estos términos, por favor no uses StudyNeo.
                    </p>
                </Section>

                <Section icon={CheckSquare} title="3. Uso permitido">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo está diseñado para uso personal y educativo. Puedes:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Crear y gestionar todo tu contenido de estudio (notas, tareas, flashcards, etc.)</li>
                        <li style={{ marginBottom: '0.5rem' }}>Compartir notas específicas con otras personas a través de links de solo lectura.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Usar StudyNeo en múltiples dispositivos con la misma cuenta.</li>
                        <li>Usar la app completamente sin internet gracias al modo offline.</li>
                    </ul>
                </Section>

                <Section icon={AlertTriangle} title="4. Uso prohibido">
                    <p style={{ marginBottom: '0.75rem' }}>
                        La siguiente conducta está <strong style={{ color: 'var(--text-2)' }}>estrictamente prohibida</strong> en StudyNeo:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Almacenar o distribuir contenido ilegal, violento, discriminatorio o que viole derechos de terceros.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Intentar acceder a cuentas, datos o sistemas que no te pertenecen.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Realizar ataques de fuerza bruta, inyección de código u otras formas de hacking.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Usar StudyNeo para fines comerciales sin autorización expresa.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Crear cuentas falsas, suplantar identidades o engañar a otros usuarios.</li>
                        <li>Abusar de los recursos del servidor de forma que afecte la disponibilidad del servicio para otros usuarios.</li>
                    </ul>
                    <p style={{ margin: 0, padding: '0.75rem', background: 'rgba(212,32,32,0.08)', borderRadius: '8px', border: '1px solid rgba(212,32,32,0.2)', color: 'var(--red)', fontWeight: 600, fontSize: '0.875rem' }}>
                        El incumplimiento de estas normas puede resultar en la suspensión o eliminación permanente de tu cuenta sin previo aviso.
                    </p>
                </Section>

                <Section icon={Zap} title="5. Disponibilidad del servicio">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo es un proyecto gratuito mantenido por una sola persona. Por eso:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>No garantizamos una disponibilidad del 100%. Pueden existir interrupciones por mantenimiento, fallos técnicos o problemas con Firebase.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Sin embargo, gracias al <strong style={{ color: 'var(--text-2)' }}>modo offline</strong>, siempre tendrás acceso a tu información guardada localmente en tu dispositivo, incluso si los servidores están caídos.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Me reservo el derecho de modificar, pausar o discontinuar cualquier función del servicio en cualquier momento.</li>
                        <li>En caso de discontinuación del servicio, avisaremos con anticipación razonable para que puedas respaldar tu información.</li>
                    </ul>
                </Section>

                <Section icon={ShieldOff} title="6. Limitación de responsabilidad">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo se proporciona <strong style={{ color: 'var(--text-2)' }}>"tal como está"</strong> y <strong style={{ color: 'var(--text-2)' }}>"según disponibilidad"</strong>. No me hago responsable de:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Pérdida de datos ocasionada por fallo del dispositivo, del navegador o del almacenamiento local.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Interrupciones del servicio de Firebase que puedan afectar la sincronización.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Consecuencias derivadas del uso o mal uso de la información almacenada en la app.</li>
                        <li>Daños indirectos, incidentales o consecuentes surgidos del uso de StudyNeo.</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        Te recomendamos hacer copias de seguridad periódicas de la información crítica. StudyNeo es una herramienta de apoyo, no un sistema de respaldo oficial de datos.
                    </p>
                </Section>

                <Section icon={FileText} title="7. Propiedad intelectual">
                    <p style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ color: 'var(--text-2)' }}>Tu contenido es tuyo.</strong> Todo lo que creas dentro de StudyNeo (notas, flashcards, tareas, etc.) te pertenece en su totalidad. StudyNeo no reclama ningún derecho sobre tu contenido.
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                        El código fuente, diseño, marca y nombre "StudyNeo" son propiedad de su creador, Erick. No puedes reproducir, distribuir ni crear trabajos derivados de StudyNeo sin autorización expresa.
                    </p>
                    <p style={{ margin: 0 }}>
                        Al usar StudyNeo, me concedes permiso limitado para almacenar y transmitir tu contenido exclusivamente con el propósito de brindarte el servicio (por ejemplo, sincronización entre dispositivos).
                    </p>
                </Section>

                <Section icon={RefreshCw} title="8. Cambios a estos términos">
                    <p style={{ marginBottom: '0.75rem' }}>
                        Puedo actualizar estos Términos de Uso en cualquier momento. Cuando lo haga:
                    </p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Actualizaremos la fecha al inicio de este documento.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Si los cambios son significativos, los comunicaremos mediante una notificación dentro de la aplicación.</li>
                        <li>El uso continuado de StudyNeo después de la notificación implica la aceptación de los nuevos términos.</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        Si no estás de acuerdo con los cambios, puedes eliminar tu cuenta en cualquier momento antes de que entren en vigor.
                    </p>
                </Section>

                <Section icon={Mail} title="9. Contacto">
                    <p style={{ margin: 0 }}>
                        Si tienes dudas, sugerencias o reportes relacionados con estos términos, puedes contactarme en:
                        <br />
                        <a href="mailto:studyneo.sup@gmail.com" style={{ color: 'var(--accent)', fontWeight: 700 }}>studyneo.sup@gmail.com</a>
                        <br /><br />
                        Responderé en un plazo máximo de 48–72 horas hábiles. Tu opinión me ayuda a mejorar.
                    </p>
                </Section>

                <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-3)', marginBottom: '0.25rem' }}>
                        © 2026 StudyNeo — Hecho con ❤️ por Erick
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', margin: 0 }}>
                        Vigente desde el 03 de marzo de 2026
                    </p>
                </div>
            </main>
        </div>
    )
}
