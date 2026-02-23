import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

export const VibrationSimulator = ({ distance }: { distance: number }) => {
    const [shakeAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (distance < 100) {
            // Οπτική αναπαράσταση δόνησης στο κινητό
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true })
                ])
            ).start();
        } else {
            shakeAnimation.setValue(0);
        }
    }, [distance, shakeAnimation]);

    return (
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
            <Text style={{ color: distance < 50 ? 'red' : 'white', fontWeight: '900', textTransform: 'uppercase' }}>
                {distance < 50 ? "🚨 ΕΠΙΚΕΙΜΕΝΗ ΑΦΙΞΗ" : "✅ Σταθμός Ασφαλής"}
            </Text>
        </Animated.View>
    );
};
