import { NextResponse } from "next/server";

export async function GET() {
    // Simulated arrival data for Syntagma Station
    const arrivals = [
        {
            line: "Line 2 (Red)",
            direction: "Elliniko",
            eta: "05:42",
            status: "On Time",
            platform: "A"
        },
        {
            line: "Line 3 (Blue)",
            direction: "Airport",
            eta: "08:15",
            status: "Delayed (2m)",
            platform: "B"
        }
    ];

    return NextResponse.json(arrivals);
}
