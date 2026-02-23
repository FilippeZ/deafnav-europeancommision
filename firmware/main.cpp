/**
 * DeafNav Wristband Firmware v1.0
 * Target: ESP32 or Arduino w/ WiFi/Bluetooth
 * Libraries: PubSubClient (MQTT), WiFi
 */

#include <WiFi.h>
#include <PubSubClient.h>

// PIN DEFINITIONS
#define TRIG_PIN 5
#define ECHO_PIN 18
#define VIBRATOR_PIN 19   // PWM Pin for vibration motor
#define PULSE_PIN 34      // Analog pin for pulse sensor

// CONSTANTS
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com"; // Example public broker

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(VIBRATOR_PIN, OUTPUT);
  
  // Setup PWM for vibration (intensity control)
  ledcSetup(0, 5000, 8); // Channel 0, 5KHz, 8-bit res
  ledcAttachPin(VIBRATOR_PIN, 0);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("DeafNavWristband_001")) {
      client.subscribe("deafnav/cmd");
    } else {
      delay(5000);
    }
  }
}

// Function: vibrate(intensity)
// targetIntensity: 0 - 255
void vibrate(int intensity) {
  ledcWrite(0, intensity);
}

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2; // Distance in cm
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // 1. Logic for Ultrasonic Sensor (HC-SR04)
  long distance = getDistance();
  
  // 2. Proximity-based Vibration (Logic)
  if (distance < 200 && distance > 0) { // Train/Obstacle detected within 2m
    // Increase vibration as distance decreases
    int intensity = map(distance, 0, 200, 255, 50); 
    intensity = constrain(intensity, 0, 255);
    vibrate(intensity);
  } else {
    vibrate(0);
  }

  // 3. Heart Rate/Pulse Telemetry
  int pulseValue = analogRead(PULSE_PIN);
  char msg[50];
  snprintf(msg, 50, "{\"heartRate\": %d, \"distance\": %ld}", pulseValue, distance);
  client.publish("deafnav/telemetry", msg);

  delay(100); // 10Hz Sampling
}
