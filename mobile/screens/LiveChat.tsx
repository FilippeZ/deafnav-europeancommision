import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const socket = io('http://YOUR_BACKEND_IP:4000'); // Use your local IP

export default function LiveChat() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Initial welcome message from support
        setMessages([
            {
                _id: 1,
                text: 'Γεια σας! Είμαι ο εκπρόσωπος του DeafNav. Πώς μπορώ να σας βοηθήσω;',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Support Agent',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]);

        socket.on('message', (msg) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, msg));
        });

        return () => socket.off('message');
    }, []);

    const onSend = useCallback((messages = []) => {
        const msg = messages[0];
        socket.emit('message', msg);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: '#003399' },
                    left: { backgroundColor: '#f1f5f9' }
                }}
                textStyle={{
                    right: { color: 'white' },
                    left: { color: '#0f172a' }
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>LIVE SUPPORT</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.statusText}>Interpreter Online</Text>
                </View>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }} // User ID 1
                renderBubble={renderBubble}
                placeholder="Πληκτρολογήστε μήνυμα..."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { padding: 20, paddingTop: 50, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    title: { fontSize: 18, fontWeight: '900', color: '#003399', letterSpacing: 1 },
    statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    onlineDot: { width: 8, height: 8, backgroundColor: '#22c55e', borderRadius: 4, marginRight: 6 },
    statusText: { fontSize: 12, color: '#64748b', fontWeight: 'bold' }
});
