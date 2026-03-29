import { useState } from 'react'
import { GitBranch, ZoomIn, ZoomOut, Info } from 'lucide-react'

const nodes = [
  { id: 'dl', label: 'Deep Learning', x: 50, y: 50, size: 'lg', color: '#8b5cf6', connections: ['bp', 'cnn', 'rnn', 'act'] },
  { id: 'bp', label: 'Backpropagation', x: 20, y: 25, size: 'md', color: '#ef4444', connections: ['cr', 'gd', 'loss'] },
  { id: 'cnn', label: 'Convolutional Nets', x: 75, y: 25, size: 'md', color: '#3b82f6', connections: ['pool', 'feat'] },
  { id: 'rnn', label: 'Recurrent Nets', x: 80, y: 70, size: 'md', color: '#06b6d4', connections: ['lstm'] },
  { id: 'act', label: 'Activation Fns', x: 20, y: 75, size: 'md', color: '#10b981', connections: ['relu', 'sig'] },
  { id: 'cr', label: 'Chain Rule', x: 5, y: 10, size: 'sm', color: '#a78bfa', connections: [] },
  { id: 'gd', label: 'Gradient Descent', x: 22, y: 8, size: 'sm', color: '#a78bfa', connections: ['adam'] },
  { id: 'loss', label: 'Loss Function', x: 38, y: 8, size: 'sm', color: '#a78bfa', connections: [] },
  { id: 'pool', label: 'Pooling Layers', x: 72, y: 10, size: 'sm', color: '#60a5fa', connections: [] },
  { id: 'feat', label: 'Feature Maps', x: 90, y: 10, size: 'sm', color: '#60a5fa', connections: [] },
  { id: 'lstm', label: 'LSTM / GRU', x: 90, y: 80, size: 'sm', color: '#22d3ee', connections: [] },
  { id: 'relu', label: 'ReLU', x: 5, y: 85, size: 'sm', color: '#34d399', connections: [] },
  { id: 'sig', label: 'Sigmoid', x: 20, y: 92, size: 'sm', color: '#34d399', connections: [] },
  { id: 'adam', label: 'Adam Optimizer', x: 38, y: 2, size: 'sm', color: '#a78bfa', connections: [] },
]

const sizeMap = { lg: { r: 38, font: 11, fw: 700 }, md: { r: 28, font: 9.5, fw: 600 }, sm: { r: 20, font: 8.5, fw: 500 } }

export default function KnowledgeGraphPage() {
  const [selected, setSelected] = useState(null)
  const selectedNode = nodes.find(n => n.id === selected)

  return (
    <div className="min-h-full p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-2">
          <GitBranch size={12} /> Knowledge Graph · Lecture-to-Concept Mapping
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Contextual Knowledge Graph</h1>
            <p className="text-white/40 mt-1 text-sm">AI-generated concept map from your notes — click any node to explore connections.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-2">
              {[
                { dot: '#8b5cf6', label: 'Core' },
                { dot: '#3b82f6', label: 'Topic' },
                { dot: '#a78bfa', label: 'Subtopic' },
              ].map(leg => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: leg.dot }} />
                  <span className="text-[10px] text-white/40 font-medium">{leg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Graph */}
        <div className="xl:col-span-3 glass rounded-2xl overflow-hidden" style={{ height: '520px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Connection lines */}
            {nodes.map(node =>
              node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId)
                if (!target) return null
                const isHighlighted = selected === node.id || selected === targetId
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.x} y1={node.y}
                    x2={target.x} y2={target.y}
                    stroke={isHighlighted ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={isHighlighted ? '0.5' : '0.2'}
                    strokeDasharray={isHighlighted ? '0' : '0.5 0.5'}
                  />
                )
              })
            )}

            {/* Nodes */}
            {nodes.map(node => {
              const s = sizeMap[node.size]
              const isSelected = selected === node.id
              const isConnected = selectedNode?.connections.includes(node.id)
              const dim = selected && !isSelected && !isConnected

              return (
                <g
                  key={node.id}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={s.r / 4 + 4} fill={node.color} opacity="0.15" />
                  )}
                  <circle
                    cx={node.x} cy={node.y}
                    r={s.r / 4}
                    fill={isSelected ? node.color : `${node.color}${dim ? '33' : '88'}`}
                    stroke={isSelected ? node.color : isConnected ? `${node.color}cc` : `${node.color}44`}
                    strokeWidth={isSelected ? '0.8' : '0.3'}
                  />
                  <text
                    x={node.x} y={node.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={s.font / 10}
                    fontWeight={s.fw}
                    fill={dim ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.label.split('/')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Info Panel */}
        <div className="flex flex-col gap-4">
          {selectedNode ? (
            <div className="glass rounded-2xl p-5">
              <div className="w-10 h-10 rounded-2xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${selectedNode.color}20`, border: `1px solid ${selectedNode.color}40` }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedNode.color }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{selectedNode.label}</h3>
              <p className="text-xs text-white/40 mb-4">
                {selectedNode.size === 'lg' ? 'Core Concept' : selectedNode.size === 'md' ? 'Main Topic' : 'Subtopic'}
                {' · '}{selectedNode.connections.length} connections
              </p>
              {selectedNode.connections.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Links To</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections.map(id => {
                      const n = nodes.find(n => n.id === id)
                      return n ? (
                        <button
                          key={id}
                          onClick={() => setSelected(id)}
                          className="text-[10px] font-medium px-2 py-1 rounded-full border transition-all hover:opacity-80"
                          style={{ backgroundColor: `${n.color}15`, borderColor: `${n.color}40`, color: n.color }}
                        >
                          {n.label}
                        </button>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">From Your Notes</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  {selectedNode.id === 'bp' && 'You studied this in Week 7, CS401. AI detected a struggle score of 45% on this topic.'}
                  {selectedNode.id === 'act' && 'Covered in Week 5, with high engagement. Flashcard score: 88%.'}
                  {selectedNode.id === 'dl' && 'The overarching topic of your current semester. Connected to 4 major sub-areas.'}
                  {!['bp', 'act', 'dl'].includes(selectedNode.id) && 'Referenced in your lecture notes from Week 5-8. Click to view related flashcards.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4" style={{ minHeight: '200px' }}>
              <Info size={28} className="text-white/20" />
              <div>
                <p className="text-sm font-medium text-white/30">Click any node</p>
                <p className="text-xs text-white/20 mt-1">to explore its connections and note references</p>
              </div>
            </div>
          )}

          <div className="glass rounded-2xl p-5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Graph Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Concepts', val: nodes.length },
                { label: 'Links', val: nodes.reduce((s, n) => s + n.connections.length, 0) },
                { label: 'Lectures', val: 7 },
                { label: 'Coverage', val: '76%' },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold gradient-text">{s.val}</p>
                  <p className="text-[10px] text-white/30 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
