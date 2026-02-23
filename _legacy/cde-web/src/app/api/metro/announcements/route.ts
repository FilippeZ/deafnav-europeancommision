import { NextResponse } from "next/server";

export async function GET() {
    // Simulated station announcements with sign language video metadata
    const announcements = [
        {
            id: "ann-001",
            timestamp: new Date().toISOString(),
            content: "Attention: 5-minute delay on Line 3 due to technical check.",
            type: "alert",
            signLanguageVideoId: "sl-001",
            station: "Syntagma"
        },
        {
            id: "ann-002",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            content: "Next train in 2 minutes for Line 2 direction Elliniko.",
            type: "info",
            signLanguageVideoId: "sl-002",
            station: "Syntagma"
        }
    ];

    return NextResponse.json(announcements);
}
