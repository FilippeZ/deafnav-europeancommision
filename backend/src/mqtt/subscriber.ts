import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

const STRESS_THRESHOLD = 120; // Example BPM threshold for high stress

client.on('connect', () => {
    console.log('Backend connected to MQTT Broker');
    client.subscribe('deafnav/pulse', (err) => {
        if (!err) {
            console.log('Subscribed to deafnav/pulse');
        }
    });
});

client.on('message', async (topic, message) => {
    if (topic === 'deafnav/pulse') {
        const pulseValue = parseInt(message.toString());
        console.log(`Received pulse data: ${pulseValue}`);

        // 1. Store in Database
        try {
            await prisma.pulseLog.create({
                data: {
                    device: {
                        connect: { id: "default_device_id" }
                    },
                    value: pulseValue
                }
            });
        } catch (err) {
            console.error('Error saving pulse log:', err);
        }

        // 2. Stress Level Logic & Notification
        if (pulseValue > STRESS_THRESHOLD) {
            console.log('⚠️ HIGH STRESS DETECTED! Sending notification...');
            // Logic for push notification (e.g., Firebase Cloud Messaging)
            // sendNotification(userId, "High stress detected. Please check your surroundings.");
        }
    }
});

export default client;
