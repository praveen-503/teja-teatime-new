import http from 'http';
import { Server } from 'socket.io';
import { setupSockets } from './sockets/index';

import app from './app';

const server = http.createServer(app);

// ── SOCKET.IO ─────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'https://teja-teatime-new-client.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app for use in controllers
app.set('io', io);

setupSockets(io);

// ── START ─────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5001', 10);

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`\n🍵 Tea Time Server running`);
    console.log(`   URL:  http://localhost:${PORT}`);
    console.log(`   Env:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}\n`);
  });
}

export { io };
