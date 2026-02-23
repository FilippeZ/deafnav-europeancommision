# DeafNav Wristband - Circuit Diagram

## Component List
- **Controller**: ESP32 DevKit V1
- **Obstacle Sensor**: HC-SR04 Ultrasonic
- **Haptic Engine**: Mini Vibration Motor (Disk type)
- **Biometric Sensor**: Heart Rate Pulse Sensor (Analog)
- **Power**: 3.7V LiPo Battery + TP4056 Charger

## Pin Mapping
| Component | Device Pin | ESP32 Pin | Logic/Function |
|-----------|------------|-----------|----------------|
| HC-SR04   | VCC        | VIN (5V)  | Power          |
| HC-SR04   | GND        | GND       | Ground         |
| HC-SR04   | TRIG       | GPIO 5    | Digital Output |
| HC-SR04   | ECHO       | GPIO 18   | Digital Input  |
| Vibrator  | Pos (+)    | GPIO 19   | PWM Output     |
| Vibrator  | Neg (-)    | GND       | Ground         |
| Pulse Sen | Signal     | GPIO 34   | Analog Input   |
| Pulse Sen | VCC        | 3V3       | Power          |

## Wiring Diagram (Schematic View)
1. **Ultrasonic**: TRIG to D5, ECHO to D18. Ensure VCC is 5V for reliable range detection.
2. **Vibrator**: Connected to GPIO 19. Using PWM (`ledcWrite`) to modulate intensity. Note: For production use a MOSFET (e.g. 2N2222) to handle motor current spike.
3. **Pulse Sensor**: Direct connection to Analog Pin 34.
