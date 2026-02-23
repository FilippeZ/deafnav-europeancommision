import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MqttService from '../services/MqttService'; // Hypothetical service
import { LineChart } from 'react-native-chart-kit';

export default function Dashboard() {
    const [pulse, setPulse] = useState(75);
    const [transcripts, setTranscripts] = useState([
        { id: 1, text: "Welcome to Syntagma Station.", time: "10:00" },
        { id: 2, text: "Line 2 arriving in 2 minutes.", time: "10:05" }
    ]);

    useEffect(() => {
        // Logic to subscribe to MQTT from the app
        // MqttService.subscribe('deafnav/pulse', (val) => setPulse(val));
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* 1. Pulse Indicator */}
            <View style={styles.indicatorCard}>
                <Text style={styles.cardTitle}>VITAL STATUS</Text>
                <View style={styles.pulseContainer}>
                    <Text style={[styles.pulseValue, pulse > 100 && { color: '#E60000' }]}>{pulse} </Text>
                    <Text style={styles.unit}>BPM</Text>
                </View>
                <Text style={styles.statusText}>{pulse > 100 ? "⚠️ HIGH STRESS DETECTED" : "✅ NORMAL"}</Text>
            </View>

            {/* 2. Real-time Transcript Feed */}
            <View style={styles.transcriptCard}>
                <Text style={styles.cardTitle}>LIVE STATION ANNOUNCEMENTS</Text>
                <View style={styles.feed}>
                    {transcripts.map(t => (
                        <View key={t.id} style={styles.transcriptItem}>
                            <Text style={styles.timestamp}>{t.time}</Text>
                            <Text style={styles.transcriptText}>{t.text}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.pulseDot} />
                <Text style={styles.listeningText}>Listening for real-time announcements...</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    indicatorCard: {
        backgroundColor: '#003399',
        borderRadius: 25,
        padding: 30,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 5
    },
    cardTitle: { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: 10, letterSpacing: 2, marginBottom: 10 },
    pulseContainer: { flexDirection: 'row', alignItems: 'baseline' },
    pulseValue: { fontSize: 72, fontWeight: '900', color: '#FFCC00', fontStyle: 'italic' },
    unit: { fontSize: 20, color: '#FFCC00', fontWeight: 'bold' },
    statusText: { color: 'white', fontWeight: 'bold', marginTop: 10 },
    transcriptCard: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 25,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    feed: { marginVertical: 20 },
    transcriptItem: { flexDirection: 'row', marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#003399', paddingLeft: 15 },
    timestamp: { fontSize: 10, color: '#94a3b8', width: 40, marginTop: 3 },
    transcriptText: { fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 },
    pulseDot: { width: 8, height: 8, backgroundColor: '#003399', borderRadius: 4, alignSelf: 'center', marginVertical: 10 },
    listeningText: { textAlign: 'center', fontSize: 12, color: '#64748b', fontStyle: 'italic' }
});
