import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const EU_MAP = require('../../public/images/eu/map.jpg');
const EU_STRASBOURG = require('../../public/images/eu/0610_Strasbourg_Gabrielle-Ferrandi2.jpg');
const EU_PARIS = require('../../public/images/eu/0710_Paris_Gabrielle-Ferrandi.jpg');
const EU_TRAIN = require('../../public/images/eu/1630589246777.jpg');

interface Props {
    onBack: () => void;
}

export default function EUCompliance({ onBack }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>EU Vision & Standards</Text>
            </View>

            <ScrollView style={styles.content}>
                <Image source={EU_MAP} style={styles.heroImage} resizeMode="cover" />

                <View style={styles.overlaySection}>
                    <Text style={styles.badge}>20,000 KM JOURNEY</Text>
                    <Text style={styles.sectionTitle}>Connecting Europe Express</Text>
                    <Text style={styles.paragraph}>
                        The Connecting Europe Express was a rolling laboratory, revealing the achievements of our
                        Single European Rail Area. Travelling across 26 countries and 33 borders, it highlighted
                        the need for seamless cross-border travel.
                    </Text>
                </View>

                <View style={styles.imageGrid}>
                    <View style={styles.gridItem}>
                        <Image source={EU_STRASBOURG} style={styles.gridImage} />
                        <Text style={styles.gridLabel}>Strasbourg</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Image source={EU_PARIS} style={styles.gridImage} />
                        <Text style={styles.gridLabel}>Paris Arrival</Text>
                    </View>
                </View>

                <View style={styles.mainSection}>
                    <Text style={styles.subTitle}>TEN-T Network Goals</Text>
                    <Text style={styles.paragraph}>
                        DeafNav aligns with the vision for a modern, high-quality rail infrastructure.
                        We support the completion of the core network by 2030, integrating digital
                        solutions like ERTMS to improve safety and punctuality.
                    </Text>

                    <Image source={EU_TRAIN} style={styles.featureImage} />

                    <Text style={styles.subTitle}>Our Accessibility Commitment</Text>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Real-time ERTMS-compatible alert logic for wearable devices.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Transposition of the 4th Railway Package for open markets.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Digital Automatic Coupling (DAC) for information flows.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Managed by DG MOVE - Connecting Europe Facility
                    </Text>
                    <Text style={styles.footerSubText}>European Year of Rail 2021 Implementation</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfdfd' },
    header: {
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
        backgroundColor: '#003399', flexDirection: 'row', alignItems: 'center',
        elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5
    },
    backButton: { marginRight: 15 },
    backText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
    content: { flex: 1 },
    heroImage: { width: '100%', height: 300 },
    overlaySection: {
        marginTop: -40, backgroundColor: '#fff', marginHorizontal: 20,
        padding: 25, borderRadius: 20, elevation: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20
    },
    badge: {
        color: '#003399', fontSize: 10, fontWeight: 'bold',
        letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase'
    },
    sectionTitle: { fontSize: 26, fontWeight: '900', color: '#1a1a1a', marginBottom: 12 },
    paragraph: { fontSize: 15, color: '#555', lineHeight: 24, textAlign: 'justify' },
    imageGrid: { flexDirection: 'row', padding: 20, gap: 15 },
    gridItem: { flex: 1 },
    gridImage: { width: '100%', height: 120, borderRadius: 15 },
    gridLabel: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 8, fontWeight: 'bold' },
    mainSection: { padding: 20 },
    subTitle: { fontSize: 20, fontWeight: 'bold', color: '#003399', marginTop: 20, marginBottom: 10 },
    featureImage: { width: '100%', height: 220, borderRadius: 20, marginVertical: 20 },
    bulletPoint: { flexDirection: 'row', marginTop: 12, paddingRight: 20 },
    bullet: { fontSize: 18, color: '#003399', marginRight: 12, fontWeight: 'bold' },
    bulletText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
    footer: {
        padding: 40, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0',
        backgroundColor: '#fafafa'
    },
    footerText: { fontSize: 12, color: '#003399', fontWeight: 'bold' },
    footerSubText: { fontSize: 10, color: '#bbb', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }
});
