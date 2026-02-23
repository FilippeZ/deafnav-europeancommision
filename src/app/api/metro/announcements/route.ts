import { NextResponse } from "next/server";
import { TransitApiAggregator } from "../../../../../backend/src/services/transit_api";

// Initialize the backend pipeline aggregator
const transitApi = new TransitApiAggregator();

// Start background polling to build cache immediately
transitApi.startPolling(30000);

export async function GET() {
    // Map OASA/STASY data to our frontend format
    // Since we track Line 3 / Line 2 mostly, we fetch from aggregator cache
    const cache = transitApi.getAccessibleRoutesMap();
    const elevatorsLine2 = cache['2']?.data || [];
    const elevatorsLine3 = cache['3']?.data || [];

    // Let's create an array of broken elevators as live announcements
    const realAnnouncements: any[] = [];

    const processElevators = (stationsData: any[], lineName: string) => {
        if (!Array.isArray(stationsData)) return;
        stationsData.forEach(station => {
            if (station.accessibilityType === 2 || station.accessibilityType === 3) {
                station.elevators.forEach((elevator: any) => {
                    if (elevator.isWorking === 0) {
                        realAnnouncements.push({
                            id: `alert-${station.station_name}-${elevator.name}-${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            content: `ATTIKO METRO ALERT (Line ${lineName}): Elevator "${elevator.name}" at station ${station.station_name} is out of service.`,
                            type: "alert",
                            signLanguageVideoId: "sl-elev-broken",
                            station: station.station_name
                        });
                    }
                });
            }
        });
    };

    processElevators(elevatorsLine2, "2 (Red)");
    processElevators(elevatorsLine3, "3 (Blue)");

    // If no elevators are broken, return a standard operational info message
    if (realAnnouncements.length === 0) {
        realAnnouncements.push({
            id: `info-${Date.now()}`,
            timestamp: new Date().toISOString(),
            content: "OASA Live Telemetry: All accessible infrastructure on Line 2 & 3 is currently fully operational.",
            type: "info",
            signLanguageVideoId: "sl-all-clear",
            station: "System Wide"
        });
    }

    return NextResponse.json(realAnnouncements);
}
