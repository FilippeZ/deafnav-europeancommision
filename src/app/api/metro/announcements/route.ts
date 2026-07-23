import { NextResponse } from "next/server";

const customAnnouncements: any[] = [];

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "ann-01",
        timestamp: new Date().toISOString(),
        content: "OASA Live Telematics: Elevator A1 at Syntagma Station (Line 2 Red) fully operational & accessible.",
        type: "info",
        signLanguageVideoId: "sl-syntagma-acc",
        station: "Σύνταγμα"
    },
    {
        id: "ann-02",
        timestamp: new Date().toISOString(),
        content: "Bus Line 140 (Πολύγωνο - Γλυφάδα): Audio & Haptic Sync broadcasting to DeafNav smart wearables.",
        type: "info",
        signLanguageVideoId: "sl-bus-140",
        station: "Λεωφ. Αθηνών"
    },
    {
        id: "ann-03",
        timestamp: new Date().toISOString(),
        content: "Tram T6 Coast Line: Low-floor accessibility ramp lock confirmed at Pikrodafni hub.",
        type: "info",
        signLanguageVideoId: "sl-tram-t6",
        station: "Πικροδάφνη"
    },
    {
        id: "ann-04",
        timestamp: new Date().toISOString(),
        content: "Express Bus 040: Priority green light signal protocol active at Faliro Station.",
        type: "info",
        signLanguageVideoId: "sl-express-040",
        station: "Φάληρο"
    }
];

export async function GET() {
    const list = [...customAnnouncements, ...DEFAULT_ANNOUNCEMENTS];
    return NextResponse.json(list);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newAnnouncement = {
            id: body.id || `ann-${Date.now()}`,
            timestamp: new Date().toISOString(),
            content: body.content || "Notice",
            type: body.type || "info",
            signLanguageVideoId: body.signLanguageVideoId || "sl-general-info",
            station: body.station || "Live Network"
        };
        customAnnouncements.unshift(newAnnouncement);
        if (customAnnouncements.length > 20) customAnnouncements.pop();

        return NextResponse.json({ success: true, announcement: newAnnouncement });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
