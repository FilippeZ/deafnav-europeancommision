import { NextResponse } from "next/server";

// --- Authentic Athens Transit Line Definitions & Distinct Telemetry Profiles ---

interface LineProfile {
    name: string;
    route: string;
    type: "Bus" | "Express" | "Trolley" | "Tram";
    stops: string[];
    defaultActive: number;
    baseSpeedRange: [number, number]; // [min, max] km/h
    latOrigin: number;
    lngOrigin: number;
    latencyMs: number;
}

const ATHENS_LINES: Record<string, LineProfile> = {
    "140": {
        name: "Λεωφορείο 140",
        route: "Πολύγωνο → Γλυφάδα (OASA)",
        type: "Bus",
        stops: ["Πολύγωνο Depot", "Λεωφ. Αθηνών", "Σύνταγμα", "Γλυφάδα HQ"],
        defaultActive: 5,
        baseSpeedRange: [42, 54],
        latOrigin: 37.9838,
        lngOrigin: 23.7275,
        latencyMs: 12
    },
    "040": {
        name: "Λεωφορείο 040",
        route: "Σύνταγμα → Λαύριο (Express)",
        type: "Express",
        stops: ["Σύνταγμα Central", "Φάληρο", "Βάρη", "Κερατέα", "Λαύριο Express Terminal"],
        defaultActive: 7,
        baseSpeedRange: [58, 72],
        latOrigin: 37.9755,
        lngOrigin: 23.7348,
        latencyMs: 8
    },
    "608": {
        name: "Τρόλεϊ 608",
        route: "Ζωγράφου → Θησείο (Trolley)",
        type: "Trolley",
        stops: ["Ζωγράφου Depot", "Καισαριανή", "Παγκράτι", "Σύνταγμα", "Θησείο Metro"],
        defaultActive: 4,
        baseSpeedRange: [28, 38],
        latOrigin: 37.9712,
        lngOrigin: 23.7580,
        latencyMs: 15
    },
    "T6": {
        name: "Τραμ T6",
        route: "Σύνταγμα → Πικροδάφνη (Tram Coast Line)",
        type: "Tram",
        stops: ["Σύνταγμα Tram Hub", "Λεωφ. Συγγρού", "Νέος Κόσμος", "Φάληρο Coast", "Πικροδάφνη"],
        defaultActive: 6,
        baseSpeedRange: [32, 42],
        latOrigin: 37.9740,
        lngOrigin: 23.7310,
        latencyMs: 10
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get("lineId") || "140";

    const lineInfo = ATHENS_LINES[lineId] || ATHENS_LINES["140"];

    // Compute distinct, line-dependent deterministic telemetry
    const lineCharSum = lineId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const tick = Math.floor(Date.now() / 10000); // Changes smoothly every 10 seconds

    const [minSpeed, maxSpeed] = lineInfo.baseSpeedRange;
    const speedSpread = maxSpeed - minSpeed;
    const lineSpeedOffset = (lineCharSum * 7) % speedSpread;
    const timeVar = (tick % 5);
    const simulatedSpeed = minSpeed + ((lineSpeedOffset + timeVar) % speedSpread);

    const simulatedProgress = ((tick * 9 + lineCharSum * 13) % 95) + 5; // 5% - 99%
    const activeCount = lineInfo.defaultActive;

    const vehicles = Array.from({ length: activeCount }, (_, i) => {
        const latOffset = (i * 0.008) + ((tick % 10) * 0.0003);
        const lngOffset = (i * 0.006) - ((tick % 10) * 0.0002);
        return {
            VehicleNo: `ATH-${lineId}-${i + 1}`,
            CS_LAT: (lineInfo.latOrigin + latOffset).toFixed(6),
            CS_LNG: (lineInfo.lngOrigin + lngOffset).toFixed(6),
            ROUTE_CODE: `${lineId}-${lineInfo.type.toUpperCase()}`,
            speed: simulatedSpeed + (i * 2) - 1
        };
    });

    return NextResponse.json({
        line: lineId,
        lineName: lineInfo.name,
        route: lineInfo.route,
        type: lineInfo.type,
        stops: lineInfo.stops,
        activeCount,
        simulatedSpeed,
        simulatedProgress,
        latOrigin: lineInfo.latOrigin.toFixed(4) + "° N",
        lngOrigin: lineInfo.lngOrigin.toFixed(4) + "° E",
        latencyMs: lineInfo.latencyMs,
        vehicles,
        timestamp: new Date().toISOString()
    });
}
