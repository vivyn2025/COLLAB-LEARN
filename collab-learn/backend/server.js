import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
// In production, instantiate with real key: const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CollabLearn API is running.' });
});

app.post('/api/notes', async (req, res) => {
  try {
    const { content, userId } = req.body;
    
    // Simulating OpenAI response for demo without requiring API key
    if (!content) throw new Error("Content is required");
    
    // Normally you'd call OpenAI here
    const structuredContent = {
      summary: "This is a mock AI summary generated from your notes on " + (content.substring(0, 20) + "...") ,
      flashcards: [
        { q: "What is this?", a: "A mock flashcard." }
      ]
    };

    res.status(200).json({ success: true, structuredContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
  });
  
  socket.on('edit-note', ({ workspaceId, delta }) => {
    socket.to(workspaceId).emit('receive-edit', delta);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
