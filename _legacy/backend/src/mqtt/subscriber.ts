import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();
const MQTT_BROKER = process.env.MQTT_HOST ? `mqtt://${process.env.MQTT_HOST}` : 'mqtt://localhost';

export const initMQTT = (io: Server) => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
        console.log('✅ Connected to MQTT Broker');
        client.subscribe('deafnav/telemetry');
    });

    client.on('message', async (topic, message) => {
        if (topic === 'deafnav/telemetry') {
            try {
                const data = JSON.parse(message.toString());
                const { pulse, distance, deviceId } = data;

                console.log(`📡 Telemetry [${deviceId}]: HR=${pulse} BPM, Dist=${distance} cm`);

                // 1. Broadcast to Mobile App via Socket.io
                io.emit('telemetry_update', {
                    heartRate: pulse,
                    distance: distance,
                    deviceId
                });

                // 2. Persist heart rate if device exists
                await prisma.device.update({
                    where: { deviceId },
                    data: { lastPulse: pulse }
                }).catch(e => console.log(`[WARN] Heart rate persist failed for ${deviceId}`));

            } catch (err) {
                console.error('❌ Error parsing telemetry:', err);
            }
        }
    });
};

const triggerStressAlert = (deviceId: string, hr: number) => {
    // Integration with Firebase Cloud Messaging (FCM) or similar
    // For now, localized log
    console.log(`[ALERT] Device ${deviceId} stress level: ${hr} BPM`);
};
