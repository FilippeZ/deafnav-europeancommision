import { NextResponse } from "next/server";

let lastPulse = 72;
let lastBattery = 85;
let direction = 1;
let currentVibrationMode = "Standard Guidance";
let currentIntensity = 75;

export async function GET() {
    lastPulse += direction * (Math.random() > 0.5 ? 1 : 0);
    if (lastPulse >= 88) direction = -1;
    if (lastPulse <= 62) direction = 1;

    lastBattery = Math.max(10, lastBattery - (Math.random() > 0.95 ? 1 : 0));
    const stressLevel = lastPulse > 82 ? "Elevated" : lastPulse < 65 ? "Low" : "Normal";

    return NextResponse.json({
        connected: true,
        battery: lastBattery,
        pulse: lastPulse,
        stressLevel,
        vibrationMode: currentVibrationMode,
        vibrationIntensity: currentIntensity,
        distance: parseFloat((Math.random() * 0.5 + 0.3).toFixed(1)),
        deviceId: "DEAFNAV-ESP32-001",
        lastSync: new Date().toISOString()
    });
}

export async function POST(request: Request) {
    try {
        let body: any = {};
        const rawText = await request.text();
        if (rawText) {
            try {
                body = JSON.parse(rawText);
            } catch (_) {}
        }

        if (body.vibrationMode) currentVibrationMode = body.vibrationMode;
        if (body.intensity !== undefined) currentIntensity = body.intensity;
        if (body.pulse) lastPulse = body.pulse;

        return NextResponse.json({
            success: true,
            updated: {
                vibrationMode: currentVibrationMode,
                vibrationIntensity: currentIntensity,
                pulse: lastPulse
            }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || String(e) }, { status: 400 });
    }
}
