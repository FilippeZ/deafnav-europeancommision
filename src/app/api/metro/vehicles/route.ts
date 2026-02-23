import { NextResponse } from "next/server";
import { TransitApiAggregator } from "../../../../../backend/src/services/transit_api";

// Initialize the backend pipeline aggregator
// Note: In a real production environment this should be a singleton accessed across routes
const transitApi = new TransitApiAggregator();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId') || '140';

    // Trigger an active fetch for this line to populate cache
    await transitApi.checkOasaDelays(lineId);

    // Retrieve the routes and vehicles from the cache (which is private in the aggregator, so we fetch it again gracefully if needed, or modify aggregator)
    // The current Aggregator architecture emits events, but for a REST API we just need a snapshot.
    try {
        // Here we just re-execute the internal check to get raw data for the API response.
        const oasaApi = (transitApi as any).oasaApi;
        const oasaHelpers = (transitApi as any).oasaHelpers;

        const line = await oasaHelpers.findLine(lineId);
        if (!line) return NextResponse.json({ error: "Line not found" }, { status: 404 });

        const routes = await oasaApi.webGetRoutes(line.LineCode);
        if (!routes || routes.length === 0) return NextResponse.json({ error: "Routes not found" }, { status: 404 });

        const route = routes[0];
        const vehicles = await oasaApi.getBusLocation(route.RouteCode);

        // Map live vehicle data to our UI components expectations (speed, eta, progress)
        let speed = 0;
        let progress = 0;

        if (vehicles && vehicles.length > 0) {
            // Very rudimentary mock math on actual coordinates to simulate speed/progress
            // as OASA doesn't always provide instantaneous speed directly.
            speed = Math.floor(Math.random() * 20) + 40; // Simulated km/h based on presence
            progress = (vehicles.length * 10) % 100; // Mock progress based on vehicle density
        }

        return NextResponse.json({
            line: lineId,
            activeCount: vehicles?.length || 0,
            vehicles: vehicles || [],
            simulatedSpeed: speed,
            simulatedProgress: progress
        });

    } catch (e: any) {
        return NextResponse.json({ error: "OASA Fetch failed", details: e.message }, { status: 500 });
    }
}
