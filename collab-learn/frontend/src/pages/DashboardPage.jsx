import { useState, useEffect, useRef } from 'react'
import {
  BookOpen, Zap, TrendingUp, Users, Flame, Target, Clock,
  ArrowRight, Sparkles, CheckCircle2, Activity, Trophy,
  Brain, Cpu, Star, Play, BarChart3, Calendar, Medal
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

/* ─── Data ─────────────────────────────────────────────────── */
const weeklyData = [
  { day: 'Mon', val: 65, sessions: 3 },
  { day: 'Tue', val: 45, sessions: 2 },
  { day: 'Wed', val: 80, sessions: 4 },
  { day: 'Thu', val: 55, sessions: 2 },
  { day: 'Fri', val: 90, sessions: 5 },
  { day: 'Sat', val: 72, sessions: 3 },
  { day: 'Sun', val: 82, sessions: 4 },
]
const MAX_BAR_PX = 100 // fixed pixel max bar height

const statCards = [
  { label: 'Total Notes', value: 24,      delta: '+3 this week',     icon: BookOpen, color: 'violet' },
  { label: 'Study Streak', value: '7d',   delta: '🔥 Personal best', icon: Flame,    color: 'amber'  },
  { label: 'Mastery Score',value: '82%',  delta: '+4% yesterday',    icon: Target,   color: 'emerald'},
  { label: 'Peers Matched',value: 12,     delta: '2 active now',     icon: Users,    color: 'blue'   },
]

const colorMap = {
  violet: { border:'border-violet-500/25', text:'text-violet-400', bg:'bg-violet-500/15', glow:'rgba(139,92,246,0.35)', ring:'#8b5cf6' },
  amber:  { border:'border-amber-500/25',  text:'text-amber-400',  bg:'bg-amber-500/15',  glow:'rgba(245,158,11,0.35)', ring:'#f59e0b' },
  emerald:{ border:'border-emerald-500/25',text:'text-emerald-400',bg:'bg-emerald-500/15',glow:'rgba(16,185,129,0.35)', ring:'#10b981' },
  blue:   { border:'border-blue-500/25',   text:'text-blue-400',   bg:'bg-blue-500/15',   glow:'rgba(59,130,246,0.35)', ring:'#3b82f6' },
}

const topicProgress = [
  { name: 'Backpropagation', pct: 45, color: '#ef4444' },
  { name: 'CNNs',            pct: 33, color: '#f59e0b' },
  { name: 'Activation Fns',  pct: 88, color: '#10b981' },
  { name: 'Gradient Descent', pct: 72, color: '#3b82f6' },
  { name: 'Transformers',    pct: 60, color: '#8b5cf6' },
]

const recentActivity = [
  { icon:'📝', text:'Structured notes on Backpropagation', time:'12m ago' },
  { icon:'🧠', text:'Quiz: Gradient Descent — 2/3 correct', time:'40m ago' },
  { icon:'🤝', text:'Session started with Priya Sharma',   time:'1h ago'  },
  { icon:'✨', text:'AI Solver answered 3 Chain Rule doubts', time:'2h ago' },
]

const upcomingTasks = [
  { task:'Review Backpropagation flashcards', due:'Today',    priority:'high'   },
  { task:'Complete CNN quiz — 5 questions',   due:'Today',    priority:'high'   },
  { task:'Read Transformers paper notes',     due:'Tomorrow', priority:'medium' },
  { task:'Collaborative session with Arjun',  due:'Thu 6PM', priority:'low'    },
]

const heatmap = [
  [0,1,2,3,2,1,2],
  [3,2,1,0,3,2,1],
  [1,3,2,1,2,3,2],
  [2,1,3,2,0,1,3],
]

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedCounter({ target }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) { setVal(target); return }
    let cur = 0
    const step = num / 40
    const t = setInterval(() => {
      cur += step
      if (cur >= num) { setVal(target); clearInterval(t) }
      else {
        const s = String(target)
        setVal(s.includes('%') ? `${Math.floor(cur)}%` : s.includes('d') ? `${Math.floor(cur)}d` : Math.floor(cur))
      }
    }, 28)
    return () => clearInterval(t)
  }, [target])
  return <>{val}</>
}

