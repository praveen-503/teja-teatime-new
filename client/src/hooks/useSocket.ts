import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socketInstance;
}

interface UseSocketOptions {
  events: Record<string, (data: unknown) => void>;
  rooms?: string[];
}

export function useSocket({ events, rooms = [] }: UseSocketOptions) {
  const socketRef = useRef<Socket>(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

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
