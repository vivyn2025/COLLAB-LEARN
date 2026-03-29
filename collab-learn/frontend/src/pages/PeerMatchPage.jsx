import { useState } from 'react'
import { Users, Zap, Star, MessageCircle, UserCheck, Filter, Search } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const peers = [
  {
    id: 1, name: 'Priya Sharma', avatar: 'PS', color: 'from-pink-400 to-rose-500',
    subject: 'Deep Learning', strengths: ['Backpropagation', 'CNNs', 'Loss Functions'],
    gaps: ['Transformers', 'Attention Mechanism'], match: 96,
    status: 'online', badge: 'Top Mentor', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    studySessions: 47, rating: 4.9, responseTime: '< 5 min',
  },
  {
    id: 2, name: 'Arjun Mehta', avatar: 'AM', color: 'from-blue-400 to-cyan-500',
    subject: 'Deep Learning', strengths: ['Gradient Descent', 'Adam Optimizer', 'RNN'],
    gaps: ['Backpropagation', 'Activation Functions'], match: 88,
    status: 'online', badge: 'Active Learner', badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    studySessions: 31, rating: 4.7, responseTime: '< 15 min',
  },
  {
    id: 3, name: 'Sneha Nair', avatar: 'SN', color: 'from-emerald-400 to-teal-500',
    subject: 'Deep Learning', strengths: ['Transformers', 'BERT', 'NLP'],
    gaps: ['CNN Architecture', 'Pooling Layers'], match: 81,
    status: 'away', badge: 'NLP Expert', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    studySessions: 25, rating: 4.8, responseTime: '< 30 min',
  },
]

export default function PeerMatchPage() {
  const toast = useToast()
  const [connected, setConnected] = useState(null)
  const [matching, setMatching] = useState(false)
  const [shown, setShown] = useState(false)
  const [search, setSearch] = useState('')

  const runMatch = () => {
    setMatching(true)
    setShown(false)
    toast.info('Running neural similarity analysis...', 'Finding Matches')
    setTimeout(() => {
      setMatching(false)
      setShown(true)
      toast.success('Found 3 highly compatible peers!', 'Match Complete')
    }, 2000)
  }

  const handleConnect = (peer) => {
    if (connected === peer.id) {
      setConnected(null)
      toast.info(`Disconnected from ${peer.name}`)
    } else {
      setConnected(peer.id)
      toast.success(`Connected with ${peer.name}! Starting session...`, 'Connected!')
    }
  }

  const filtered = peers.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.strengths.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-full p-8 animate-page-enter">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <Users size={12} /> Peer Matching · Neural Similarity
        </div>
        <h1 className="text-3xl font-bold text-white">Smart Peer Matching</h1>
        <p className="text-white/40 mt-1 text-sm">AI uses semantic embeddings of your learning gaps to find peers with complementary strengths.</p>
      </div>

      {/* How It Works */}
      <div className="glass rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-white/45 uppercase tracking-widest mb-4">How Neural Peer Matching Works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '01', icon: '🧠', title: 'Gap Embedding', desc: 'Your learning gaps from quiz mistakes are vectorized using a language model.' },
            { step: '02', icon: '📐', title: 'Cosine Similarity', desc: "Your gap vector is compared to classmates' strength vectors using cosine similarity." },
            { step: '03', icon: '🤝', title: 'Synergistic Match', desc: 'Top-ranked peers are presented — guaranteed complementary knowledge.' },
          ].map(s => (
            <div key={s.step} className="bg-white/[0.025] rounded-xl p-4 border border-white/[0.05] hover:border-violet-500/15 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[10px] font-bold text-violet-400/50 font-mono">{s.step}</span>
              </div>
              <p className="text-sm font-semibold text-white/80 mb-1">{s.title}</p>
              <p className="text-xs text-white/35 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Your Gaps */}
      <div className="glass rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold text-white/45 uppercase tracking-widest mb-3">Your Current Learning Gaps (from Revision Engine)</p>
        <div className="flex flex-wrap gap-2">
          {['Backpropagation', 'Convolutional Nets', 'Transformers'].map(g => (
            <span key={g} className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">{g}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={runMatch}
        disabled={matching}
        className="w-full py-4 rounded-2xl font-semibold text-sm text-white mb-6 relative overflow-hidden transition-all disabled:opacity-60 active:scale-[0.99]"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        {matching && <span className="absolute inset-0 animate-shimmer" />}
        <span className="flex items-center justify-center gap-2 relative">
          <Zap size={15} className={matching ? 'animate-pulse' : ''} />
          {matching ? 'Running Neural Similarity Analysis...' : 'Find My Best Matches Now'}
        </span>
      </button>

      {/* Results */}
      {shown && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-white/45 uppercase tracking-widest">Top 3 Matched Peers · Sorted by Semantic Similarity</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or skill..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/60 placeholder-white/20 outline-none focus:border-violet-500/30 transition-all w-48"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`glass rounded-2xl p-5 flex flex-col gap-4 border transition-all hover:border-violet-500/20 card-hover ${connected === p.id ? 'border-violet-500/30 glow-purple' : 'border-white/[0.06]'}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                        {p.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#07070d] ${p.status === 'online' ? 'status-online' : 'status-away'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-white/35">{p.subject}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${p.badgeColor}`}>{p.badge}</span>
                </div>

                {/* Match Score */}
                <div className="bg-white/[0.025] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-white/35 uppercase tracking-widest">Neural Match</p>
                    <p className="text-2xl font-bold gradient-text">{p.match}%</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 40 40" className="w-14 h-14 -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"/>
                      <circle cx="20" cy="20" r="16" fill="none" stroke="url(#grad)" strokeWidth="4"
                        strokeDasharray={`${(p.match / 100) * 100.53} 100.53`} strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6"/>
                          <stop offset="100%" stopColor="#3b82f6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <Star size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sessions', val: p.studySessions },
                    { label: 'Rating', val: p.rating },
                    { label: 'Response', val: p.responseTime },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.025] rounded-lg p-2 text-center">
                      <p className="text-xs font-bold text-white/70">{s.val}</p>
                      <p className="text-[8px] text-white/25 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                <div>
                  <p className="text-[9px] text-white/25 mb-1.5 font-medium uppercase tracking-widest">Their Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.strengths.map(s => (
                      <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleConnect(p)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-95
                    ${connected === p.id
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'glass hover:bg-violet-500/10 hover:border-violet-500/20 text-white/65 hover:text-white border border-white/[0.06]'}`}
                >
                  {connected === p.id
                    ? <><UserCheck size={13} /> Connected!</>
                    : <><MessageCircle size={13} /> Connect & Collaborate</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