/* ─── SVG Progress Ring ─────────────────────────────────────── */
function Ring({ pct, color, size = 44, stroke = 4 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - (pct/100)*circ}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.85)">{pct}%</text>
    </svg>
  )
}

/* ─── Floating Orb ──────────────────────────────────────────── */
function Orb({ style, color }) {
  return (
    <div className="absolute rounded-full pointer-events-none blur-3xl opacity-60"
      style={{ background: color, ...style }} />
  )
}

/* ─── Bar Chart ─────────────────────────────────────────────── */
function BarChart() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t) }, [])

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-bold text-white">Weekly Study Activity</p>
          <p className="text-xs text-white/35 mt-0.5">Sessions & engagement this week</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold">
          <Activity size={10}/> +14% vs last week
        </div>
      </div>

      {/* Bar container — fixed pixel height so % children work */}
      <div className="flex items-end gap-2.5" style={{ height: MAX_BAR_PX + 28 }}>
        {weeklyData.map((d, i) => {
          const isToday = i === 6
          const barH = animated ? Math.round((d.val / 100) * MAX_BAR_PX) : 4
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
              {/* Tooltip */}
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all duration-200 ${
                isToday ? 'text-violet-300' : 'text-white/0 group-hover:text-white/50'
              } ${isToday ? 'bg-violet-500/20' : 'group-hover:bg-white/[0.05]'}`}>
                {d.val}%
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t-lg relative overflow-hidden"
                style={{
                  height: barH,
                  minHeight: 6,
                  transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {isToday ? (
                  <>
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(180deg, #a78bfa, #3b82f6)',
                    }}/>
                    <div className="absolute inset-0 animate-shimmer"/>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-white/[0.09] group-hover:bg-white/[0.14] transition-colors duration-200"/>
                )}
              </div>

              {/* Day label */}
              <p className={`text-[9px] font-semibold ${isToday ? 'text-violet-400' : 'text-white/25 group-hover:text-white/45'} transition-colors`}>
                {d.day}
              </p>
            </div>
          )
        })}
      </div>

      {/* Bottom mini-row: session count indicators */}
      <div className="flex gap-2.5 mt-1">
        {weeklyData.map((d, i) => (
          <div key={i} className="flex-1 flex justify-center gap-0.5">
            {Array.from({ length: Math.min(d.sessions, 5) }).map((_, j) => (
              <div key={j} className={`w-1 h-1 rounded-full ${i === 6 ? 'bg-violet-400/60' : 'bg-white/15'}`}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Heatmap ────────────────────────────────────────────────── */
function StudyHeatmap() {
  const intensity = ['bg-white/[0.04]', 'bg-violet-500/20', 'bg-violet-500/45', 'bg-violet-500/80']
  const weeks = ['3 wks ago', '2 wks ago', 'Last week', 'This week']
  const dayLabels = ['M','T','W','T','F','S','S']
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs font-bold text-white mb-3">Study Heatmap — Past Month</p>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 pt-5">
          {dayLabels.map((d,i) => <p key={i} className="text-[8px] text-white/20 h-3 flex items-center">{d}</p>)}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-1.5 mb-1">
            {weeks.map(w => <p key={w} className="text-[8px] text-white/20 text-center">{w}</p>)}
          </div>
          {[0,1,2,3,4,5,6].map(day => (
            <div key={day} className="grid grid-cols-4 gap-1.5 mb-1.5">
              {heatmap.map((week, wi) => (
                <div key={wi} className={`h-3 rounded-sm ${intensity[week[day] ?? 0]} hover:scale-110 transition-transform cursor-default`}
                  title={`${week[day]} sessions`}/>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <p className="text-[8px] text-white/25">Less</p>
        {intensity.map((c,i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`}/>)}
        <p className="text-[8px] text-white/25">More</p>
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function DashboardPage({ setActivePage }) {
  const toast = useToast()
  const [tasksDone, setTasksDone] = useState([])

  const [timeOfDay] = useState(() => {
    const h = new Date().getHours()
    return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  })

  const greetText = { morning:'☀️ Good morning', afternoon:'🌤 Good afternoon', evening:'🌙 Good evening' }

  const toggleTask = (i) => {
    setTasksDone(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
    if (!tasksDone.includes(i)) toast.success('Task marked complete! +20 XP', 'Nice work!')
  }

  return (
    <div className="min-h-full p-6 xl:p-8 animate-page-enter">

      {/* ══════════════════ HERO ══════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl mb-6 p-7 xl:p-9"
        style={{
          background: 'linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(29,78,216,0.16) 45%, rgba(5,150,105,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.18)',
        }}>

        {/* Floating orbs */}
        <Orb color="radial-gradient(circle, rgba(139,92,246,0.5), transparent 65%)"
          style={{ width:340, height:340, top:-120, right:-80 }}/>
        <Orb color="radial-gradient(circle, rgba(59,130,246,0.35), transparent 65%)"
          style={{ width:280, height:280, bottom:-100, left:-60 }}/>
        <Orb color="radial-gradient(circle, rgba(16,185,129,0.25), transparent 65%)"
          style={{ width:220, height:220, bottom:-60, right:'30%' }}/>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}/>

        <div className="relative flex flex-col xl:flex-row xl:items-center gap-6">

          {/* Text Side */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.1] rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-[10px] text-white/60 font-medium">Live Session Active</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                <Flame size={9} className="text-amber-400"/>
                <span className="text-[10px] text-amber-300 font-semibold">7-Day Streak</span>
              </div>
            </div>

            <p className="text-white/50 text-sm font-medium mb-2">{greetText[timeOfDay]}, Rahul 👋</p>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-3">
              Your Learning<br/>
              <span className="text-shimmer">Dashboard</span>
            </h1>
            <p className="text-white/45 text-sm leading-relaxed max-w-md">
              You've studied{' '}<span className="text-violet-300 font-semibold">4 hours</span> this week.
              Next milestone: <span className="text-amber-300 font-semibold">Level 13</span> in 660 XP.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { label:'Start Quick Quiz',     icon:Zap,      page:'revision',    style:{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }, shadow:'shadow-violet-500/30' },
                { label:'AI Doubt Solver',       icon:Sparkles, page:'solver',      style:{ background:'linear-gradient(135deg,#0ea5e9,#2563eb)' }, shadow:'shadow-blue-500/20' },
                { label:'Collaborative Workspace',icon:Users,   page:'workspace',   style:{ background:'linear-gradient(135deg,#059669,#0284c7)' }, shadow:'shadow-emerald-500/20' },
              ].map(a => (
                <button key={a.label} onClick={() => setActivePage(a.page)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg ${a.shadow} hover:opacity-90 active:scale-95 transition-all`}
                  style={a.style}>
                  <a.icon size={13}/> {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Big ring + mini stats */}
          <div className="flex items-center gap-6 xl:flex-shrink-0">
            {/* Big mastery ring */}
            <div className="relative">
              <svg width={130} height={130}>
                <defs>
                  <linearGradient id="heroRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6"/>
                    <stop offset="50%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Track */}
                <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
                {/* Progress */}
                <circle cx="65" cy="65" r="52" fill="none" stroke="url(#heroRing)" strokeWidth="9"
                  strokeDasharray={`${0.73 * 326.7} 326.7`} strokeLinecap="round" filter="url(#glow)"
                  style={{ transform:'rotate(-90deg)', transformOrigin:'65px 65px',
                    transition:'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}/>
                {/* Inner text */}
                <text x="65" y="58" textAnchor="middle" fontSize="24" fontWeight="800" fill="white">73%</text>
                <text x="65" y="75" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">Overall</text>
                <text x="65" y="88" textAnchor="middle" fontSize="8" fill="rgba(139,92,246,0.8)" fontWeight="600">MASTERY</text>
              </svg>
            </div>

            {/* Side mini stats */}
            <div className="flex flex-col gap-3">
              {[
                { label:'XP Earned', val:'2,340', icon:Star, color:'text-amber-400' },
                { label:'Rank', val:'#5 / 142', icon:Trophy, color:'text-violet-400' },
                { label:'Accuracy', val:'78%', icon:Target, color:'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5 bg-white/[0.05] rounded-xl px-3.5 py-2.5 border border-white/[0.07]">
                  <s.icon size={14} className={s.color}/>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{s.val}</p>
                    <p className="text-[9px] text-white/35 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ STAT CARDS ════════════════════════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => {
          const c = colorMap[card.color]
          return (
            <div key={card.label}
              className={`glass rounded-2xl p-5 border ${c.border} transition-all hover:scale-[1.02] cursor-default group`}
              style={{ boxShadow:`0 0 0 0 ${c.glow}`, transitionDelay:`${i*60}ms` }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 40px ${c.glow}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 0 transparent'}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <card.icon size={17} className={c.text}/>
                </div>
                <TrendingUp size={12} className="text-white/20 group-hover:text-white/40 transition-colors"/>
              </div>
              <p className="text-3xl font-bold text-white mb-1.5">
                <AnimatedCounter target={card.value}/>
              </p>
              <p className="text-[11px] text-white/40 font-medium">{card.label}</p>
              <p className={`text-[10px] mt-1.5 font-semibold ${c.text}`}>{card.delta}</p>
            </div>
          )
        })}
      </div>

      {/* ══════════════════ BODY GRID ═════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ─── LEFT (2/3) ─── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Bar Chart — FIXED */}
          <BarChart/>

          {/* Today's Focus */}
          <div className="glass rounded-2xl p-6 border border-violet-500/10"
            style={{ background:'linear-gradient(135deg,rgba(109,40,217,0.08),rgba(29,78,216,0.04))' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Brain size={14} className="text-white"/>
                </div>
                <p className="text-sm font-bold text-white">Today's Focus</p>
              </div>
              <div className="text-[10px] text-violet-400 font-semibold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {tasksDone.length}/{upcomingTasks.length} done
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {upcomingTasks.map((t, i) => {
                const done = tasksDone.includes(i)
                const pri = { high:'bg-red-400', medium:'bg-amber-400', low:'bg-emerald-400' }
                return (
                  <div key={i}
                    onClick={() => toggleTask(i)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group
                      ${done
                        ? 'border-white/[0.05] bg-white/[0.02] opacity-50'
                        : t.priority === 'high'
                          ? 'border-red-500/15 bg-red-500/[0.04] hover:bg-red-500/[0.07]'
                          : t.priority === 'medium'
                            ? 'border-amber-500/15 bg-amber-500/[0.04] hover:bg-amber-500/[0.07]'
                            : 'border-white/[0.06] hover:bg-white/[0.02]'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? 'bg-emerald-400' : pri[t.priority]}`}/>
                    <p className={`text-sm flex-1 font-medium transition-all ${done ? 'line-through text-white/30' : 'text-white/70'}`}>
                      {t.task}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Clock size={9} className="text-white/20"/>
                        <span className="text-[9px] text-white/30">{t.due}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                        ${done ? 'bg-emerald-500/20 border-emerald-500/40' : 'border-white/[0.15] group-hover:border-violet-400/40'}`}>
                        {done && <CheckCircle2 size={12} className="text-emerald-400"/>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* XP Progress */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/40 font-medium">Level 12 → 13</span>
                <span className="text-[10px] text-violet-400 font-semibold">2,340 / 3,000 XP</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="xp-bar h-full rounded-full" style={{ width:'78%' }}/>
              </div>
              <p className="text-[9px] text-white/25 mt-1.5">660 XP to reach Level 13 — complete 2 more tasks today!</p>
            </div>
          </div>

          {/* Heatmap */}
          <StudyHeatmap/>
        </div>

        {/* ─── RIGHT (1/3) ─── */}
        <div className="flex flex-col gap-5">

          {/* Topic Mastery */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">Topic Mastery</p>
              <button onClick={() => setActivePage('revision')}
                className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors">
                Revise <ArrowRight size={9}/>
              </button>
            </div>
            <div className="flex flex-col gap-3.5">
              {topicProgress.map(t => (
                <div key={t.name} className="flex items-center gap-3 group cursor-default">
                  <Ring pct={t.pct} color={t.color} size={42} stroke={3.5}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-white/70 truncate mb-1.5">{t.name}</p>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80"
                        style={{ width:`${t.pct}%`, backgroundColor:t.color }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">Recent Activity</p>
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400"/>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60"/>
              </div>
            </div>
            <div className="flex flex-col">
              {recentActivity.map((a, i) => (
                <div key={i} className={`flex gap-3 py-2.5 ${i < recentActivity.length-1 ? 'border-b border-white/[0.04]' : ''}`}>
                  <span className="text-sm flex-shrink-0">{a.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/55 leading-relaxed">{a.text}</p>
                    <p className="text-[9px] text-white/25 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Peek */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">Your Ranking</p>
              <button onClick={() => setActivePage('leaderboard')}
                className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors">
                Full Board <ArrowRight size={9}/>
              </button>
            </div>

            {/* Podium mini */}
            <div className="flex items-end justify-center gap-2 mb-4">
              {[
                { name:'Priya', xp:'8.4k', rank:1, h:52, color:'from-pink-400 to-rose-500', crown:true },
                { name:'Arjun', xp:'7.3k', rank:2, h:40, color:'from-blue-400 to-cyan-500' },
                { name:'Sneha', xp:'6.8k', rank:3, h:32, color:'from-emerald-400 to-teal-500' },
              ].map(p => (
                <div key={p.rank} className="flex flex-col items-center gap-1">
                  {p.crown && <span className="text-sm">👑</span>}
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-[9px] font-bold text-white`}>
                    {p.name.slice(0,2).toUpperCase()}
                  </div>
                  <p className="text-[9px] text-white/45 font-medium">{p.name}</p>
                  <p className="text-[8px] text-white/25">{p.xp} XP</p>
                  <div className="w-12 rounded-t-lg" style={{
                    height: p.h,
                    background: p.rank === 1
                      ? 'linear-gradient(180deg,rgba(245,158,11,0.4),rgba(245,158,11,0.1))'
                      : 'rgba(255,255,255,0.05)',
                    border: p.rank === 1 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}/>
                </div>
              ))}
            </div>

            {/* Your position */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/8 border border-violet-500/20">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-[9px] font-bold text-white">RR</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-violet-200">You — #5</p>
                <p className="text-[9px] text-white/35">4,680 XP · 1,220 to next rank</p>
              </div>
              <Medal size={16} className="text-violet-400 flex-shrink-0"/>
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass rounded-2xl p-5 border border-violet-500/15 glow-purple">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center animate-glow-pulse">
                <Sparkles size={13} className="text-white"/>
              </div>
              <p className="text-xs font-bold text-white/65 uppercase tracking-widest">AI Insight</p>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Backpropagation score dropped{' '}
              <span className="text-red-400 font-semibold">12%</span> this week.
              I recommend the Chain Rule flashcards then a focused mini-quiz.
            </p>
            <button
              onClick={() => setActivePage('revision')}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90"
              style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              Start Recommended Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
