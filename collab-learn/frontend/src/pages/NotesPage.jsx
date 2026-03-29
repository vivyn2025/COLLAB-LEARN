import { useState } from 'react'
import { Sparkles, BookOpen, Zap, Tag, AlertCircle, CheckCircle2, ChevronDown, Download, Copy, Plus, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const mockInsights = {
  summary: "Backpropagation is the algorithm for training neural networks by computing the gradient of the loss function with respect to each weight via the chain rule. The gradients flow backwards from the output layer to the input layer, allowing optimization algorithms like Adam or SGD to update weights and minimize prediction error.",
  keyPoints: [
    "Loss function measures model error (MSE for regression, Cross-Entropy for classification)",
    "Chain rule allows gradient computation across all layers",
    "Vanishing gradient problem affects deep networks with sigmoid/tanh activations",
    "ReLU activation helps mitigate vanishing gradients",
    "Adam optimizer adapts learning rate per-parameter for faster convergence",
  ],
  flashcards: [
    { q: "What is the mathematical foundation of backpropagation?", a: "The chain rule of calculus, which allows computing derivatives of composite functions." },
    { q: "Why is ReLU preferred over sigmoid in deep networks?", a: "ReLU doesn't saturate for positive values, preventing vanishing gradients in deep architectures." },
    { q: "What does the learning rate control?", a: "The step size during weight updates — too high causes divergence, too low causes slow training." },
  ],
  topics: ['Backpropagation', 'Activation Functions', 'Gradient Descent', 'Neural Networks', 'Adam Optimizer'],
}

const savedNotes = [
  { id: 1, title: 'Backpropagation Deep Dive', preview: 'Chain rule, gradient flow, vanishing...', date: 'Today', tag: 'CS401', words: 340, color: 'violet' },
  { id: 2, title: 'Activation Functions', preview: 'ReLU, sigmoid, tanh comparison...', date: 'Yesterday', tag: 'CS401', words: 212, color: 'blue' },
  { id: 3, title: 'Transformers Architecture', preview: 'Self-attention, positional encoding...', date: '3d ago', tag: 'CS401', words: 480, color: 'emerald' },
]

const tagColors = {
  violet: 'border-violet-500/20 text-violet-300',
  blue: 'border-blue-500/20 text-blue-300',
  emerald: 'border-emerald-500/20 text-emerald-300',
}

export default function NotesPage() {
  const toast = useToast()
  const [note, setNote] = useState('')
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [struggle, setStruggle] = useState(0)
  const [view, setView] = useState('editor') // 'editor' | 'saved'

  const wordCount = note.split(' ').filter(Boolean).length

  const handleNoteChange = (e) => {
    setNote(e.target.value)
    const wc = e.target.value.split(' ').filter(Boolean).length
    setStruggle(Math.min(100, Math.floor((wc / 80) * 100)))
  }

  const processNotes = async () => {
    if (!note.trim()) return
    setLoading(true)
    setTimeout(() => {
      setInsights(mockInsights)
      setLoading(false)
      toast.success('Notes structured into 3 flashcards & summary!', 'AI Processing Complete')
    }, 1800)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.info('Copied to clipboard'))
  }

  return (
    <div className="min-h-full p-8 animate-page-enter">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
            <BookOpen size={12} /> Notes · Deep Learning
          </div>
          <h1 className="text-3xl font-bold text-white">AI-Powered Note Structuring</h1>
          <p className="text-white/40 mt-1 text-sm">Paste raw lecture notes. Our AI structures them into summaries, flashcards & insights.</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setView('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${view === 'editor' ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'glass text-white/40 hover:text-white/65'}`}
          >
            ✏️ Editor
          </button>
          <button
            onClick={() => setView('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${view === 'saved' ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'glass text-white/40 hover:text-white/65'}`}
          >
            📚 Saved Notes ({savedNotes.length})
          </button>
        </div>
      </div>

      {view === 'saved' ? (
        /* Saved Notes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedNotes.map(n => (
            <div
              key={n.id}
              onClick={() => { setView('editor'); setNote(`[Loading: ${n.title}]`) }}
              className={`glass rounded-2xl p-5 border ${tagColors[n.color]} hover:scale-[1.02] transition-all cursor-pointer group card-hover`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br ${n.color === 'violet' ? 'from-violet-500/20 to-violet-500/5' : n.color === 'blue' ? 'from-blue-500/20 to-blue-500/5' : 'from-emerald-500/20 to-emerald-500/5'}`}>
                  📝
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${tagColors[n.color]} bg-white/5`}>{n.tag}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-200 transition-colors">{n.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{n.preview}</p>
              <div className="flex items-center justify-between text-[10px] text-white/25">
                <span>{n.words} words</span>
                <span>{n.date}</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setView('editor')}
            className="glass rounded-2xl p-5 border border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/55 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all cursor-pointer min-h-[160px]"
          >
            <Plus size={24} />
            <p className="text-xs font-medium">New Note</p>
          </button>
        </div>
      ) : (
        /* Editor View */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LEFT: Note Input */}
          <div className="flex flex-col gap-4">
            {/* Engagement meter */}
            {note && (
              <div className="glass rounded-2xl p-4 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-white/60">Engagement Meter</p>
                  <div className="flex items-center gap-1.5">
                    {struggle < 40 && <><AlertCircle size={11} className="text-amber-400" /><span className="text-[10px] text-amber-400 font-medium">Struggling detected</span></>}
                    {struggle >= 40 && struggle < 75 && <><CheckCircle2 size={11} className="text-blue-400" /><span className="text-[10px] text-blue-400 font-medium">Good flow!</span></>}
                    {struggle >= 75 && <><Sparkles size={11} className="text-emerald-400" /><span className="text-[10px] text-emerald-400 font-medium">Excellent engagement!</span></>}
                  </div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${struggle}%`,
                      background: struggle < 40
                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                        : 'linear-gradient(90deg, #3b82f6, #8b5cf6, #34d399)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Textarea */}
            <div className="relative flex-1">
              <textarea
                className="w-full h-[380px] p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] text-white/80 placeholder-white/20 text-sm leading-relaxed resize-none outline-none focus:border-violet-500/35 focus:bg-white/[0.04] transition-all"
                placeholder={`Paste your unstructured lecture notes here...\n\nExample: Backpropagation is an algorithm... gradient descent... chain rule... activation functions...`}
                value={note}
                onChange={handleNoteChange}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                {note && (
                  <button onClick={() => { setNote(''); setInsights(null) }} className="text-white/25 hover:text-white/50 transition-colors">
                    <X size={13} />
                  </button>
                )}
                <p className="text-[10px] text-white/20 font-mono">{wordCount} words</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'CS401 · Week 7', icon: Tag, color: 'text-violet-400' },
                { label: 'Deep Learning', icon: Zap, color: 'text-blue-400' },
              ].map(tag => (
                <div key={tag.label} className="flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 cursor-pointer hover:bg-white/[0.05] transition-all">
                  <tag.icon size={10} className={tag.color} />
                  <span className="text-xs text-white/55 font-medium">{tag.label}</span>
                </div>
              ))}
              <button className="flex items-center gap-1 glass rounded-xl px-2.5 py-1.5 text-[10px] text-white/30 hover:text-white/55 transition-all">
                <Plus size={10} /> Tag
              </button>
            </div>

            <button
              onClick={processNotes}
              disabled={loading || !note.trim()}
              className="relative overflow-hidden w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              {loading && <span className="absolute inset-0 animate-shimmer" />}
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles size={15} className={loading ? 'animate-spin' : ''} />
                {loading ? 'AI is structuring your notes...' : 'Structure with AI'}
              </span>
            </button>
          </div>

          {/* RIGHT: AI Insights */}
          <div className="flex flex-col gap-4">
            {insights ? (
              <>
                {/* Summary */}
                <div className="glass rounded-2xl p-5 glow-purple border border-violet-500/10 animate-slide-up">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Sparkles size={11} className="text-violet-400" />
                      </div>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest">AI Summary</p>
                    </div>
                    <button onClick={() => copyToClipboard(insights.summary)} className="text-white/25 hover:text-white/55 transition-colors p-1">
                      <Copy size={12} />
                    </button>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{insights.summary}</p>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {insights.topics.map(t => (
                    <span key={t} className="text-[11px] font-medium glass px-3 py-1.5 rounded-full text-violet-300 border border-violet-500/20 hover:bg-violet-500/10 transition-all cursor-pointer">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Key Points */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Key Points</p>
                    <button onClick={() => copyToClipboard(insights.keyPoints.join('\n'))} className="text-white/25 hover:text-white/55 transition-colors p-1">
                      <Copy size={12} />
                    </button>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {insights.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-[10px] font-bold text-violet-300 flex-shrink-0 mt-0.5">{i + 1}</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flashcards */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Flashcards · {insights.flashcards.length} generated</p>
                    <button
                      onClick={() => toast.success(`${insights.flashcards.length} flashcards saved to Revision Engine!`, 'Saved!')}
                      className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                    >
                      <Download size={10} /> Save to Revision
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {insights.flashcards.map((fc, i) => (
                      <div
                        key={i}
                        className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:border-violet-500/20 hover:bg-violet-500/[0.04] transition-all"
                        onClick={() => setActiveCard(activeCard === i ? null : i)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white/80">Q: {fc.q}</p>
                          <ChevronDown size={13} className={`text-white/30 flex-shrink-0 mt-0.5 transition-transform ${activeCard === i ? 'rotate-180' : ''}`} />
                        </div>
                        {activeCard === i && (
                          <div className="mt-3 pt-3 border-t border-white/[0.06] animate-slide-up">
                            <p className="text-sm text-emerald-300/80 leading-relaxed">A: {fc.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 glass rounded-2xl p-12" style={{ minHeight: '500px' }}>
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/15 to-blue-500/10 flex items-center justify-center animate-float">
                  <Sparkles size={34} className="text-violet-400/50" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white/25">AI Insights will appear here</p>
                  <p className="text-sm text-white/18 mt-1">Paste notes & click "Structure with AI" to begin</p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {['Summary', 'Flashcards', 'Key Points'].map(f => (
                    <div key={f} className="glass rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/25 font-medium">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
