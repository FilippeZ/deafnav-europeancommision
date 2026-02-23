import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
// Assuming we are using react-native-maps
import MapView, { Marker, Polyline } from 'react-native-maps';
import AccessibilityService from '../../services/AccessibilityService';

interface ElevatorData {
    name: string;
    isWorking: number;
}

interface StationVisibility {
    stationName: string;
    latitude: number;
    longitude: number;
    accessibilityType: number;
    accessibilityDescr: string;
    elevators: ElevatorData[];
}

export default function AccessibleMap() {
    const [stations, setStations] = useState<StationVisibility[]>([]);

    useEffect(() => {
        // In a real app, this would fetch the static GTFS route points + live STASY elevator statuses
        // For demonstration, we simulate fetching the aggregated map state.
        fetchAccessibleRoutes();

        // Listen for real-time breakdowns to update the map locally
        AccessibilityService.onAlert((alert) => {
            if (alert.title === 'Elevator Out of Order') {
                fetchAccessibleRoutes(); // Re-fetch or locally mutate state
            }
        });
    }, []);

    const fetchAccessibleRoutes = async () => {
        // Fetch from the Node.js TransitApiAggregator route (e.g., /api/accessible-routes)
        // Simulated response based on STASY schema
        const mockData: StationVisibility[] = [
            {
                stationName: 'Κηφισιά',
                latitude: 38.0734,
                longitude: 23.8086,
                accessibilityType: 1, // Fully accessible
                accessibilityDescr: 'All elevators working',
                elevators: [{ name: 'To Platform', isWorking: 1 }]
            },
            {
                stationName: 'ΚΑΤ',
                latitude: 38.0667,
                longitude: 23.8035,
                accessibilityType: 2, // Partially accessible
                accessibilityDescr: 'One elevator broken',
                elevators: [{ name: 'To Platform', isWorking: 0 }]
            }
        ];
        setStations(mockData);
    };

    const getMarkerColor = (type: number) => {
        if (type === 1) return 'green'; // Fully Accessible
        if (type === 2) return 'orange'; // Partially Accessible / Warning
        if (type === 3) return 'red'; // Not Accessible
        return 'gray'; // Unknown
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 38.0734,
                    longitude: 23.8086,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {/* Visualizing Disabled Railway Concept - Rendering Paths and Stations based on accessibility */}
                {stations.map((station, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                        pinColor={getMarkerColor(station.accessibilityType)}
                        title={station.stationName}
                        description={station.accessibilityDescr}
                    />
                ))}
            </MapView>
            <View style={styles.legend}>
                <Text style={styles.legendText}>🟢 Fully Accessible</Text>
                <Text style={styles.legendText}>🟠 Partially Accessible</Text>
                <Text style={styles.legendText}>🔴 Not Accessible (Elevators Broken)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    legend: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        borderRadius: 8,
    },
    legendText: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 4,
    }
});
