import { BookOpen, ArrowLeft, Shield, Lock, Database, Eye, Server, UserX, Bell, Globe } from 'lucide-react'

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

export default function Privacidad({ onBack }) {
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
                            <Shield size={26} color="var(--accent)" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                                Política de Privacidad
                            </h1>
                            <p style={{ color: 'var(--text-4)', fontSize: '0.8125rem', margin: '4px 0 0' }}>
                                Última actualización: 03 de marzo de 2026 · StudyNeo
                            </p>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1.75, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        En StudyNeo creemos que tu información personal es tuya y solo tuya. Esta política explica de forma clara y honesta qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos. No usamos lenguaje legal confuso a propósito — queremos que entiendas todo.
                    </p>
                </div>

                <Section icon={Database} title="1. Datos que recopilamos">
                    <p style={{ marginBottom: '0.75rem' }}>StudyNeo recopila únicamente los datos estrictamente necesarios para que la app funcione. Estos son:</p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Datos de cuenta:</strong> Tu nombre (el que eliges al registrarte) y dirección de correo electrónico. Son usados exclusivamente para identificarte dentro de la app.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Contenido creado por ti:</strong> Notas, tareas, flashcards, hábitos, eventos de calendario, temporizadores Pomodoro, y cualquier otra información que introduzcas voluntariamente en la aplicación.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Preferencias:</strong> Tu tema visual seleccionado (oscuro, claro, sakura, etc.) y configuraciones de la aplicación.</li>
                        <li><strong style={{ color: 'var(--text-2)' }}>Metadatos de sincronización:</strong> Marcas de tiempo (timestamps) para resolver conflictos cuando usas más de un dispositivo. Nunca incluyen contenido de tu información.</li>
                    </ul>
                    <p style={{ margin: 0, padding: '0.75rem', background: 'var(--accent-dim)', borderRadius: '8px', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem' }}>
                        🚫 No recopilamos: analytics de uso, historial de navegación, dirección IP, información del dispositivo, comportamiento dentro de la app ni datos publicitarios.
                    </p>
                </Section>

                <Section icon={Server} title="2. Dónde se almacenan tus datos">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo sigue una arquitectura <strong style={{ color: 'var(--text-2)' }}>offline-first</strong>. Esto significa que tus datos viven <em>primero</em> en tu dispositivo:
                    </p>
                    <ul style={{ margin: '0 0 1rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>LocalStorage del navegador:</strong> Es el almacenamiento principal. Funciona sin internet y jamás abandona tu dispositivo sin tu consentimiento implícito (sincronización).</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Firebase Firestore (Google Cloud):</strong> Si tienes internet y una cuenta activa, tus datos se sincronizan de forma cifrada en la infraestructura de Google. Esto permite el acceso multi-dispositivo. Firebase cumple con GDPR y SOC 2.</li>
                        <li><strong style={{ color: 'var(--text-2)' }}>Sin servidores propios:</strong> StudyNeo no tiene un servidor backend propio. Todo pasa directamente entre tu dispositivo y Firebase.</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        Si pierdes conexión a internet o se agota la cuota gratuita de Firebase, la app sigue funcionando al 100% de forma local. Cuando se restablece el servicio, los datos se sincronizan automáticamente sin pérdida de información.
                    </p>
                </Section>

                <Section icon={Eye} title="3. Quién puede ver tus datos">
                    <p style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ color: 'var(--text-2)' }}>Solo tú.</strong> El acceso a los datos está controlado por Firebase Authentication. Cada usuario tiene una clave única (UID) que separa completamente sus datos de los de cualquier otro usuario.
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                        El creador de StudyNeo tiene acceso técnico a la consola de Firebase (necesario para administrar el proyecto), pero esto no implica acceso al contenido de tus notas, tareas ni ningún otro dato personal. Las reglas de seguridad de Firebase están configuradas para que solo el propietario de cada documento pueda leerlo o modificarlo.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: 'var(--text-2)' }}>No vendemos, alquilamos ni compartimos</strong> tu información con terceros, anunciantes, ni ninguna otra entidad. Nunca. Bajo ninguna circunstancia.
                    </p>
                </Section>

                <Section icon={Lock} title="4. Seguridad de los datos">
                    <p style={{ marginBottom: '0.75rem' }}>Tomamos la seguridad en serio. Las medidas que aplicamos incluyen:</p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Comunicación cifrada mediante <strong style={{ color: 'var(--text-2)' }}>HTTPS/TLS</strong> en todas las transmisiones.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Autenticación gestionada por <strong style={{ color: 'var(--text-2)' }}>Firebase Authentication</strong>, que nunca almacena contraseñas en texto plano.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Reglas de seguridad de Firestore que garantizan que <strong style={{ color: 'var(--text-2)' }}>solo el usuario autenticado puede leer o escribir sus propios datos</strong>.</li>
                        <li>Los datos en reposo en Google Cloud están cifrados automáticamente por la infraestructura de Firebase.</li>
                    </ul>
                    <p style={{ margin: 0 }}>
                        A pesar de estas medidas, ningún sistema es 100% infalible. Te recomendamos usar una contraseña segura y no compartir tu cuenta con nadie.
                    </p>
                </Section>

                <Section icon={Bell} title="5. Cookies y rastreo">
                    <p style={{ marginBottom: '0.75rem' }}>
                        StudyNeo <strong style={{ color: 'var(--text-2)' }}>no usa cookies de rastreo, píxeles de seguimiento ni scripts de analíticas de terceros</strong> (como Google Analytics, Hotjar, Meta Pixel, etc.).
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                        Firebase Authentication puede usar el almacenamiento local del navegador (IndexedDB o localStorage) para mantener la sesión activa. Este almacenamiento nunca sale de tu dispositivo sin pasar por la autenticación.
                    </p>
                    <p style={{ margin: 0 }}>
                        No mostramos banners de cookies porque literalmente no tenemos cookies de terceros que declarar.
                    </p>
                </Section>

                <Section icon={Globe} title="6. Menores de edad">
                    <p style={{ margin: 0 }}>
                        StudyNeo puede ser usado por personas de cualquier edad, incluyendo menores, para fines educativos. Sin embargo, si eres menor de 13 años (o la edad mínima de consentimiento digital en tu país), te pedimos que uses la app con el conocimiento de un adulto responsable. No recopilamos intencionalmente datos de menores de forma distinta a lo descrito en esta política.
                    </p>
                </Section>

                <Section icon={UserX} title="7. Tu derecho a eliminar y controlar tus datos">
                    <p style={{ marginBottom: '0.75rem' }}>Tienes control total sobre tus datos:</p>
                    <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Exportar:</strong> Puedes copiar manualmente cualquier contenido que hayas creado en la app.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Limpiar datos locales:</strong> Puedes borrar el almacenamiento local desde el menú de sincronización de la app o directamente desde las herramientas de tu navegador.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong style={{ color: 'var(--text-2)' }}>Eliminar cuenta:</strong> Ve a Configuración → Cuenta → Eliminar cuenta. Se eliminarán todos tus datos de Firebase de forma permanente e inmediata.</li>
                        <li><strong style={{ color: 'var(--text-2)' }}>Solicitud manual:</strong> Si tienes dificultades para eliminar tu cuenta, escríbeme a <a href="mailto:studyneo.sup@gmail.com" style={{ color: 'var(--accent)' }}>studyneo.sup@gmail.com</a> y lo haré por ti en un plazo de 48 horas.</li>
                    </ul>
                </Section>

                <Section icon={Shield} title="8. Cambios a esta política">
                    <p style={{ margin: 0 }}>
                        Si realizamos cambios significativos a esta política de privacidad, lo notificaremos dentro de la aplicación con tiempo suficiente antes de que entren en vigor. El uso continuado de StudyNeo tras dicha notificación implica la aceptación de los cambios. La fecha de "Última actualización" al inicio de este documento refleja siempre la versión vigente.
                    </p>
                </Section>

                <div style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
                        ¿Tienes dudas sobre esta política? Estamos aquí para ayudarte.
                    </p>
                    <a href="mailto:studyneo.sup@gmail.com" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9375rem' }}>
                        studyneo.sup@gmail.com
                    </a>
                </div>
            </main>
        </div>
    )
}
