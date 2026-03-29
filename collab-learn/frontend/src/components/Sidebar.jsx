import { BrainCircuit, BookOpen, BarChart2, Users, MessageCircle, Sparkles, GitBranch, Trophy, Settings, Menu, X, Bell, ChevronRight } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useState } from 'react'

const navItems = [
  { id: 'dashboard', icon: BrainCircuit, label: 'Dashboard', desc: 'Overview & Stats', badge: null },
  { id: 'notes', icon: BookOpen, label: 'My Notes', desc: 'Capture & Structure', badge: '3' },
  { id: 'revision', icon: BarChart2, label: 'Revision Engine', desc: 'Spaced Learning', badge: null },
  { id: 'peers', icon: Users, label: 'Smart Matching', desc: 'Find Study Peers', badge: '2' },
  { id: 'workspace', icon: MessageCircle, label: 'Workspace', desc: 'Collaborate Live', badge: '🔴' },
  { id: 'solver', icon: Sparkles, label: 'AI Doubt Solver', desc: 'Context-Aware Help', badge: null },
  { id: 'graph', icon: GitBranch, label: 'Knowledge Graph', desc: 'Visualize Concepts', badge: null },
  { id: 'leaderboard', icon: Trophy, label: 'Leaderboard', desc: 'Rankings & XP', badge: null },
]

