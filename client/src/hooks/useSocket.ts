import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

function resolveSocketUrl(): string {
  const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  if (configuredSocketUrl) {
    try {
      const parsed = new URL(configuredSocketUrl);
      return parsed.origin;
    } catch {
      return configuredSocketUrl.replace(/\/$/, '');
    }
  }

  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredApiUrl && !configuredApiUrl.startsWith('/')) {
    try {
      return new URL(configuredApiUrl).origin;
    } catch {
      // fall through to defaults below
    }
  }

  return import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';
}

const SOCKET_URL = resolveSocketUrl();

function isSocketEnabled(): boolean {
  const configured = import.meta.env.VITE_ENABLE_SOCKET?.trim().toLowerCase();

  if (configured === 'true') return true;
  if (configured === 'false') return false;

  if (!import.meta.env.PROD) return true;

  try {
    const host = new URL(SOCKET_URL).hostname;
    return !host.endsWith('.vercel.app');
  } catch {
    return !window.location.hostname.endsWith('.vercel.app');
  }
}

const SOCKET_ENABLED = isSocketEnabled();

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      path: '/socket.io',
      transports: import.meta.env.PROD ? ['polling'] : ['websocket', 'polling'],
    });
  }
  return socketInstance;
}

interface UseSocketOptions {
  events: Record<string, (data: unknown) => void>;
  rooms?: string[];
}

export function useSocket({ events, rooms = [] }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(SOCKET_ENABLED ? getSocket() : null);

  useEffect(() => {
    if (!SOCKET_ENABLED) return;

    const socket = socketRef.current;
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join rooms
    rooms.forEach((room) => {
      socket.emit('order:join', room);
    });

    // Register event handlers
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      // Cleanup
      Object.entries(events).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      rooms.forEach((room) => {
        socket.emit('order:leave', room);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return socketRef.current;
}
