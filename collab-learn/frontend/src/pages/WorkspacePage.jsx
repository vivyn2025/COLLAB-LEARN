import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Users, Edit3, Circle, Hash, Copy, Download, Plus, Mic, Video } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const chatMessages = [
  { id: 1, user: 'Priya Sharma', avatar: 'PS', color: 'from-pink-400 to-rose-500', text: "Hey! I can explain how backpropagation works with the chain rule. Which part is confusing?", time: '2m ago', self: false },
  { id: 2, user: 'You', avatar: 'RR', color: 'from-violet-400 to-blue-500', text: "I get the math but I'm confused about how the gradients actually flow backwards through the layers.", time: '1m ago', self: true },
  { id: 3, user: 'Priya Sharma', avatar: 'PS', color: 'from-pink-400 to-rose-500', text: "Think of it as a signal. Each layer passes its 'blame' for the error backwards to the layer before it. The chain rule chains these 'blame' signals!", time: '30s ago', self: false },
]

const sharedNote = `# Deep Learning — Session Notes

## Backpropagation (Session 7)
- Algorithm used to train neural networks
- Computes gradient of the **loss function** w.r.t each weight
- Uses the **chain rule** of calculus

## Key Equations
- dL/dw = dL/dout × dout/dw
- Weight update: w = w - lr × dL/dw

## Common Pitfalls
- Vanishing gradients in deep sigmoid networks
- Exploding gradients — use gradient clipping

[Editing...] Priya is currently editing this section 👆`

const doubts = [
  { q: 'Why does sigmoid cause vanishing gradients?', user: 'Arjun Mehta', answers: 3, resolved: true, upvotes: 7 },
  { q: 'What is the difference between batch and stochastic gradient descent?', user: 'You', answers: 1, resolved: false, upvotes: 4 },
  { q: 'How does the Adam optimizer adapt learning rates?', user: 'Sneha Nair', answers: 0, resolved: false, upvotes: 2 },
]

