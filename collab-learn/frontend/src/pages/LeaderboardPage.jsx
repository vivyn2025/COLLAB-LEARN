import { useState } from 'react'
import { Trophy, Star, Flame, TrendingUp, Medal, Crown } from 'lucide-react'

const leaderboard = [
  { rank: 1, name: 'Priya Sharma', avatar: 'PS', color: 'from-pink-400 to-rose-500', xp: 8420, streak: 21, badge: 'Grand Master', score: 94, subject: 'Deep Learning', change: 0 },
  { rank: 2, name: 'Arjun Mehta', avatar: 'AM', color: 'from-blue-400 to-cyan-500', xp: 7310, streak: 14, badge: 'Expert', score: 91, subject: 'Deep Learning', change: 1 },
  { rank: 3, name: 'Sneha Nair', avatar: 'SN', color: 'from-emerald-400 to-teal-500', xp: 6850, streak: 18, badge: 'Expert', score: 88, subject: 'NLP', change: -1 },
  { rank: 4, name: 'Aditya Kumar', avatar: 'AK', color: 'from-violet-400 to-purple-500', xp: 5900, streak: 11, badge: 'Advanced', score: 83, subject: 'Computer Vision', change: 2 },
  { rank: 5, name: 'Rahul Ravi', avatar: 'RR', color: 'from-violet-400 to-pink-400', xp: 4680, streak: 7, badge: 'Intermediate', score: 82, subject: 'Deep Learning', change: 0, isYou: true },
  { rank: 6, name: 'Diya Patel', avatar: 'DP', color: 'from-amber-400 to-yellow-500', xp: 4200, streak: 9, badge: 'Intermediate', score: 78, subject: 'ML Ops', change: -1 },
  { rank: 7, name: 'Rohan Singh', avatar: 'RS', color: 'from-orange-400 to-red-500', xp: 3870, streak: 5, badge: 'Learner', score: 74, subject: 'Reinforcement Learning', change: 1 },
]

const topThree = leaderboard.slice(0, 3)
const rest = leaderboard.slice(3)

const badgeColors = {
  'Grand Master': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  'Expert': 'text-violet-300 bg-violet-500/10 border-violet-500/25',
  'Advanced': 'text-blue-300 bg-blue-500/10 border-blue-500/25',
  'Intermediate': 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  'Learner': 'text-white/40 bg-white/5 border-white/10',
}

const medalColors = { 1: '#F59E0B', 2: '#94A3B8', 3: '#CD7C2F' }

