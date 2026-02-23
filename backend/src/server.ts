import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import './mqtt/subscriber'; // Initialize MQTT Listener
import sttRouter from './api/stt';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

app.use(express.json());

// Routes
app.use('/api/stt', sttRouter);

// Socket.io for Live Chat
io.on('connection', (socket) => {
    console.log('User connected to Live Chat:', socket.id);

    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        io.emit('message', msg); // Broadcast to all for demo
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
