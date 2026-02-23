import { Vibration, Platform } from 'react-native';
// Assuming we are using socket.io-client to listen to backend events
import io, { Socket } from 'socket.io-client';

export interface AlertPayload {
    title: string;
    message: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * AccessibilityService - Mobile Logic (React Native)
 * Listens for backend real-time alerts and triggers device-level features:
 * - Haptic feedback for Deaf users.
 * - High-contrast visual alerts dispatching.
 */
class AccessibilityService {
    private socket: Socket | null = null;
    private listeners: Array<(alert: AlertPayload) => void> = [];

    /**
     * Connect to the Node.js WebSocket Backend (transit_api aggregator)
     */
    public connectToBackend(backendUrl: string) {
        this.socket = io(backendUrl, {
            transports: ['websocket'],
            autoConnect: true,
        });

        this.setupSocketListeners();
    }

    private setupSocketListeners() {
        if (!this.socket) return;

        // Listen for Elevator Breakdowns
        this.socket.on('ELEVATOR_ALERT', (data: any) => {
            const payload: AlertPayload = {
                title: 'Elevator Out of Order',
                message: `Station ${data.stationName} (Line ${data.lineID}): ${data.elevatorName} is broken.`,
                severity: 'HIGH'
            };
            this.triggerAccessibilityAlert(payload);
        });

        // Listen for Transit Delays & PA Announcements Interceptions
        this.socket.on('TRANSIT_DELAY', (data: any) => {
            const payload: AlertPayload = {
                title: 'Transit Delay',
                message: `Your bus/train (Line ${data.lineCode}) is currently experiencing delays.`,
                severity: 'MEDIUM'
            };
            this.triggerAccessibilityAlert(payload);
        });

        // Simulated listener for the "What They Say" Live Captioning module output
        this.socket.on('LIVE_CAPTION_ANNOUNCEMENT', (text: string) => {
            const payload: AlertPayload = {
                title: 'Live PA Announcement',
                message: text, // Represents the speech-to-text conversion
                severity: 'HIGH'
            };
            this.triggerAccessibilityAlert(payload);
        });
    }

    /**
     * Triggers distinct haptic feedback patterns and pushes to visual UI alerts.
     */
    private triggerAccessibilityAlert(payload: AlertPayload) {
        // Haptic Feedback Logic for Deaf / Hard of Hearing users
        if (Platform.OS === 'ios') {
            // iOS specific vibrating rhythms
            if (payload.severity === 'HIGH') {
                Vibration.vibrate([0, 500, 200, 500]); // Long, intense
            } else {
                Vibration.vibrate([0, 200, 100, 200]); // Shorter
            }
        } else {
            // Android specific vibrating rhythms
            if (payload.severity === 'HIGH') {
                Vibration.vibrate(1000); // Solid 1 second vibration
            } else {
                Vibration.vibrate([0, 300, 100, 300]); // Pattern
            }
        }

        // Notify UI components registered to display high-contrast alerts
        this.listeners.forEach(listener => listener(payload));
    }

    // Subscribe to alerts to display on the high-contrast UI overlay
    public onAlert(callback: (alert: AlertPayload) => void) {
        this.listeners.push(callback);
    }

    public unsubscribe(callback: (alert: AlertPayload) => void) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    /**
     * Helper for Sign Language Translation MVPs
     * (E.g. from react-native-vision-camera passing frames to Edge YOLO/LSTM model)
     */
    public processSignLanguageFrame(frameData: any) {
        // A placeholder showing where the HearMeOut YOLO component hooks into the logic
        // This receives frames locally and offloads to the MediaPipe/LSTM worker thread
        console.log('Processing frame for local ASL Translation via YOLO/LSTM Pipeline');
    }
}

export default new AccessibilityService();
