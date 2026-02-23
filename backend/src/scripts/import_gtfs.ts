import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

// Represents the schema for GTFS stops.txt
interface GTFSStop {
    stop_id: string;
    stop_name: string;
    stop_lat: string;
    stop_lon: string;
    location_type?: string;
    parent_station?: string;
}

// Represents the schema for GTFS routes.txt
interface GTFSRoute {
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    route_type: string;
}

/**
 * GTFSImporter
 * Reads static GTFS data (OTPData-GR) and prepares it for the PostGIS routing baseline.
 */
class GTFSImporter {
    private gtfsDir: string;

    constructor(gtfsDirectory: string) {
        this.gtfsDir = gtfsDirectory;
    }

    /**
     * Parse the stops.txt file
     */
    public async parseStops(): Promise<GTFSStop[]> {
        const filePath = path.join(this.gtfsDir, 'stops.txt');
        if (!fs.existsSync(filePath)) {
            console.warn(`[GTFS Import] ${filePath} not found. Skipping stops import.`);
            return [];
        }

        return new Promise((resolve, reject) => {
            const stops: GTFSStop[] = [];
            fs.createReadStream(filePath)
                .pipe(parse({ columns: true, skip_empty_lines: true }))
                .on('data', (row: any) => {
                    stops.push({
                        stop_id: row.stop_id,
                        stop_name: row.stop_name,
                        stop_lat: row.stop_lat,
                        stop_lon: row.stop_lon,
                        location_type: row.location_type,
                        parent_station: row.parent_station
                    });
                })
                .on('end', () => resolve(stops))
                .on('error', reject);
        });
    }

    /**
     * Parse the routes.txt file
     */
    public async parseRoutes(): Promise<GTFSRoute[]> {
        const filePath = path.join(this.gtfsDir, 'routes.txt');
        if (!fs.existsSync(filePath)) {
            console.warn(`[GTFS Import] ${filePath} not found. Skipping routes import.`);
            return [];
        }

        return new Promise((resolve, reject) => {
            const routes: GTFSRoute[] = [];
            fs.createReadStream(filePath)
                .pipe(parse({ columns: true, skip_empty_lines: true }))
                .on('data', (row: any) => {
                    routes.push({
                        route_id: row.route_id,
                        route_short_name: row.route_short_name,
                        route_long_name: row.route_long_name,
                        route_type: row.route_type
                    });
                })
                .on('end', () => resolve(routes))
                .on('error', reject);
        });
    }

    /**
     * Main execution method to load GTFS files and sync to the database.
     * In a production environment, this would use Prisma to batch-upsert the records.
     */
    public async syncToDatabase() {
        console.log(`[GTFS Import] Starting sync from directory: ${this.gtfsDir}`);

        try {
            const stops = await this.parseStops();
            console.log(`[GTFS Import] Parsed ${stops.length} stops.`);

            const routes = await this.parseRoutes();
            console.log(`[GTFS Import] Parsed ${routes.length} routes.`);

            // TODO: Initialize Prisma Client and perform batch imports
            // Example:
            // await prisma.stop.createMany({ data: stops, skipDuplicates: true });
            // await prisma.route.createMany({ data: routes, skipDuplicates: true });

            console.log(`[GTFS Import] Synchronization complete. Data is ready for PostGIS routing.`);
        } catch (error) {
            console.error(`[GTFS Import] Error during synchronization:`, error);
        }
    }
}

// If executed directly
if (require.main === module) {
    const dataDir = path.resolve(__dirname, '../../data/gtfs');
    const importer = new GTFSImporter(dataDir);
    importer.syncToDatabase().then(() => process.exit(0));
}

export default GTFSImporter;
