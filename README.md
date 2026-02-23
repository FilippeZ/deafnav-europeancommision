# DeafNav 🛰️
### HD Unified Interface for Deaf-Accessible Transit

![Dashboard Screenshot](./screenshots/dashboard.png)

DeafNav is a cutting-edge, real-time command center designed to provide unprecedented transit accessibility for the deaf and hard-of-hearing community. This platform integrates real-time IoT telemetry from wearable devices, live video translation, and haptic feedback controls into a unified, professional dashboard.

## 🚀 Key Features

- **Live Transit Telemetry:** Real-time arrival and departure data for Athens public transport (OASA Line 2 & 3).
- **IoT Bracelet Integration:** Live monitoring of device connectivity, battery status, and user stress levels (BPM).
- **Haptic Control Hub:** Customizable vibration patterns (Standard, Soft Pulse, Rapid Alert, Emergency SOS) for tactile notifications.
- **Vision AI Translation:** Live transcription of sign language video feeds into text.
- **Support Command Center:** Instant SOS video calls with sign-language-capable representatives.
- **EU Standard Compliance:** Built to meet high accessibility and safety standards.

## 🛠️ Technology Stack

- **Frontend:** Next.js, Framer Motion, Vanilla CSS, Lucide Icons.
- **Backend:** Node.js, WebSocket (Telemetry), MQTT (Gateway Interaction).
- **Design:** Glassmorphism, Premium Dark UI, Responsive Layout.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FilippeZ/deafnav-europeancommision.git
   cd deafnav-europeancommision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Mobile Compatibility
DeafNav is designed with a mobile-first approach, ensuring seamless transitions between the desktop dashboard and wearable device interactions.

---
*Developed for the European Commission CEF Mobility Initiative.*
