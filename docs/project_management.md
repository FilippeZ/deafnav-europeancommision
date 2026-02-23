# DeafNav - Project Management & Compliance Blueprint

## 1. Product Backlog (Scrum)
| ID | User Story | Priority | Story Points |
|----|------------|----------|--------------|
| US01 | As a Deaf user, I want a vibrating alert when a train is approaching. | Critical | 8 |
| US02 | As a user, I want real-time transcripts of station announcements. | High | 13 |
| US03 | As a user, I want to call a sign-language interpreter via video. | Medium | 21 |
| US04 | As a user, I want to track my heart rate and stress on the app. | Low | 5 |
| US05 | As an Admin, I want to monitor system telemetry for all users. | Low | 8 |

## 2. Risk Mitigation Strategies
### A. Connectivity Loss (Tunnel/Station)
**Risk**: Bluetooth/Wi-Fi disconnects while on the platform.
**Strategy**: **Edge-First Logic**. The HC-SR04 ultrasonic logic and vibration feedback are implemented *locally* in the Arduino firmware. The wristband does not need a backend connection to alert the user of an incoming train, ensuring safety even in dead zones.

### B. Hardware Malfunction
**Risk**: Pulse sensor or ultrasonic sensor failure.
**Strategy**: **Watchdog & Heartbeat**. The device sends a 1Hz "heartbeat" to the backend. If the backend detects a missing heartbeat or a "sensor_fail" status, it sends an immediate push notification to the user's phone to check their wearable.

### C. Battery Depletion
**Risk**: Wristband dies mid-trip.
**Strategy**: **Low-Power Mode**. When battery < 15%, the device disables pulse telemetry and increases the ultrasonic sampling interval, prioritizing the core safety "train detection" feature.

## 3. GDPR & Data Privacy
### Biometric Data Masking
To ensure compliance with GDPR (General Data Protection Regulation):
1. **Hashing at the Edge**: The unique Hardware ID (MAC Address) is hashed using SHA-256 before being sent to the database. The real ID is never stored.
2. **Pseudo-Anonymization**: Biometric data (Heart Rate) is stored separately from user-identifiable data (Name/Email) using a randomly generated `ProxyID`.
3. **Automatic Purge**: Telemetry data older than 24 hours is automatically purged from the `DeviceData` table unless opted-in for health monitoring features.
4. **Encryption**: All MQTT and Socket traffic is encrypted using TLS/SSL to prevent eavesdropping on sensitive biometric streams.
