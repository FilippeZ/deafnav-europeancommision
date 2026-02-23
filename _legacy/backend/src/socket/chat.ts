import { Server } from 'socket.io';
import { createServer } from 'http';

export const initSocket = (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Join support room
        socket.on('join_support', (userId) => {
            socket.join(`support_${userId}`);
            console.log(`User ${userId} joined support room`);
        });

        // Handle Chat Message
        socket.on('send_message', (data) => {
            const { room, message, senderId } = data;
            io.to(room).emit('receive_message', {
                content: message,
                senderId: senderId,
                timestamp: new Date()
            });
        });

        // Handle SOS Alert
        socket.on('sos_alert', (data) => {
            console.log('🚨 SOS Alert received!', data);
            io.emit('emergency_broadcast', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};
