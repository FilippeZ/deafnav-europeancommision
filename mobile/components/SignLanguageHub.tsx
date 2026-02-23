import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-av'; // Use Expo AV for video

const ALERTS = [
    { id: 'gap', label: 'ΠΡΟΣΟΧΗ ΚΕΝΟ', video: '/videos/gap.mp4', icon: 'warning' },
    { id: 'next', label: 'ΕΠΟΜΕΝΟΣ ΣΤΑΘΜΟΣ', video: '/videos/next_station.mp4', icon: 'train' },
    { id: 'exit', label: 'ΕΞΟΔΟΣ', video: '/videos/exit.mp4', icon: 'logout' }
];

export default function SignLanguageHub() {
    const [activeAlert, setActiveAlert] = useState(ALERTS[0]);

    return (
        <View style={styles.container}>
            <View style={styles.videoCard}>
                <Video
                    source={{ uri: activeAlert.video }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.video}
                />
                <View style={styles.overlay}>
                    <View style={styles.alertBadge}>
                        <Text style={styles.badgeText}>GSL INTERPRETATION</Text>
                    </View>
                    <Text style={styles.alertLabel}>{activeAlert.label}</Text>
                </View>
            </View>

            <View style={styles.selector}>
                <Text style={styles.selectorTitle}>CHANNELS</Text>
                <View style={styles.buttonGrid}>
                    {ALERTS.map(alert => (
                        <TouchableOpacity
                            key={alert.id}
                            onPress={() => setActiveAlert(alert)}
                            style={[styles.btn, activeAlert.id === alert.id && styles.activeBtn]}
                        >
                            <Text style={[styles.btnText, activeAlert.id === alert.id && styles.activeBtnText]}>{alert.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    videoCard: {
        height: 300,
        backgroundColor: 'black',
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 10,
        marginBottom: 30
    },
    video: { width: '100%', height: '100%' },
    overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, backgroundColor: 'rgba(0,0,0,0.5)' },
    alertBadge: { backgroundColor: '#FFCC00', paddingHorizontal: 10, py: 4, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 10 },
    badgeText: { fontSize: 8, fontWeight: '900', color: '#003399' },
    alertLabel: { fontSize: 24, fontWeight: '900', color: 'white', fontStyle: 'italic' },
    selector: { backgroundColor: 'white', padding: 25, borderRadius: 30 },
    selectorTitle: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 2, marginBottom: 15 },
    buttonGrid: { gap: 10 },
    btn: { padding: 15, borderRadius: 15, backgroundColor: '#f1f5f9' },
    activeBtn: { backgroundColor: '#003399' },
    btnText: { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
    activeBtnText: { color: 'white' }
});