export default function WorkspacePage() {
  const toast = useToast()
  const [messages, setMessages] = useState(chatMessages)
  const [input, setInput] = useState('')
  const [note, setNote] = useState(sharedNote)
  const [tab, setTab] = useState('editor')
  const [newDoubt, setNewDoubt] = useState('')
  const messagesEnd = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(m => [...m, {
      id: Date.now(), user: 'You', avatar: 'RR',
      color: 'from-violet-400 to-blue-500', text: input, time: 'Just now', self: true,
    }])
    setInput('')
  }

  const copyNote = () => {
    navigator.clipboard.writeText(note).then(() => toast.info('Note copied to clipboard!'))
  }

  const downloadNote = () => {
    toast.success('Note downloaded as markdown!', 'Downloaded')
  }

  return (
    <div className="h-full flex flex-col animate-page-enter">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <MessageCircle size={12} /> Collaborative Workspace
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Study Session</h1>
          <div className="flex items-center gap-3">
            {/* Video/Audio controls */}
            <button
              onClick={() => toast.info('Video call starting...', 'Connecting')}
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/45 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            >
              <Video size={12} className="text-blue-400" /> Video Call
            </button>
            <button
              onClick={() => toast.info('Mic enabled — all participants can hear you', 'Microphone On')}
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/45 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            >
              <Mic size={12} className="text-emerald-400" /> Voice
            </button>

            {/* Avatars */}
            <div className="flex items-center gap-1">
              {['PS', 'AM', 'RR'].map((a, i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${i===0?'from-pink-400 to-rose-500':i===1?'from-blue-400 to-cyan-500':'from-violet-400 to-blue-500'} flex items-center justify-center text-[9px] font-bold text-white -ml-2 first:ml-0 border-2 border-[#07070d]`}>{a}</div>
              ))}
              <span className="text-xs text-white/35 ml-2">3 live</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 status-online ml-1 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 flex gap-1.5 mb-4 flex-shrink-0">
        {[
          { id: 'editor', icon: Edit3, label: 'Shared Editor' },
          { id: 'chat', icon: MessageCircle, label: 'Discussion' },
          { id: 'doubts', icon: Hash, label: 'Doubt Threads' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all
              ${tab === t.id ? 'bg-violet-500/18 border border-violet-500/28 text-violet-300' : 'glass text-white/38 hover:text-white/60 hover:bg-white/[0.03]'}`}
          >
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-8 flex gap-6 overflow-hidden min-h-0">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {tab === 'editor' && (
            <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <Circle size={9} className="text-red-400 fill-red-400" />
                  <Circle size={9} className="text-amber-400 fill-amber-400" />
                  <Circle size={9} className="text-emerald-400 fill-emerald-400" />
                </div>
                <p className="text-xs text-white/25 ml-2 flex-1">Deep Learning — Collaborative Notes.md</p>
                <div className="flex items-center gap-2">
                  <button onClick={copyNote} className="text-white/25 hover:text-white/55 transition-colors p-1">
                    <Copy size={12} />
                  </button>
                  <button onClick={downloadNote} className="text-white/25 hover:text-white/55 transition-colors p-1">
                    <Download size={12} />
                  </button>
                  <div className="flex items-center gap-1.5 text-[10px] text-pink-300 bg-pink-500/10 border border-pink-500/20 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    Priya is editing
                  </div>
                </div>
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                className="flex-1 p-5 bg-transparent text-white/65 text-sm leading-relaxed resize-none outline-none font-mono"
              />
              <div className="px-5 py-2 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-[10px] text-white/20">{note.split('\n').length} lines · {note.split(' ').filter(Boolean).length} words</p>
                <button
                  onClick={() => toast.success('Changes saved to cloud!', 'Auto-saved')}
                  className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === 'chat' && (
            <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <p className="text-xs font-semibold text-white/45">Discussion Thread · Deep Learning Backpropagation</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex gap-3 ${m.self ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                      {m.avatar}
                    </div>
                    <div className={`max-w-xs ${m.self ? 'items-end' : 'items-start'} flex flex-col`}>
                      <p className="text-[9px] text-white/25 mb-1 px-1">{m.self ? '' : m.user} · {m.time}</p>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                        ${m.self
                          ? 'bg-gradient-to-br from-violet-600/25 to-blue-600/18 border border-violet-500/18 text-white/80 rounded-tr-sm'
                          : 'bg-white/[0.035] border border-white/[0.07] text-white/65 rounded-tl-sm'}`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEnd} />
              </div>
              <div className="p-4 border-t border-white/[0.06] flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a doubt or share an insight..."
                  className="flex-1 bg-white/[0.025] border border-white/[0.07] px-4 py-3 rounded-xl text-sm text-white/65 placeholder-white/18 outline-none focus:border-violet-500/35 transition-all"
                />
                <button
                  onClick={sendMessage}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {tab === 'doubts' && (
            <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <p className="text-xs font-semibold text-white/45">Doubt Threads · {doubts.length} threads</p>
                <button
                  onClick={() => toast.info('New doubt thread created!', 'Thread Added')}
                  className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                >
                  <Plus size={10} /> New Thread
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                {doubts.map((d, i) => (
                  <div key={i} className="bg-white/[0.025] border border-white/[0.055] rounded-xl p-4 hover:border-violet-500/18 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white/75 mb-1 group-hover:text-white/90 transition-colors">{d.q}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] text-white/25">Asked by {d.user}</p>
                          <p className="text-[10px] text-white/25">{d.answers} {d.answers === 1 ? 'answer' : 'answers'}</p>
                          <p className="text-[10px] text-white/25">↑ {d.upvotes}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0
                        ${d.resolved ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'}`}>
                        {d.resolved ? '✓ Resolved' : 'Open'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* New Doubt Input */}
                <div className="glass rounded-xl p-3 mt-2">
                  <input
                    type="text"
                    value={newDoubt}
                    onChange={e => setNewDoubt(e.target.value)}
                    placeholder="Post a new doubt thread..."
                    className="w-full bg-transparent text-sm text-white/60 placeholder-white/20 outline-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newDoubt.trim()) {
                        toast.success('Doubt posted — peers will respond soon!', 'Doubt Posted')
                        setNewDoubt('')
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-52 flex-shrink-0 flex flex-col gap-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">In Session</p>
            {[
              { a: 'PS', name: 'Priya Sharma', color: 'from-pink-400 to-rose-500', role: 'Mentor' },
              { a: 'AM', name: 'Arjun Mehta', color: 'from-blue-400 to-cyan-500', role: 'Learner' },
              { a: 'RR', name: 'You', color: 'from-violet-400 to-blue-500', role: 'Learner' },
            ].map(u => (
              <div key={u.a} className="flex items-center gap-2.5 py-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>{u.a}</div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/65 truncate">{u.name}</p>
                  <p className="text-[9px] text-white/25">{u.role}</p>
                </div>
                <div className="ml-auto w-1.5 h-1.5 rounded-full status-online flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">Session</p>
            <p className="text-sm font-semibold text-white/65">Deep Learning — Backpropagation</p>
            <p className="text-xs text-white/25 mt-1">CS401 · Week 7 · 42 min active</p>
            <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full w-3/4" style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' }} />
            </div>
            <p className="text-[9px] text-white/25 mt-1">75% of topics covered</p>
          </div>

          <button
            onClick={() => toast.warning('Are you sure you want to end the session?', 'End Session')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 glass hover:bg-red-500/10 transition-all"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  )
}
