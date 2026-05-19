import { Server, Socket } from 'socket.io';

export const setupSockets = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Customer joins a room specific to their order to receive updates
    socket.on('order:join', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`   Socket ${socket.id} joined room: order:${orderId}`);
    });

    // Customer leaves order room
    socket.on('order:leave', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`   Socket ${socket.id} left room: order:${orderId}`);
    });

    // Kitchen/staff joins kitchen room
    socket.on('kitchen:join', () => {
      socket.join('kitchen');
      console.log(`   Socket ${socket.id} joined kitchen room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
