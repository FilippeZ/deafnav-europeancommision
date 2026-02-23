import { NextResponse } from "next/server";

export async function GET() {
    // Simulated IoT data from Arduino/Raspberry Pi sensors
    const status = {
        connected: true,
        battery: 85,
        pulse: 72 + Math.floor(Math.random() * 5),
        stressLevel: "Normal",
        vibrationMode: "Moderate",
        lastSync: new Date().toISOString()
    };

    return NextResponse.json(status);
}
