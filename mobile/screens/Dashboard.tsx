import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { VibrationSimulator } from '../components/VibrationSimulator';
import EUCompliance from './EUCompliance';

const socket = io('http://your-backend-url:4000');

export default function Dashboard() {
    const [showEUInfo, setShowEUInfo] = useState(false);
    const [heartRate, setHeartRate] = useState(72);
    const [distance, setDistance] = useState(300);
    const [transcripts, setTranscripts] = useState([
        { id: '1', text: 'Attention: Next train on Line 2 in 3 minutes.', time: '11:05' }
    ]);
    const [stationInfo, setStationInfo] = useState<any>(null);
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Pulse Animation logic
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true })
            ])
        ).start();

        // Listen for real-time telemetry
        socket.on('telemetry_update', (data) => {
            if (data.pulse) setHeartRate(data.pulse);
            if (data.distance) setDistance(data.distance);
        });

        socket.on('transit_update', (data) => {
            if (data.announcements) {
                // Map the new payload (content -> text)
                const formatted = data.announcements.map((a: any) => ({
                    id: a.id,
                    text: a.content,
                    time: a.timestamp,
                    type: a.type,
                    provider: a.provider
                }));
                setTranscripts(prev => [...formatted, ...prev].slice(0, 10));
            }
        });

        socket.on('arrival_update', (data) => {
            setStationInfo(data);
        });

        return () => {
            socket.off('telemetry_update');
            socket.off('transit_update');
            socket.off('arrival_update');
        };
    }, []);

    if (showEUInfo) {
        return <EUCompliance onBack={() => setShowEUInfo(false)} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.header}>DeafNav Hub</Text>
                <TouchableOpacity
                    onPress={() => setShowEUInfo(true)}
                    style={styles.euBadge}
                >
                    <Text style={styles.euBadgeText}>🇪🇺 EU Vision</Text>
                </TouchableOpacity>
            </View>

            {/* 1. Real-time Station Status */}
            {stationInfo && (
                <View style={[styles.stationCard, stationInfo.accessibility === 'warning' && styles.alertCard]}>
                    <View style={styles.stationRow}>
                        <Text style={styles.stationName}>{stationInfo.station}</Text>
                        <Text style={styles.etaText}>{stationInfo.etaMinutes} MIN</Text>
                    </View>
                    <Text style={styles.lineSubtext}>{stationInfo.line} • {stationInfo.direction}</Text>
                    {stationInfo.accessibility === 'warning' && (
                        <View style={styles.accessibilityWarning}>
                            <Text style={styles.warningText}>⚠️ ELEVATOR FAILURE REPORTED</Text>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.biometricCard}>
                <VibrationSimulator distance={distance} />
                <View style={{ height: 20 }} />
                <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
                    <Text style={styles.heartText}>❤️</Text>
                </Animated.View>
                <Text style={styles.biometricValue}>{heartRate} BPM</Text>
                <Text style={styles.biometricLabel}>Live Biometrics</Text>
            </View>

            {/* 2. Real-time Transcript Feed */}
            <View style={styles.feedContainer}>
                <Text style={styles.subHeader}>Station Announcements</Text>
                <ScrollView style={styles.feed}>
                    {transcripts.map(t => (
                        <View key={t.id} style={[styles.transcriptItem, (t as any).type === 'alert' && styles.alertItem]}>
                            <View style={styles.transcriptMeta}>
                                <Text style={styles.transcriptTime}>{t.time}</Text>
                                {(t as any).provider && <Text style={styles.providerTag}>{(t as any).provider}</Text>}
                            </View>
                            <Text style={[styles.transcriptText, (t as any).type === 'alert' && styles.alertText]}>{t.text}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 28, fontWeight: '900', color: '#1a73e8' },
    euBadge: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    euBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    biometricCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 30,
        alignItems: 'center', elevation: 5, marginBottom: 20
    },
    pulseCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffefef', justifyContent: 'center', alignItems: 'center' },
    heartText: { fontSize: 30 },
    biometricValue: { fontSize: 40, fontWeight: 'bold', marginTop: 10 },
    biometricLabel: { color: '#666', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
    stationCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20,
        borderLeftWidth: 8, borderLeftColor: '#1a73e8', elevation: 3
    },
    alertCard: { borderLeftColor: '#d93025' },
    stationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    stationName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    etaText: { fontSize: 18, fontWeight: '900', color: '#1a73e8' },
    lineSubtext: { fontSize: 13, color: '#888', marginTop: 4 },
    accessibilityWarning: { marginTop: 12, padding: 8, backgroundColor: '#fff4f4', borderRadius: 8 },
    warningText: { color: '#d93025', fontSize: 11, fontWeight: 'bold' },
    feedContainer: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20 },
    subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    feed: { flex: 1 },
    transcriptItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    transcriptMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    transcriptTime: { fontSize: 10, color: '#aaa' },
    providerTag: { fontSize: 9, fontWeight: 'bold', color: '#fff', backgroundColor: '#003399', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
    transcriptText: { fontSize: 16, color: '#333', marginTop: 4 },
    alertItem: { backgroundColor: '#fff4f4', borderLeftWidth: 4, borderLeftColor: '#d93025', paddingHorizontal: 10 },
    alertText: { color: '#d93025', fontWeight: 'bold' }
});
