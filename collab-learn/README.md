# Context-Aware Collaborative Learning System

> **CollabLearn** — A Lovable-style, AI-powered collaborative learning platform that transforms raw lecture notes into structured, shareable, and context-aware knowledge while enabling intelligent peer collaboration.

![CollabLearn UI](./preview.png)

## 🚀 Features

- **AI-Powered Note Structuring** — Convert raw notes into summaries, key points, and flashcards instantly
- **Smart Peer Matching** — Neural embedding-based semantic matching of learning gaps to peer strengths
- **Context-Aware Revision Engine** — Spaced repetition with AI-generated quizzes and learning paths
- **Collaborative Workspace** — Shared editor, real-time chat, and doubt threads
- **AI Doubt Solver** — RAG-powered chatbot trained on your specific lecture notes
- **Knowledge Graph** — Interactive 3D concept map linking ideas across lectures

## 🧠 Novel Innovations

1. **Semantic Concept Matching** — Vector embeddings of learning gaps matched against peer strength vectors using cosine similarity
2. **Engagement & Struggle Detection** — Micro-interaction tracking (typing speed, pauses) to proactively trigger AI assistance
3. **Lecture-to-Knowledge Graph** — AI connects concepts across different lectures into a navigable visual graph

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS v4 + Lucide Icons |
| Backend | Node.js + Express + Socket.io |
| Database | MongoDB (Mongoose) |
| AI | OpenAI GPT-4 API (RAG with Pinecone) |
| Real-time | WebSockets via Socket.io |

## 📁 Project Structure

\`\`\`
collab-learn/
├── frontend/          # React + Vite + Tailwind CSS v4
│   └── src/
│       ├── components/    # Sidebar
│       └── pages/         # 6 full feature pages
└── backend/           # Node.js + Express + Socket.io
    └── server.js
\`\`\`

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
\`\`\`

### Backend
\`\`\`bash
cd backend
npm install
# Create .env with OPENAI_API_KEY and MONGO_URI
npm run dev
# → http://localhost:5000
\`\`\`

### Environment Variables (Backend)
\`\`\`env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
MONGO_URI=mongodb+srv://your_connection_string
\`\`\`

## 🌐 Deployment

### Frontend → Vercel
1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `VITE_API_BASE_URL` env variable
4. Deploy

### Backend → Render
1. Create new Web Service on [render.com](https://render.com)
2. Connect GitHub repo → select `backend/` directory
3. Set environment variables
4. Deploy

## 🎯 Why CollabLearn?

Unlike Notion (document-centric), Google Docs (generic), or Quizlet (flashcard-only):
- **Context is preserved** — notes link to lecture timestamps and topics
- **Collaboration is intelligent** — peer matching is AI-driven, not random
- **AI understands YOUR notes** — the doubt solver reads your specific material

## 📄 License

MIT © 2026 Rahul Ravi (vivyn.cb23@bitsathy.ac.in)
