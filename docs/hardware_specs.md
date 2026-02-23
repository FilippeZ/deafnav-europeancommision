# DeafNav Hardware Specifications & Circuit Diagram

## Components
1. **Microcontroller**: ESP32 (Recommended for built-in Wi-Fi/Bluetooth and PWM).
2. **Ultrasonic Sensor**: HC-SR04.
3. **Pulse Sensor**: Standard Analog Pulse Oximetry sensor.
4. **Vibration Motor**: 3V Coin vibration motor.

## Circuit Diagram Mapping

| Component | Component Pin | ESP32 Pin | Note |
|-----------|---------------|-----------|------|
| **HC-SR04** | VCC | 5V / VIN | Power |
| | GND | GND | Ground |
| | Trig | Pin 5 | Digital Output |
| | Echo | Pin 18 | Digital Input (3.3V logic recommended) |
| **Pulse Sensor** | VCC | 3.3V | Power |
| | GND | GND | Ground |
| | Signal | Pin 34 | Analog Input |
| **Vibration Motor** | Positive (+) | Pin 19 | PWM Output (Use Transistor/MOSFET driver) |
| | Negative (-) | GND | Ground |

## Logic Flow
1. **Proximity Detection**: The HC-SR04 measures distance to the train. The `vibrate(intensity)` function maps distance (5cm-50cm) to PWM duty cycle (255-50), providing tactile feedback.
2. **Biometrics**: The Pulse Sensor reads heart rate. Data is published to `deafnav/pulse` via MQTT for stress monitoring.
3. **Connectivity**: Wi-Fi provides the backbone for MQTT communication with the backend.
