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

    // --- Transit Integration (OASA Telematics & STASY Elevators) ---
    // @ts-ignore
    const { APIRequests } = require('oasa-telematics-api');
    const oasa = new APIRequests();

    const fetchTransitData = async () => {
        try {
            // 1. Fetch Elevator Status (STASY)
            const elevatorRes = await fetch('https://stasy-elevators.georgetomzaridis.eu/api/status');
            const elevatorData = await elevatorRes.json();

            const stasyAlerts = (Array.isArray(elevatorData) ? elevatorData : [])
                .filter((s: any) => s.accessibilityType >= 2)
                .map((s: any) => ({
                    id: `elevator-${s.station_name}-${Date.now()}`,
                    content: `⚠️ Elevator Alert: ${s.station_name} - ${s.accessibilityDescr}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'alert',
                    station: s.station_name,
                    provider: 'STASY'
                }));

            // 2. Fetch Bus Arrivals (OASA Telematics)
            // For demo: Fetching arrivals for Syntagma Area Stop (Stop Code: 060155)
            let oasaArrivals: any[] = [];
            try {
                const arrivals = await oasa.getStopArrivals('060155');
                oasaArrivals = (arrivals || []).map((a: any) => ({
                    id: `bus-${a.route_code}-${a.arrival_time}`,
                    content: `🚌 Bus ${a.route_id}: ${a.route_descr} arriving in ${a.arrival_time}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'info',
                    station: 'Σύνταγμα (Bus)',
                    provider: 'OASA'
                }));
            } catch (e) {
                console.error('❌ OASA Telematics Error:', e);
            }

            const announcements = [...stasyAlerts, ...oasaArrivals];
            console.log(`📡 Transit Feed: Found ${stasyAlerts.length} Metro alerts and ${oasaArrivals.length} Bus arrivals.`);

            // 3. Emit Combined Transit Intelligence
            if (announcements.length > 0) {
                io.emit('transit_update', {
                    announcements,
                    timestamp: new Date().toISOString()
                });
            }

            // 4. Detailed Dashboard Update (Syntagma Focus)
            io.emit('arrival_update', {
                station: "Σύνταγμα",
                arrivalTime: "05:42",
                line: "Γραμμή 2 (Κόκκινη)",
                direction: "Ελληνικό",
                nextStation: "Πανεπιστήμιο",
                etaMinutes: 2,
                distance: 0.8,
                accessibility: stasyAlerts.some(a => a.station === 'Σύνταγμα') ? 'warning' : 'clear'
            });

        } catch (error) {
            console.error('❌ Transit Data Fetch Error:', error);
        }
    };

    // Poll transit data every 2 minutes
    setInterval(fetchTransitData, 120000);
    fetchTransitData(); // Initial fetch

    mqttClient.on('message', async (topic, message) => {
        if (topic === 'deafnav/telemetry') {
            try {
                const data = JSON.parse(message.toString());
                console.log(`📡 Relay: Telemetry Received - HR:${data.pulse}, Dist:${data.distance}`);

                // 1. Save to Database
                try {
                    await prisma.pulseLog.create({
                        data: {
                            deviceId: data.deviceId || "default_device",
                            value: data.pulse,
                            // Note: Distance can also be saved if schema supports it, 
                            // but schema.prisma currently only has 'value' (pulse) for PulseLog.
                        }
                    });
                } catch (dbErr) {
                    console.error('❌ DB Error:', dbErr);
                }

                // 2. Emit to Frontend
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
    });

    // 4. Next.js Catch-all Handler
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
