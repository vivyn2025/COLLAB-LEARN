import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NotesPage from './pages/NotesPage'
import RevisionPage from './pages/RevisionPage'
import PeerMatchPage from './pages/PeerMatchPage'
import WorkspacePage from './pages/WorkspacePage'
import AISolverPage from './pages/AISolverPage'
import KnowledgeGraphPage from './pages/KnowledgeGraphPage'
import DashboardPage from './pages/DashboardPage'
import LeaderboardPage from './pages/LeaderboardPage'
import { ToastProvider } from './context/ToastContext'

// Animated page wrapper with enter transition
function PageWrapper({ children, pageKey }) {
  const [key, setKey] = useState(pageKey)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => {
      setKey(pageKey)
      setVisible(true)
    }, 80)
    return () => clearTimeout(t)
  }, [pageKey])

  return (
    <div
      key={key}
      className={`h-full transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transform: visible ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.995)' }}
    >
      {children}
    </div>
  )
}

// Mesh background blobs
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="blob-1" style={{ top: '-100px', left: '-100px' }} />
      <div className="blob-2" style={{ bottom: '-100px', right: '-50px' }} />
      <div className="blob-3" style={{ top: '40%', left: '40%' }} />
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage setActivePage={setActivePage} />
      case 'notes': return <NotesPage />
      case 'revision': return <RevisionPage />
      case 'peers': return <PeerMatchPage />
      case 'workspace': return <WorkspacePage />
      case 'solver': return <AISolverPage />
      case 'graph': return <KnowledgeGraphPage />
      case 'leaderboard': return <LeaderboardPage />
      default: return <DashboardPage setActivePage={setActivePage} />
    }
  }

  return (
    <ToastProvider>
      {/* Root — establishes new stacking context so portal overlays work cleanly */}
      <div className="flex h-screen overflow-hidden mesh-bg relative" style={{ isolation: 'isolate' }}>
        <BackgroundEffects />

        {/* Sidebar — z-20 so it sits above content, but below modals/toasts */}
        <div className="relative flex-shrink-0" style={{ zIndex: 20 }}>
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        {/* Main content — z-10 keeps it below sidebar */}
        <main className="flex-1 overflow-y-auto relative min-w-0" style={{ zIndex: 10 }}>
          <PageWrapper pageKey={activePage}>
            {renderPage()}
          </PageWrapper>
        </main>
      </div>
    </ToastProvider>
  )
}
