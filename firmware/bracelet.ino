/*
  DeafNav Wristband Firmware
  Hardware: ESP32 or Arduino with Wi-Fi/Bluetooth
  Sensors: HC-SR04 (Ultrasonic), Pulse Sensor (Analog)
  Output: Vibration Motor (PWM)
*/

#include <PubSubClient.h>
#include <WiFi.h>


// --- Configuration ---
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *mqtt_server = "MQTT_BROKER_IP";

// Pins
const int trigPin = 5;       // HC-SR04 Trig
const int echoPin = 18;      // HC-SR04 Echo
const int vibrationPin = 19; // Vibration Motor (PWM)
const int pulsePin = 34;     // Pulse Sensor (Analog)

// MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// PWM Settings
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8; // 0-255

void setup() {
  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // PWM setup for ESP32
  ledcSetup(ledChannel, freq, resolution);
  ledcAttachPin(vibrationPin, ledChannel);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("DeafNavWristband")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long distanceLines = duration * 0.034 / 2;
  return distanceLines;
}

void vibrate(int distance) {
  // Increase vibration as distance decreases
  // Range: 5cm to 50cm
  int intensity = 0;
  if (distance < 50 && distance > 2) {
    intensity = map(distance, 5, 50, 255, 50);
    if (intensity < 0)
      intensity = 0;
  }
  ledcWrite(ledChannel, intensity);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // 1. Ultrasonic Sensor Logic
  long distance = getDistance();
  vibrate(distance);

  // 2. Pulse Sensor Logic
  int pulseValue = analogRead(pulsePin);
  // Basic thresholding or send raw data
  String payload = String(pulseValue);
  client.publish("deafnav/pulse", payload.c_str());

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.print(" cm, Pulse: ");
  Serial.println(pulseValue);

  delay(200); // Sampling rate
}
