# Risk Mitigation & GDPR Compliance for DeafNav

## 1. Risk Mitigation Strategies

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| **Wi-Fi Loss in Tunnel** | HIGH | **Offline Mode**: The bracelet stores the last known route in local memory and triggers a 3-vibration pattern for arrival even without active Wi-Fi, using purely ultrasonic detection. |
| **Sensor Malfunction** | MEDIUM | **Fail-Safe Mode**: If the ultrasonic sensor fails, the bracelet cross-references real-time transit APIs from the backend as a secondary source. |
| **Battery Depletion** | LOW | **Power-Saver Mode**: The wristband reduces MQTT frequency to 1/min and dims LEDs when battery is below 15%. |

## 2. GDPR Compliance & Data Masking

The project involves processing sensitive biometric data (heart rate). To comply with GDPR:

### Data Masking & Anonymization
1. **At Source**: The ESP32 does not send any User ID with the biometric data. It only sends a `DeviceID` which is a randomized UUID.
2. **Pseudonymization**: The mapping between `UserID` and `DeviceID` is stored in a separate, encrypted table in the PostgreSQL database with restricted access.
3. **Data Retention**: Biometric (pulse) logs are automatically purged after 24 hours unless the user explicitly opts into "Health Trends" storage.
4. **Encryption**: All MQTT traffic is encrypted using TLS/SSL, and the database uses TDE (Transparent Data Encryption).
5. **Transparency**: The mobile app includes a "Data Dashboard" where users can view, download, or delete their collected data instantly.
