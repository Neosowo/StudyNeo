import { useState, useEffect, useRef } from 'react'
import { db } from '../../firebase'
import {
    collection, query, orderBy, limit, onSnapshot, addDoc,
    serverTimestamp, where, getDocs, or, and
} from 'firebase/firestore'
import { sanitize } from '../../utils/sanitize'
import {
    Users, Send, MessageCircle, UserPlus, Search,
    ChevronLeft, MoreVertical, Plus, Zap, Mail,
    User as UserIcon, MessageSquare
} from 'lucide-react'
import { useSfx } from '../hooks/useSfx'

export default function Community({ user }) {
    const { play } = useSfx()

    // UI State
    const [view, setView] = useState('list') // 'list' | 'chat' | 'new_group'
    const [activeChat, setActiveChat] = useState(null) // { id, type, name, participants }

    // Data State
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [searchEmail, setSearchEmail] = useState('')
    const [searchError, setSearchError] = useState('')
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)

    const scrollRef = useRef()

    // 1. Listen to User's Chats (Both Private & Groups)
    useEffect(() => {
        if (!user?.email) return

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.email.toLowerCase()),
            orderBy('updatedAt', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            const chatList = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setChats(chatList)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user.email])

    // 2. Listen to Messages for Active Chat
    useEffect(() => {
        if (!activeChat) {
            setMessages([])
            return
        }

        const q = query(
            collection(db, 'chats', activeChat.id, 'messages'),
            orderBy('createdAt', 'desc'),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse()
            setMessages(msgs)

            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }, 100)
        })

        return () => unsubscribe()
    }, [activeChat])

    // 3. Create Private Conversation
    const startPrivateChat = async (targetEmail) => {
        const email = targetEmail.toLowerCase().trim()
        if (email === user.email.toLowerCase()) {
            setSearchError("No puedes chatear contigo mismo")
            return
        }

        setSearchError('')
        setLoading(true)

        try {
            // Check if chat already exists
            const existingQ = query(
                collection(db, 'chats'),
                where('type', '==', 'private'),
                where('participants', 'array-contains', user.email.toLowerCase())
            )
            const snap = await getDocs(existingQ)
            const existing = snap.docs.find(doc => doc.data().participants.includes(email))

            if (existing) {
                setActiveChat({ id: existing.id, ...existing.data() })
                setView('chat')
            } else {
                // Create new chat
                const newDoc = await addDoc(collection(db, 'chats'), {
                    type: 'private',
                    participants: [user.email.toLowerCase(), email],
                    updatedAt: serverTimestamp(),
                    lastMessage: 'Conversación iniciada'
                })
                setActiveChat({ id: newDoc.id, type: 'private', participants: [user.email.toLowerCase(), email] })
                setView('chat')
            }
            setSearchEmail('')
        } catch (err) {
            setSearchError("Error al iniciar chat")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // 4. Send Message
    const handleSend = async (e) => {
        e.preventDefault()
        const text = input.trim()
        if (!text || !activeChat) return

        setInput('')
        play('pop')

        try {
            await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
                text: sanitize(text),
                sender: user.email.toLowerCase(),
                senderName: user.name || 'Estudiante',
                senderPhoto: user.photoURL || null,
                createdAt: serverTimestamp()
            })

            // Update last message in chat doc
            // await updateDoc(doc(db, 'chats', activeChat.id), { updatedAt: serverTimestamp(), lastMessage: text })
        } catch (err) {
            console.error("Error sending message:", err)
        }
    }

    const getChatName = (chat) => {
        if (chat.type === 'group') return chat.name
        const other = chat.participants.find(p => p !== user.email.toLowerCase())
        return other || 'Tú'
    }

    return (
        <div className="page-container" style={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="page-header" style={{ flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {view !== 'list' && (
                        <button onClick={() => setView('list')} className="btn-icon" style={{ background: 'var(--bg-hover)' }}>
                            <ChevronLeft size={18} />
                        </button>
                    )}
                    <div>
                        <h1 className="page-title">
                            {view === 'list' && 'Mensajes'}
                            {view === 'chat' && getChatName(activeChat)}
                            {view === 'new_group' && 'Nuevo Grupo'}
                        </h1>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontWeight: 600 }}>
                            {view === 'list' && 'Tus contactos y grupos'}
                            {view === 'chat' && (activeChat.type === 'group' ? `${activeChat.participants.length} integrantes` : activeChat.participants.find(p => p !== user.email.toLowerCase()))}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, marginTop: '1.5rem', display: 'flex', gap: '1rem', overflow: 'hidden' }}>

                {/* ── LEFT SIDE: CHAT LIST ── (Always visible on desktop, hidden on mobile chat view) */}
                <div className="panel-card" style={{
                    flex: view === 'list' ? 1 : 0.4,
                    display: (view !== 'list' && window.innerWidth < 768) ? 'none' : 'flex',
                    flexDirection: 'column', padding: 0, overflow: 'hidden'
                }}>
                    {/* Search / Add by Email */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="panel-input"
                                placeholder="Buscar por correo..."
                                value={searchEmail}
                                onChange={e => { setSearchEmail(e.target.value); setSearchError('') }}
                                onKeyDown={e => e.key === 'Enter' && startPrivateChat(searchEmail)}
                                style={{ paddingRight: '2.5rem', fontSize: '0.8125rem' }}
                            />
                            <button
                                onClick={() => startPrivateChat(searchEmail)}
                                style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '6px' }}
                            >
                                <UserPlus size={16} />
                            </button>
                        </div>
                        {searchError && <p style={{ fontSize: '10px', color: 'var(--red)', marginTop: '4px', fontWeight: 600 }}>{searchError}</p>}
                    </div>

                    {/* Chat Items */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}><Zap size={20} className="sync-pulse" color="var(--accent)" /></div>
                        ) : chats.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-4)' }}>
                                <MessageSquare size={32} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>No hay chats</p>
                                <p style={{ fontSize: '0.75rem' }}>Escribe un correo arriba para empezar.</p>
                            </div>
                        ) : (
                            chats.map(chat => {
                                const isActive = activeChat?.id === chat.id
                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => { setActiveChat(chat); setView('chat'); play('click') }}
                                        style={{
                                            padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
                                            display: 'flex', gap: '12px', alignItems: 'center', transition: 'all 0.2s',
                                            background: isActive ? 'var(--accent-dim)' : 'transparent'
                                        }}
                                        onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'var(--bg-hover)')}
                                        onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: chat.type === 'group' ? 'var(--yellow-dim)' : 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {chat.type === 'group' ? <Users size={20} color="var(--yellow)" /> : <UserIcon size={20} color="var(--accent)" />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {getChatName(chat)}
                                                </p>
                                                <span style={{ fontSize: '9px', color: 'var(--text-4)' }}>{chat.type === 'group' ? 'GRUPO' : ''}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {chat.lastMessage || 'Conversación iniciada'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* ── RIGHT SIDE: MESSAGES ── */}
                {view === 'chat' && activeChat ? (
                    <div className="panel-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        <div
                            ref={scrollRef}
                            style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            {messages.map((msg) => {
                                const isMe = msg.sender === user.email.toLowerCase()
                                return (
                                    <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', gap: '10px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', overflow: 'hidden', flexShrink: 0 }}>
                                            {msg.senderPhoto ? <img src={msg.senderPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{msg.senderName?.[0]}</div>}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                            {!isMe && <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-4)', marginBottom: '4px' }}>{msg.senderName}</span>}
                                            <div style={{
                                                padding: '10px 14px',
                                                borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                                                background: isMe ? 'var(--accent)' : 'var(--bg-surface)',
                                                color: isMe ? 'white' : 'var(--text-1)',
                                                border: '1px solid var(--border-subtle)',
                                                fontSize: '0.875rem',
                                                lineHeight: 1.5,
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '1rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
                            <input
                                className="panel-input"
                                placeholder="Escribe un mensaje..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                style={{ border: 'none', background: 'var(--bg-base)', padding: '12px 16px' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                style={{ width: '44px', height: '44px', borderRadius: '12px', background: input.trim() ? 'var(--accent)' : 'var(--bg-hover)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                ) : view === 'list' && (
                    <div className="panel-card" style={{ flex: 1, display: (window.innerWidth < 768) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-4)' }}>
                        <div>
                            <MessageCircle size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 800 }}>Selecciona un chat</p>
                            <p style={{ fontSize: '0.8125rem' }}>O inicia uno nuevo usando un correo electrónico</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
