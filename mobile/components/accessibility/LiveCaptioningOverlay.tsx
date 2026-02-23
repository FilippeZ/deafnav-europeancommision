import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AccessibilityService from '../../services/AccessibilityService';

/**
 * LiveCaptioningOverlay
 * Inspired by "What They Say", this translates intercepted PA audio (via the backend WebRTC or native audio stream)
 * into high-contrast closed captions for Deaf users.
 */
export default function LiveCaptioningOverlay() {
    const [captions, setCaptions] = useState<string[]>([]);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        // Listen to Live Captioning updates dispatched by the Accessibility Service
        AccessibilityService.onAlert((alert) => {
            if (alert.title === 'Live PA Announcement') {
                setCaptions(prev => [...prev.slice(-2), alert.message]); // Keep last 3 captions

                // Flash the background slightly to catch attention visually
                Animated.sequence([
                    Animated.timing(fadeAnim, { toValue: 0.4, duration: 200, useNativeDriver: true }),
                    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
                ]).start();
            }
        });
    }, []);

    if (captions.length === 0) return null;

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.headerText}>🎙️ STATION ANNOUNCEMENT</Text>
            </View>
            <View style={styles.captionContainer}>
                {captions.map((text, idx) => (
                    <Text
                        key={idx}
                        style={[
                            styles.captionText,
                            idx === captions.length - 1 ? styles.activeText : styles.dimText
                        ]}
                    >
                        "{text}"
                    </Text>
                ))}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 50,
        left: '5%',
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // High Contrast Black
        borderRadius: 12,
        padding: 16,
        borderWidth: 3,
        borderColor: '#FFD700', // Warning Yellow Border
        zIndex: 1000,
        elevation: 10,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        paddingBottom: 8,
        marginBottom: 8,
    },
    headerText: {
        color: '#FFD700',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    captionContainer: {
        flexDirection: 'column',
    },
    captionText: {
        fontFamily: 'sans-serif-medium',
        fontSize: 24,
        lineHeight: 34,
        color: '#FFFFFF', // High contrast White text
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 8,
    },
    activeText: {
        opacity: 1,
        fontSize: 28,
        fontWeight: 'bold',
    },
    dimText: {
        opacity: 0.5,
        fontSize: 20,
    }
});
