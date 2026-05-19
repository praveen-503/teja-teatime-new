import 'express-async-errors';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { setupSockets } from './sockets/index';
import { swaggerDocument } from './config/swagger';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'https://teja-teatime-new-client.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── HEALTH CHECK ──────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── SWAGGER DOCS ────────────────────────────────
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerDocument);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ── API ROUTES ────────────────────────────────────
app.use('/api', routes);

// ── SOCKET.IO ─────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app for use in controllers
app.set('io', io);

setupSockets(io);

// ── ERROR HANDLER ─────────────────────────────────
app.use(errorHandler);

// ── START ─────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5001', 10);

server.listen(PORT, () => {
  console.log(`\n🍵 Tea Time Server running`);
  console.log(`   URL:  http://localhost:${PORT}`);
  console.log(`   Env:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Time: ${new Date().toLocaleTimeString()}\n`);
});

export { io };
