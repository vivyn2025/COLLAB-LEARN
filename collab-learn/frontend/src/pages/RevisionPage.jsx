import { useState } from 'react'
import { BarChart2, Brain, Calendar, CheckCircle2, XCircle, RotateCcw, TrendingUp, Clock, Flame, Trophy } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const topics = [
  { name: 'Backpropagation', score: 45, status: 'weak', lastReview: '3d ago', nextReview: 'Today', icon: '⚡', reviews: 8 },
  { name: 'Gradient Descent', score: 72, status: 'medium', lastReview: '1d ago', nextReview: 'Tomorrow', icon: '📉', reviews: 12 },
  { name: 'Activation Functions', score: 88, status: 'strong', lastReview: '5h ago', nextReview: 'In 3 days', icon: '🔥', reviews: 20 },
  { name: 'Convolutional Nets', score: 33, status: 'weak', lastReview: '5d ago', nextReview: 'Overdue!', icon: '🧠', reviews: 5 },
  { name: 'Transformers', score: 60, status: 'medium', lastReview: '2d ago', nextReview: 'Tomorrow', icon: '🤖', reviews: 9 },
]

const quizQuestions = [
  { q: "In backpropagation, what rule is used for computing gradients?", options: ["Product Rule", "Chain Rule", "Power Rule", "L'Hôpital's Rule"], answer: 1, topic: 'Backpropagation' },
  { q: "Which activation is preferred to mitigate vanishing gradients?", options: ["Sigmoid", "Tanh", "ReLU", "Softmax"], answer: 2, topic: 'Activation Functions' },
  { q: "What does the learning rate control in gradient descent?", options: ["Network depth", "Batch size", "Weight update step size", "Number of epochs"], answer: 2, topic: 'Gradient Descent' },
]

const statusColors = {
  weak: { bg: 'bg-red-500/8', text: 'text-red-400', border: 'border-red-500/20', bar: '#ef4444', label: 'Needs Work' },
  medium: { bg: 'bg-amber-500/8', text: 'text-amber-400', border: 'border-amber-500/20', bar: '#f59e0b', label: 'On Track' },
  strong: { bg: 'bg-emerald-500/8', text: 'text-emerald-400', border: 'border-emerald-500/20', bar: '#10b981', label: 'Mastered' },
}

