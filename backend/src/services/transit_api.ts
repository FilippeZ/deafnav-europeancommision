import { APIRequests, APIHelpers } from 'oasa-telematics-api';
import fetch from 'node-fetch'; // assuming node-fetch is installed
import { EventEmitter } from 'events';

// Configuration
const STASY_API_BASE = 'https://stasy-elevators.georgetomzaridis.eu/api/status';
const OASA_LINES_OF_INTEREST = ['140', '040', '608']; // Example lines to track
const ELEVATOR_LINES = ['1', '2', '3']; // Lines 1 (Green), 2 (Red), 3 (Blue)
const CACHE_TTL_MS = 60 * 1000; // 1 minute caching

export interface ElevatorAlert {
    type: 'ELEVATOR_ALERT';
    lineID: string;
    stationName: string;
    elevatorName: string;
    isWorking: boolean;
    accessibilityDescr: string;
    timestamp: string;
}

export interface TransitDelayAlert {
    type: 'TRANSIT_DELAY';
    lineCode: string;
    stopCode: string;
    estimatedArrivalTime: string; // MM:SS
    timestamp: string;
}

/**
 * TransitApiAggregator - Fetches and aggregates real-time data from OASA and STASY.
 * Serves as the robust backend pipeline preparing data for the mobile client.
 */
export class TransitApiAggregator extends EventEmitter {
    private oasaApi: APIRequests;
    private oasaHelpers: APIHelpers;

    // Simple in-memory cache
    private cache: {
        elevators: Record<string, { data: any, timestamp: number }>;
        vehicles: Record<string, { data: any, timestamp: number }>;
    } = { elevators: {}, vehicles: {} };

    constructor() {
        super();
        this.oasaApi = new APIRequests();
        this.oasaHelpers = new APIHelpers();
    }

    /**
     * Start continuous polling for critical accessibility data.
     */
    public startPolling(intervalMs: number = 60000) {
        setInterval(async () => {
            try {
                // Poll Elevators
                for (const line of ELEVATOR_LINES) {
                    await this.fetchElevatorsStatus(line);
                }

                // Poll important transit lines
                for (const line of OASA_LINES_OF_INTEREST) {
                    await this.checkOasaDelays(line);
                }
            } catch (err) {
                console.error('[TransitAPI] Polling Error:', err);
            }
        }, intervalMs);
    }

    /**
     * Hit STASY Unofficial API and cache/process elevators
     */
    public async fetchElevatorsStatus(lineID: string): Promise<any> {
        const now = Date.now();
        if (this.cache.elevators[lineID] && (now - this.cache.elevators[lineID].timestamp < CACHE_TTL_MS)) {
            return this.cache.elevators[lineID].data;
        }

        try {
            const response = await fetch(`${STASY_API_BASE}/${lineID}`);
            if (!response.ok) throw new Error(`STASY API Error: ${response.status}`);

            const data: any = await response.json();
            this.cache.elevators[lineID] = { data, timestamp: now };

            // Check for broken elevators and emit alerts
            this.processElevatorData(data);

            return data;
        } catch (error) {
            console.error(`Failed to fetch elevators for Line ${lineID}`, error);
            return null;
        }
    }

    /**
     * Find broken elevators and emit notification events to the frontend via WebSockets/EventEmitter
     */
    private processElevatorData(stationsData: any[]) {
        if (!Array.isArray(stationsData)) return;

        stationsData.forEach(station => {
            if (station.accessibilityType === 2 || station.accessibilityType === 3) {
                // Not fully accessible - find broken elevators
                station.elevators.forEach((elevator: any) => {
                    if (elevator.isWorking === 0) {
                        const alert: ElevatorAlert = {
                            type: 'ELEVATOR_ALERT',
                            lineID: station.lineID,
                            stationName: station.station_name,
                            elevatorName: elevator.name,
                            isWorking: false,
                            accessibilityDescr: station.accessibilityDescr,
                            timestamp: new Date().toISOString()
                        };
                        this.emit('ELEVATOR_ALERT', alert);
                    }
                });
            }
        });
    }

    /**
     * Uses OASA Telematics API Wrapper to fetch live vehicle positions and arrivals
     */
    public async checkOasaDelays(lineName: string) {
        try {
            const line = await this.oasaHelpers.findLine(lineName);
            if (!line) return;

            // A line has multiple routes (directions). Let's take the first.
            const routes = await this.oasaApi.webGetRoutes(line.LineCode);
            if (!routes || routes.length === 0) return;
            const route = routes[0];

            const vehicles = await this.oasaApi.getBusLocation(route.RouteCode);
            this.cache.vehicles[route.RouteCode] = { data: vehicles ?? [], timestamp: Date.now() };

            // For demonstration, simulating an alert based on fetched data
            if (vehicles && vehicles.length > 0) {
                const sampleVehicle = vehicles[0];
                const alert: TransitDelayAlert = {
                    type: 'TRANSIT_DELAY',
                    lineCode: line.LineCode,
                    stopCode: 'N/A', // Normally we cross-reference this with a requested stop
                    estimatedArrivalTime: 'Delayed',
                    timestamp: new Date().toISOString()
                };
                // Example logic to trigger emission
                this.emit('TRANSIT_DELAY', alert);
            }
        } catch (err) {
            console.error(`Failed to fetch delays for line ${lineName}`, err);
        }
    }

    /**
     * Expose cached route/elevator mappings directly for the accessible mapping UI layer
     */
    public getAccessibleRoutesMap() {
        return this.cache.elevators;
    }
}
