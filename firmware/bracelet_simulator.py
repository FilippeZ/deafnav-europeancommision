import paho.mqtt.client as mqtt
import json
import time
import random

# MQTT Configuration
MQTT_BROKER = "localhost" # Ή η IP του server σου
MQTT_TOPIC = "deafnav/telemetry"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "DeafNav_Simulated_Bracelet")
client.connect(MQTT_BROKER, 1883)

print("🚀 DeafNav Bracelet Simulator Started...")

while True:
    # Προσομοίωση προσέγγισης τρένου (από 300cm έως 10cm)
    for dist in range(300, 10, -30):
        pulse = random.randint(70, 110) # Τυχαίοι παλμοί
        
        payload = {
            "deviceId": "BRAC-001",
            "distance": dist,
            "pulse": pulse,
            "battery": 85
        }
        
        client.publish(MQTT_TOPIC, json.dumps(payload))
        print(f"📡 Sending: Dist: {dist}cm, Pulse: {pulse}bpm")
        
        if dist < 50:
            print("⚠️ [HAPTIC ALERT] High Intensity Vibration Triggered!")
            
        time.sleep(2)