export default function RevisionPage() {
  const toast = useToast()
  const [quizMode, setQuizMode] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)

  const handleAnswer = (idx) => {
    setSelected(idx)
    const correct = idx === quizQuestions[currentQ].answer
    setTimeout(() => {
      setResults(r => [...r, correct])
      if (currentQ + 1 < quizQuestions.length) {
        setCurrentQ(q => q + 1)
        setSelected(null)
      } else {
        setCurrentQ(quizQuestions.length)
      }
    }, 900)
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setSelected(null)
    setResults([])
    setQuizMode(false)
  }

  const handleQuizFinish = () => {
    const score = results.filter(Boolean).length
    if (score === quizQuestions.length) toast.success('Perfect score! 🎉 All topics improved!', 'Quiz Complete')
    else if (score >= 2) toast.info(`${score}/${quizQuestions.length} correct — Revision schedule updated`, 'Quiz Complete')
    else toast.warning('Under 50% — Review suggested. AI has updated your weak areas.', 'Quiz Complete')
  }

  const overallScore = Math.round(topics.reduce((s, t) => s + t.score, 0) / topics.length)

  return (
    <div className="min-h-full p-8 animate-page-enter">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <BarChart2 size={12} /> Revision · Spaced Repetition
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Context-Aware Revision Engine</h1>
            <p className="text-white/40 mt-1 text-sm">AI-identified weak areas and personalized spaced repetition schedule.</p>
          </div>
          <div className="flex items-center gap-4 glass rounded-2xl p-4 border border-white/[0.07]">
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text">{overallScore}%</p>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Avg. Mastery</p>
            </div>
            <div className="w-px h-8 bg-white/[0.07]" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Flame size={13} className="text-orange-400" />
                <p className="text-lg font-bold text-white">7</p>
              </div>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {!quizMode ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Topic Heatmap */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-white">Topic Mastery Overview</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {Object.entries(statusColors).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.bar }} />
                        <span className="text-[9px] text-white/30 font-medium">{v.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/35">
                    <TrendingUp size={10} /> Updated just now
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {topics.map(t => {
                  const col = statusColors[t.status]
                  const isSelected = selectedTopic === t.name
                  return (
                    <div
                      key={t.name}
                      onClick={() => setSelectedTopic(isSelected ? null : t.name)}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${col.border} ${col.bg} transition-all hover:scale-[1.01] cursor-pointer ${isSelected ? 'ring-1 ring-violet-500/30' : ''}`}
                    >
                      <span className="text-xl flex-shrink-0">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-semibold text-white">{t.name}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[9px] text-white/25">
                              <Clock size={9} /> Next: {t.nextReview}
                            </div>
                            <span className={`text-xs font-bold ${col.text}`}>{t.score}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${t.score}%`, backgroundColor: col.bar }}
                          />
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-4 mt-2 animate-slide-up">
                            <span className="text-[10px] text-white/30">Last review: {t.lastReview}</span>
                            <span className="text-[10px] text-white/30">Total reviews: {t.reviews}</span>
                            <button
                              onClick={e => { e.stopPropagation(); setQuizMode(true) }}
                              className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold ml-auto"
                            >
                              Practice now →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* AI Learning Path */}
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-bold text-white/55 uppercase tracking-widest mb-4">📍 AI Learning Path</p>
              <ol className="flex flex-col relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/[0.05]" />
                {['Review Backprop basics', 'Practice CNN quiz', 'Re-read Transformers notes', 'Final spaced quiz'].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 pb-5 last:pb-0 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold
                      ${i === 0 ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25' : 'bg-white/[0.06] text-white/30'}`}>
                      {i === 0 ? '→' : i + 1}
                    </div>
                    <p className={`text-sm font-medium mt-1.5 ${i === 0 ? 'text-white' : 'text-white/30'}`}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Start Quiz */}
            <button
              onClick={() => setQuizMode(true)}
              className="w-full py-4 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95 glow-animate-purple"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              <div className="flex items-center justify-center gap-2">
                <Brain size={15} />
                Start AI-Generated Quiz
              </div>
              <p className="text-[10px] text-white/55 mt-0.5 font-normal">3 questions · Weak areas focused</p>
            </button>

            {/* Calendar */}
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <Calendar size={20} className="text-violet-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/65">Next Revision Session</p>
                <p className="text-sm text-white font-bold mt-0.5">Today, 6:00 PM</p>
              </div>
              <button
                onClick={() => toast.success('Revision scheduled for 6:00 PM today!', 'Reminder Set')}
                className="ml-auto text-[10px] border border-violet-500/25 text-violet-400 px-2.5 py-1.5 rounded-lg hover:bg-violet-500/10 transition-all font-medium"
              >
                Remind Me
              </button>
            </div>

            {/* Weak topic alert */}
            <div className="glass rounded-2xl p-4 border border-red-500/15">
              <div className="flex items-start gap-3">
                <span className="text-lg">🚨</span>
                <div>
                  <p className="text-xs font-bold text-red-400 mb-1">Overdue Review</p>
                  <p className="text-xs text-white/45 leading-relaxed">Convolutional Nets hasn't been reviewed in 5 days. AI has moved it to the top of your queue.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ MODE */
        <div className="max-w-2xl mx-auto">
          {currentQ < quizQuestions.length ? (
            <div className="glass rounded-3xl p-8 glow-purple border border-violet-500/10 animate-scale-in">
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {quizQuestions.map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                    i < results.length ? (results[i] ? 'bg-emerald-400' : 'bg-red-400') :
                    i === currentQ ? 'bg-violet-500 animate-glow-pulse' : 'bg-white/[0.07]'
                  }`} />
                ))}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Question {currentQ + 1} of {quizQuestions.length}</span>
                <span className="text-[9px] glass px-2 py-0.5 rounded-full text-violet-300 border border-violet-500/20">{quizQuestions[currentQ].topic}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-8 leading-snug">{quizQuestions[currentQ].q}</h2>

              <div className="flex flex-col gap-3">
                {quizQuestions[currentQ].options.map((opt, idx) => {
                  const isCorrect = idx === quizQuestions[currentQ].answer
                  const isSelected = selected === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => selected === null && handleAnswer(idx)}
                      disabled={selected !== null}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-medium transition-all border
                        ${selected !== null
                          ? isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                            : isSelected
                              ? 'border-red-500/40 bg-red-500/10 text-red-300'
                              : 'border-white/[0.05] text-white/25'
                          : 'border-white/[0.07] text-white/70 hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-white cursor-pointer active:scale-[0.99]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full glass flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                        {selected !== null && isCorrect && <CheckCircle2 size={15} className="ml-auto text-emerald-400" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle size={15} className="ml-auto text-red-400" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* RESULTS */
            <div className="glass rounded-3xl p-10 text-center glow-purple border border-violet-500/10 animate-scale-in">
              <div className="text-6xl mb-6">
                {results.filter(Boolean).length === quizQuestions.length ? '🎉' : results.filter(Boolean).length >= 2 ? '✨' : '💪'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-white/45 mb-6 text-lg">
                <span className="gradient-text font-bold">{results.filter(Boolean).length}/{quizQuestions.length}</span> correct
              </p>

              {/* XP earned */}
              <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-center gap-3">
                <Trophy size={20} className="text-amber-400" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">+{results.filter(Boolean).length * 45} XP Earned!</p>
                  <p className="text-xs text-white/35">Revision schedule has been updated</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {results.map((r, i) => (
                  r ? <CheckCircle2 key={i} className="text-emerald-400" size={28} /> : <XCircle key={i} className="text-red-400" size={28} />
                ))}
              </div>
              <button
                onClick={() => { handleQuizFinish(); resetQuiz() }}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl glass hover:bg-white/[0.06] transition-all text-white/65 text-sm font-medium"
              >
                <RotateCcw size={13} /> Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
