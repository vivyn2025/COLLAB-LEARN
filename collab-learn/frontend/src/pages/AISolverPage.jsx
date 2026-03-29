import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Bot, User, Lightbulb, BookOpen, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const suggestedQuestions = [
  'Explain backpropagation in simple terms',
  'Why does ReLU outperform sigmoid in deep networks?',
  'What is the intuition behind the chain rule?',
  'How does Adam optimizer differ from SGD?',
]

const aiResponses = {
  'backprop': "Based on your **Week 7 notes**: Backpropagation works by computing the gradient of the loss function with respect to every weight using the chain rule. Think of it as a series of 'blame signals' flowing from output to input — each layer tells the layer before it how much it contributed to the error.\n\n**Key steps:**\n1. Forward pass — compute output\n2. Compute loss\n3. Backward pass — propagate gradients\n4. Update weights using optimizer",
  'relu': "From your **activation function notes**: ReLU (f(x) = max(0, x)) doesn't saturate for positive inputs, unlike sigmoid or tanh which squash values into (0,1) or (-1,1). This means gradients don't vanish as they propagate backwards through many ReLU layers, enabling effective deep network training.",
  'chain': "The chain rule in calculus says: **d(f(g(x)))/dx = f'(g(x)) × g'(x)**. In neural networks, this allows us to compute how a change in one weight deep in the network affects the final output loss by chaining all the intermediate gradient computations together.",
  'adam': "Adam combines **Momentum** (which uses past gradients) and **RMSProp** (which adapts learning rates per parameter). It maintains two moving averages: the first-moment (mean of gradients) and second-moment (variance of gradients), giving each weight a tailored learning rate. This is why it converges faster than vanilla SGD on most tasks.",
  'default': "That's a great question! Based on your notes, I can see you're studying deep learning concepts. Could you be more specific about which aspect you'd like me to explain? I can reference your exact lecture notes for a precise answer.",
}

const getResponse = (q) => {
  const lower = q.toLowerCase()
  if (lower.includes('backprop')) return aiResponses['backprop']
  if (lower.includes('relu') || lower.includes('sigmoid')) return aiResponses['relu']
  if (lower.includes('chain')) return aiResponses['chain']
  if (lower.includes('adam') || lower.includes('sgd')) return aiResponses['adam']
  return aiResponses['default']
}

function MessageBubble({ m, onCopy, onFeedback }) {
  const [liked, setLiked] = useState(null)

  const lines = m.text.split('\n')

  return (
    <div className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0
        ${m.role === 'ai'
          ? 'bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20'
          : 'bg-gradient-to-br from-violet-400 to-pink-400'}`}>
        {m.role === 'ai' ? <Bot size={15} className="text-white" /> : <User size={15} className="text-white" />}
      </div>
      <div className={`max-w-2xl flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed
          ${m.role === 'ai'
            ? 'glass-strong text-white/75 rounded-tl-sm border border-white/[0.07]'
            : 'bg-gradient-to-br from-violet-600/28 to-blue-600/20 border border-violet-500/20 text-white/80 rounded-tr-sm'}`}>
          {lines.map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-bold text-white/90 mt-2 first:mt-0">{line.slice(2, -2)}</p>
            }
            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
              return <p key={i} className="ml-3">{line}</p>
            }
            const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            return <p key={i} className={i > 0 && line ? 'mt-1' : ''} dangerouslySetInnerHTML={{ __html: bold }} />
          })}
        </div>
        {m.role === 'ai' && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <p className="text-[10px] text-white/20">Sourced from your lecture notes · Week 7</p>
            <div className="flex gap-1.5 ml-2">
              <button onClick={() => onCopy(m.text)} className="text-white/20 hover:text-white/50 transition-colors p-0.5">
                <Copy size={10} />
              </button>
              <button onClick={() => { setLiked(true); onFeedback('up') }} className={`p-0.5 transition-colors ${liked === true ? 'text-emerald-400' : 'text-white/20 hover:text-white/50'}`}>
                <ThumbsUp size={10} />
              </button>
              <button onClick={() => { setLiked(false); onFeedback('down') }} className={`p-0.5 transition-colors ${liked === false ? 'text-red-400' : 'text-white/20 hover:text-white/50'}`}>
                <ThumbsDown size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AISolverPage() {
  const toast = useToast()
  const [messages, setMessages] = useState([{
    id: 1, role: 'ai',
    text: "Hello! I'm your context-aware AI tutor. I have access to your lecture notes and the shared workspace. Ask me anything about your study material and I'll give you a precise, contextual explanation.",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (question = input) => {
    if (!question.trim() || loading) return
    setMessages(m => [...m, { id: Date.now(), role: 'user', text: question }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'ai', text: getResponse(question) }])
      setLoading(false)
    }, 1200)
  }

  const clearChat = () => {
    setMessages([messages[0]])
    toast.info('Chat cleared — context reset')
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => toast.info('Answer copied to clipboard'))
  }

  const handleFeedback = (type) => {
    if (type === 'up') toast.success('Thanks! This helps improve AI responses.', 'Positive Feedback')
    else toast.info("Got it — I'll improve this answer type.", 'Feedback Received')
  }

  return (
    <div className="h-full flex flex-col animate-page-enter">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <Sparkles size={12} /> AI Doubt Solver · RAG-Powered
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Doubt Solver</h1>
            <p className="text-white/40 mt-1 text-sm">Context-aware chatbot trained on your notes, shared workspace and lecture material.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <BookOpen size={12} className="text-violet-400" />
              <div>
                <p className="text-[9px] text-white/35 font-medium">Context Sources</p>
                <p className="text-xs text-white font-semibold">24 notes · 1 workspace</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="glass p-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              title="Clear chat"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="px-8 mb-4 flex-shrink-0">
        <div className="flex gap-2 flex-wrap">
          {suggestedQuestions.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="flex items-center gap-1.5 glass px-3 py-2 rounded-xl text-xs text-white/45 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            >
              <Lightbulb size={10} className="text-amber-400 flex-shrink-0" />
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pb-4 flex flex-col gap-5">
        {messages.map(m => (
          <MessageBubble key={m.id} m={m} onCopy={handleCopy} onFeedback={handleFeedback} />
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={15} className="text-white" />
            </div>
            <div className="glass-strong px-5 py-4 rounded-2xl rounded-tl-sm border border-white/[0.07]">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-8 pb-8 flex-shrink-0">
        <div className="glass-strong rounded-2xl flex gap-3 p-2 items-end border border-white/[0.07] focus-within:border-violet-500/30 transition-all">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Ask anything about your lecture notes... (Enter to send, Shift+Enter for newline)"
            rows={2}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white/70 placeholder-white/18 resize-none outline-none"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-1 transition-all disabled:opacity-30 active:scale-90 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-white/18 text-center mt-2">AI searches your 24 notes to provide context-specific answers</p>
      </div>
    </div>
  )
}
