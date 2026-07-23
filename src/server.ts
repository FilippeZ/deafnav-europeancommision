import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import mqtt from 'mqtt';
import net from 'net';
import { Aedes } from 'aedes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = Number(process.env.PORT) || 3000;
const MQTT_PORT = 1883;
const MQTT_BROKER_URL = `mqtt://localhost:${MQTT_PORT}`;

// 1. Initialize Aedes MQTT Broker
const broker = new Aedes();
const mqttServer = net.createServer(broker.handle);

mqttServer.listen(MQTT_PORT, () => {
    console.log(`✅ Broker: Internal MQTT Broker listening on port ${MQTT_PORT}`);
});

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);

    // 2. Initialize Socket.io
    const io = new Server(httpServer, {
        cors: { origin: "*", methods: ["GET", "POST"] }
    });

    // 3. Connect as a Local Client to our own Broker
    const mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on('connect', () => {
        console.log('✅ Backend: Connected to Internal MQTT Relay');
        mqttClient.subscribe('deafnav/telemetry');
    });

    const SIMULATED_ANNOUNCEMENTS = [
        { station: 'Σύνταγμα', content: '🚇 Line 2 (Red) — Next train in 2 min towards Ελληνικό', type: 'info', provider: 'ATTIKO METRO' },
        { station: 'Αεροδρόμιο', content: '🚇 Line 3 (Blue) — Express to Airport departing in 5 min from Μοναστηράκι', type: 'info', provider: 'ATTIKO METRO' },
        { station: 'Ευαγγελισμός', content: '⚠️ Elevator "E1" at Ευαγγελισμός station is currently out of service.', type: 'alert', provider: 'STASY' },
        { station: 'Σύνταγμα (Bus)', content: '🚌 Bus 040 (Λαυρίου) arriving at Σύνταγμα in 3 λεπτά', type: 'info', provider: 'OASA' },
    ];

    let announcementIndex = 0;

    const fetchTransitData = async () => {
        try {
            const item = SIMULATED_ANNOUNCEMENTS[announcementIndex % SIMULATED_ANNOUNCEMENTS.length];
            announcementIndex++;

            const announcement = {
                id: `sim-${Date.now()}`,
                content: item.content,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: item.type,
                station: item.station,
                provider: item.provider
            };

            io.emit('transit_update', {
                announcements: [announcement],
                timestamp: new Date().toISOString()
            });

            io.emit('arrival_update', {
                station: "Σύνταγμα",
                arrivalTime: new Date(Date.now() + 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                line: "Γραμμή 2 (Κόκκινη)",
                direction: "Ελληνικό",
                nextStation: "Πανεπιστήμιο",
                etaMinutes: 2 + (announcementIndex % 4),
                distance: 0.8,
                accessibility: item.type === 'alert' ? 'warning' : 'clear'
            });

        } catch (error) {
            console.error('❌ Transit Simulation Error:', error);
        }
    };

    setInterval(fetchTransitData, 60000);
    fetchTransitData();

    mqttClient.on('message', async (topic, message) => {
        if (topic === 'deafnav/telemetry') {
            try {
                const data = JSON.parse(message.toString());
                console.log(`📡 Relay: Telemetry Received - HR:${data.pulse}, Dist:${data.distance}`);

                try {
                    const devId = data.deviceId || "default_device";
                    let defaultUser = await prisma.user.findFirst({ where: { email: "demo@deafnav.eu" } });
                    if (!defaultUser) {
                        defaultUser = await prisma.user.create({
                            data: { email: "demo@deafnav.eu", name: "Demo User" }
                        });
                    }
                    let defaultDevice = await prisma.device.findUnique({ where: { id: devId } });
                    if (!defaultDevice) {
                        defaultDevice = await prisma.device.create({
                            data: { id: devId, ownerId: defaultUser.id, status: "active" }
                        });
                    }
                    await prisma.pulseLog.create({
                        data: {
                            deviceId: devId,
                            value: Number(data.pulse) || 72,
                        }
                    });
                } catch (dbErr) {
                    console.error('❌ DB Error:', dbErr);
                }

                io.emit('telemetry_update', {
                    pulse: data.pulse,
                    distance: data.distance,
                    deviceId: data.deviceId,
                    battery: data.battery,
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.error('❌ MQTT Parse Error:', e);
            }
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket: Client Connected [${socket.id}]`);
        socket.on('send_message', (payload) => {
            io.emit('new_message', { ...payload, timestamp: new Date().toISOString() });
        });
        socket.on('speech_to_text', (payload) => {
            io.emit('stt_broadcast', { ...payload, timestamp: new Date().toISOString() });
        });
    });

    server.use(express.json());

    // Express Open-Source FAISS Vector RAG AI Chatbot API Route
    server.post('/api/chat', async (req, res) => {
        const { message, lang } = req.body || {};
        const rawMsg = message || '';
        const userLang = (lang === 'en' ? 'en' : 'el');

        const { queryFaissRagVectorDb } = require('./lib/ragEngine');
        const ragResult = await queryFaissRagVectorDb(rawMsg, userLang);

        return res.json({
            reply: ragResult.reply,
            sourceDoc: ragResult.sourceDoc,
            ragasScore: ragResult.ragasScore,
            confidence: ragResult.vectorConfidence,
            modelName: ragResult.modelName,
            timestamp: new Date().toISOString(),
            engine: ragResult.modelName
        });
    });

    server.use((req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, () => {
        console.log(`🚀 Unified DeafNav Hub live at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('❌ Server Initialization Failed:', err);
    process.exit(1);
});