export default function Sidebar({ activePage, setActivePage }) {
  const toast = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, text: 'Priya Sharma started editing the shared note', time: '2m ago', read: false, icon: '✏️' },
    { id: 2, text: 'Quiz result: 2/3 correct — Backpropagation needs review', time: '18m ago', read: false, icon: '🧠' },
    { id: 3, text: 'New peer match found: Arjun Mehta (88% compatibility)', time: '1h ago', read: true, icon: '🤝' },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <aside
        className="relative flex flex-col h-full transition-all duration-300 border-r border-white/[0.06]"
        style={{
          width: collapsed ? '70px' : '276px',
          background: 'linear-gradient(180deg, rgba(15,10,30,0.98) 0%, rgba(8,8,18,0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Background glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-48 h-48 rounded-full bg-blue-600/6 blur-3xl pointer-events-none" />

        {/* Logo + Collapse */}
        <div className="p-4 border-b border-white/[0.055] flex items-center gap-3 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0 cursor-pointer"
            onClick={() => setActivePage('dashboard')}
          >
            <BrainCircuit size={17} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm tracking-wide font-[Space_Grotesk]">CollabLearn</p>
              <p className="text-[10px] text-white/35 font-medium tracking-widest uppercase">AI Learning System</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all flex-shrink-0"
          >
            {collapsed ? <Menu size={13} /> : <X size={13} />}
          </button>
        </div>

        {/* User Card */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-2xl glass hover:bg-white/[0.045] transition-all cursor-pointer group">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-sm font-bold text-white">
                  RR
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full status-online border-2 border-[#0a0a0f]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">Rahul Ravi</p>
                <p className="text-[10px] text-white/35 truncate">CS · Sem 5 · Lvl 12</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Notification bell */}
                <button
                  onClick={(e) => { e.stopPropagation(); setNotifOpen(n => !n) }}
                  className="relative w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                >
                  <Bell size={13} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-violet-500 text-[8px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <ChevronRight size={13} className="text-white/25 group-hover:text-white/50 transition-colors" />
              </div>
            </div>
          </div>
        )}

        {/* Notifications dropdown */}
        {notifOpen && !collapsed && (
          <div className="mx-3 mb-2 glass-dark rounded-2xl overflow-hidden border border-white/[0.08] animate-slide-up flex-shrink-0">
            <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Notifications</p>
              <button onClick={() => setNotifOpen(false)} className="text-white/30 hover:text-white/60"><X size={11} /></button>
            </div>
            {notifications.map(n => (
              <div key={n.id} className={`flex gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors ${!n.read ? 'bg-violet-500/5' : ''}`}>
                <span className="text-sm flex-shrink-0 mt-0.5">{n.icon}</span>
                <div className="min-w-0">
                  <p className={`text-[10px] leading-relaxed ${n.read ? 'text-white/35' : 'text-white/65'}`}>{n.text}</p>
                  <p className="text-[9px] text-white/25 mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}

        {/* XP Bar */}
        {!collapsed && (
          <div className="px-4 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] text-white/35 font-medium uppercase tracking-widest">Level 12</span>
              <span className="text-[9px] text-violet-400 font-semibold">2,340 / 3,000 XP</span>
            </div>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="xp-bar h-full rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-1 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(({ id, icon: Icon, label, desc, badge }) => {
            const isActive = activePage === id
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                title={collapsed ? label : ''}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-violet-600/18 to-blue-600/8 border border-violet-500/18 text-white'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.03] border border-transparent'
                  }`}
              >
                {/* Active bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-violet-400 to-blue-400 rounded-full" />
                )}

                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive
                    ? 'bg-gradient-to-br from-violet-500/25 to-blue-500/20 text-violet-300'
                    : 'bg-white/[0.04] text-white/35 group-hover:bg-white/[0.06] group-hover:text-white/55'
                  }`}
                >
                  <Icon size={14} />
                </div>

                {/* Label */}
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold truncate">{label}</p>
                    <p className={`text-[9px] truncate font-normal ${isActive ? 'text-white/40' : 'text-white/22'}`}>{desc}</p>
                  </div>
                )}

                {/* Badge */}
                {!collapsed && badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    badge === '🔴'
                      ? 'text-[10px]'
                      : 'bg-violet-500/20 border border-violet-500/30 text-violet-300'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed ? (
          <div className="p-3 border-t border-white/[0.055] flex-shrink-0">
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[{ label: 'Notes', val: '24' }, { label: 'Streak', val: '7d' }, { label: 'Score', val: '82%' }].map(s => (
                <div key={s.label} className="glass rounded-xl p-2 text-center">
                  <p className="text-[11px] font-bold gradient-text">{s.val}</p>
                  <p className="text-[8px] text-white/30 mt-0.5 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl glass hover:bg-white/[0.04] transition-all text-white/40 hover:text-white/65 text-xs"
            >
              <Settings size={13} />
              <span className="font-medium">Settings & Preferences</span>
            </button>
          </div>
        ) : (
          <div className="p-2 border-t border-white/[0.055] flex-shrink-0">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center justify-center py-2 rounded-xl glass hover:bg-white/[0.04] transition-all text-white/40 hover:text-white/65"
            >
              <Settings size={14} />
            </button>
          </div>
        )}
      </aside>

      {/* Settings Drawer */}
      {settingsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
            style={{ zIndex: 9990 }}
            onClick={() => setSettingsOpen(false)}
          />
          <SettingsDrawer onClose={() => setSettingsOpen(false)} toast={toast} />
        </>
      )}
    </>
  )
}

function SettingsDrawer({ onClose, toast }) {
  const [theme, setTheme] = useState('dark')
  const [aiModel, setAiModel] = useState('gpt-4')
  const [notifs, setNotifs] = useState(true)
  const [soundFX, setSoundFX] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  return (
    <div className="fixed right-0 top-0 h-full w-96 flex flex-col border-l border-white/[0.1] animate-slide-in-right"
      style={{ zIndex: 9991, background: 'rgba(10,8,25,0.96)', backdropFilter: 'blur(28px)' }}>
      {/* Header */}
      <div className="p-6 border-b border-white/[0.07] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <p className="text-xs text-white/40 mt-0.5">Customize your CollabLearn experience</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Profile */}
        <Section title="Profile">
          <div className="flex items-center gap-4 p-4 glass rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-base font-bold text-white flex-shrink-0">RR</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Rahul Ravi</p>
              <p className="text-xs text-white/40">rahulravi@cs.edu</p>
              <p className="text-xs text-violet-400 mt-0.5">Level 12 · 2,340 XP</p>
            </div>
            <button className="text-xs text-white/40 hover:text-white border border-white/[0.08] px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/[0.05]">Edit</button>
          </div>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <ToggleRow label="Dark Mode" sub="Always active for focus learning" value={theme === 'dark'} onChange={() => {}} />
          <div className="mt-3">
            <label className="text-xs text-white/50 font-medium block mb-2">Font Size: {fontSize}px</label>
            <input type="range" min="12" max="18" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
        </Section>

        {/* AI Settings */}
        <Section title="AI Model">
          {['gpt-4', 'gpt-3.5', 'local-llama'].map(m => (
            <button
              key={m}
              onClick={() => setAiModel(m)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all mb-2 text-sm ${
                aiModel === m
                  ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
                  : 'border-white/[0.06] glass text-white/50 hover:text-white/70 hover:border-white/[0.1]'
              }`}
            >
              <span className="font-medium">{m === 'local-llama' ? '🦙 Local LlaMa' : m === 'gpt-4' ? '✨ GPT-4 Turbo' : '⚡ GPT-3.5'}</span>
              {aiModel === m && <span className="text-[9px] font-bold text-violet-400 border border-violet-500/30 px-1.5 py-0.5 rounded-full">ACTIVE</span>}
            </button>
          ))}
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <ToggleRow label="Push Notifications" sub="Peer messages, quiz reminders" value={notifs} onChange={() => setNotifs(n => !n)} />
          <ToggleRow label="Sound Effects" sub="UI interaction sounds" value={soundFX} onChange={() => setSoundFX(n => !n)} />
        </Section>

        {/* Data */}
        <Section title="Data & Export">
          <button
            onClick={() => { toast.success('Notes exported as PDF!', 'Export Complete'); onClose() }}
            className="w-full py-3 rounded-xl border border-blue-500/20 bg-blue-500/8 text-blue-300 text-sm font-medium hover:bg-blue-500/15 transition-all mb-2"
          >
            📄 Export All Notes as PDF
          </button>
          <button
            onClick={() => { toast.info('Sync complete — all notes backed up', 'Synced'); onClose() }}
            className="w-full py-3 rounded-xl border border-white/[0.08] glass text-white/50 text-sm font-medium hover:text-white/70 hover:bg-white/[0.04] transition-all"
          >
            ☁️ Sync with Cloud
          </button>
        </Section>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.07] flex-shrink-0">
        <button
          onClick={() => { toast.success('Settings saved!', 'Preferences Updated'); onClose() }}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-white/75">{label}</p>
        <p className="text-xs text-white/30">{sub}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-10 h-5.5 rounded-full relative transition-all duration-200 flex-shrink-0 ${value ? 'bg-violet-500' : 'bg-white/10'}`}
        style={{ width: 40, height: 22 }}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