const tabs = ['All Time', 'This Week', 'This Month', 'CS401 Class']

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('All Time')

  return (
    <div className="min-h-full p-8 animate-page-enter">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <Trophy size={12} /> Leaderboard · Gamified Learning
        </div>
        <h1 className="text-3xl font-bold text-white">Rankings & XP Board</h1>
        <p className="text-white/40 mt-1 text-sm">Compete with classmates — learn faster, earn more XP.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 glass rounded-2xl p-1.5 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === t
                ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-white/40 hover:text-white/65 hover:bg-white/[0.04]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Podium — Top 3 */}
      <div className="relative mb-10">
        <div className="flex items-end justify-center gap-4 pb-4">
          {/* 2nd */}
          <PodiumCard person={topThree[1]} height="h-32" delay="0ms" />
          {/* 1st */}
          <PodiumCard person={topThree[0]} height="h-44" isFirst delay="150ms" />
          {/* 3rd */}
          <PodiumCard person={topThree[2]} height="h-24" delay="300ms" />
        </div>
      </div>

      {/* Rest of leaderboard */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <p className="text-sm font-bold text-white">Full Rankings</p>
          <p className="text-xs text-white/30">Updated 5 minutes ago</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {rest.map((p, i) => (
            <LeaderRow key={p.rank} person={p} index={i} />
          ))}
        </div>
      </div>

      {/* Your Stats Card */}
      <div className="mt-6 glass rounded-2xl p-6 border border-violet-500/15 glow-purple">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-base font-bold text-white">RR</div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Your Position</p>
              <p className="text-2xl font-bold text-white">#5 <span className="text-sm font-normal text-white/30">of 142 students</span></p>
            </div>
          </div>
          <div className="flex gap-6">
            {[{ label: 'XP', val: '4,680', icon: Star, color: 'text-amber-400' },
              { label: 'Streak', val: '7 days', icon: Flame, color: 'text-orange-400' },
              { label: 'Score', val: '82%', icon: TrendingUp, color: 'text-emerald-400' }
            ].map(s => (
              <div key={s.label} className="text-center">
                <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-white">{s.val}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium">{s.label}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">To reach #4</p>
            <div className="flex items-center gap-2">
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden w-36">
                <div className="h-full rounded-full xp-bar" style={{ width: `${(4680 / 5900) * 100}%` }} />
              </div>
              <span className="text-xs text-violet-400 font-semibold">1,220 XP away</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PodiumCard({ person, height, isFirst, delay }) {
  const rankColors = { 1: 'from-amber-400 to-yellow-500', 2: 'from-slate-400 to-gray-500', 3: 'from-amber-700 to-amber-800' }
  return (
    <div className="flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: delay }}>
      {/* Crown for 1st */}
      {isFirst && <Crown size={24} className="text-amber-400 animate-float" />}

      {/* Avatar */}
      <div className="relative">
        <div className={`${isFirst ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center font-bold text-white ${isFirst ? 'text-lg' : 'text-sm'} shadow-lg`}
          style={isFirst ? { boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)' } : {}}>
          {person.avatar}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${rankColors[person.rank]} text-white text-[10px] font-bold border-2 border-[#07070d]`}>
          {person.rank}
        </div>
      </div>

      <div className="text-center">
        <p className={`font-bold text-white ${isFirst ? 'text-sm' : 'text-xs'}`}>{person.name.split(' ')[0]}</p>
        <p className="text-[10px] text-white/40">{person.xp.toLocaleString()} XP</p>
      </div>

      {/* Podium block */}
      <div className={`w-24 ${height} rounded-t-2xl flex items-start justify-center pt-3`} style={{
        background: `linear-gradient(180deg, rgba(${person.rank === 1 ? '245,158,11' : person.rank === 2 ? '148,163,184' : '205,124,47'},0.25) 0%, rgba(${person.rank === 1 ? '245,158,11' : person.rank === 2 ? '148,163,184' : '205,124,47'},0.05) 100%)`,
        border: `1px solid rgba(${person.rank === 1 ? '245,158,11' : person.rank === 2 ? '148,163,184' : '205,124,47'},0.3)`,
      }}>
        <Medal size={20} style={{ color: medalColors[person.rank] }} />
      </div>
    </div>
  )
}

function LeaderRow({ person, index }) {
  const changeIcon = person.change > 0 ? '↑' : person.change < 0 ? '↓' : '—'
  const changeColor = person.change > 0 ? 'text-emerald-400' : person.change < 0 ? 'text-red-400' : 'text-white/25'

  return (
    <div className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-all ${person.isYou ? 'bg-violet-500/5 border-l-2 border-violet-500/40' : ''}`}>
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        <p className="text-sm font-bold text-white/50">#{person.rank}</p>
      </div>

      {/* Change */}
      <span className={`text-xs font-bold w-4 flex-shrink-0 ${changeColor}`}>{changeIcon}</span>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 relative`}>
        {person.avatar}
        {person.isYou && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-400 border-2 border-[#07070d]" />}
      </div>

      {/* Name & badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold truncate ${person.isYou ? 'text-violet-300' : 'text-white/80'}`}>
            {person.name} {person.isYou && <span className="text-[10px] text-violet-400 font-normal">(You)</span>}
          </p>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${badgeColors[person.badge]}`}>{person.badge}</span>
        </div>
        <p className="text-[10px] text-white/30">{person.subject}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-white/70">{person.score}%</p>
          <p className="text-[9px] text-white/25">Score</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="flex items-center gap-1 justify-end">
            <Flame size={10} className="text-orange-400" />
            <p className="text-xs font-bold text-white/70">{person.streak}d</p>
          </div>
          <p className="text-[9px] text-white/25">Streak</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold gradient-text">{person.xp.toLocaleString()}</p>
          <p className="text-[9px] text-white/25">XP</p>
        </div>
      </div>
    </div>
  )
}
