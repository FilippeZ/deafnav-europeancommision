import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        let body: any = {};
        const rawText = await request.text();
        if (rawText) {
            try {
                body = JSON.parse(rawText);
            } catch (_) {
                body = { text: rawText };
            }
        }

        const text = body.text || body.transcript || "";
        const lang = body.lang || "el-GR";

        if (!text || typeof text !== "string" || !text.trim()) {
            return NextResponse.json({ error: "No transcript text provided" }, { status: 400 });
        }

        const lowerText = text.toLowerCase();

        let type = "info";
        let signLanguageVideoId = "sl-general-info";
        let station = "Live Microphone";

        if (lowerText.includes("βοήθεια") || lowerText.includes("help") || lowerText.includes("sos") || lowerText.includes("έκτακτη")) {
            type = "alert";
            signLanguageVideoId = "sl-sos-emergency";
            station = "Emergency Alert";
        } else if (lowerText.includes("ασανσέρ") || lowerText.includes("elevator") || lowerText.includes("βλάβη") || lowerText.includes("broken")) {
            type = "alert";
            signLanguageVideoId = "sl-elev-broken";
            station = "Accessibility Alert";
        } else if (lowerText.includes("σύνταγμα") || lowerText.includes("syntagma")) {
            station = "Σύνταγμα";
            signLanguageVideoId = "sl-syntagma";
        } else if (lowerText.includes("ομόνοια") || lowerText.includes("omonia")) {
            station = "Ομόνοια";
            signLanguageVideoId = "sl-omonia";
        } else if (lowerText.includes("λεωφορείο") || lowerText.includes("bus")) {
            signLanguageVideoId = "sl-bus-arrival";
            station = "OASA Bus Stop";
        }

        const announcement = {
            id: `stt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            content: `🎤 Speech-to-Text (${lang}): "${text}"`,
            rawText: text,
            type,
            signLanguageVideoId,
            station,
            confidence: 0.98,
            provider: "DeafNav STT Engine"
        };

        return NextResponse.json({
            success: true,
            announcement,
            matchedKeywords: { type, station, signLanguageVideoId }
        });
    } catch (error: any) {
        return NextResponse.json({ error: "STT processing error", details: error?.message || String(error) }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: "STT API Engine Active",
        supportedLanguages: ["el-GR", "en-US"],
        features: ["Web Speech API Integration", "Keyword Detection", "Sign Language Mapping", "Socket.io Live Feed Sync"]
    });
}
