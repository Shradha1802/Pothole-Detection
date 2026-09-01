# 🚧 PotholeGuard — Smart Road Monitoring & Pothole Detection System

**PotholeGuard** is an IoT-powered road monitoring solution that pairs a vehicle-mounted embedded sensor unit with a web dashboard. The embedded device autonomously detects potholes in real time using multi-sensor fusion (ultrasonic depth + IMU vibration) and tags each event with GPS coordinates. The companion website surfaces this pothole event data for viewing and analysis. *(Live Wi-Fi transmission from the device to the backend is a planned enhancement — see Future Work.)*

This repository (`Pothole-Guard`) contains the **software layer** (Backend + Frontend web application) that works alongside the embedded IoT sensor unit.

🔗 **Live Demo:** [potholedetection-a8ta.onrender.com](https://potholedetection-a8ta.onrender.com/)

---

## 🧠 How It Works — System Overview

The full system is composed of two halves:

1. **IoT Sensing Unit** — mounted under a vehicle, this continuously monitors road surface conditions and detects confirmed pothole events, tagged with GPS coordinates.
2. **Web Application** (this repository) — a `Backend` + `Frontend` app that stores and visualizes pothole event data (location, severity, timestamp).

```
 ┌─────────────────────┐         ┌──────────────────────┐
 │   IoT Sensor Unit    │  data   │   PotholeGuard Web    │
 │ (ESP32 + Sensors)    │ ─────▶  │  (Backend + Frontend) │
 │ Detects & logs events│         │  Displays/manages data│
 └─────────────────────┘         └──────────────────────┘
```

---

## 🔩 Hardware Overview

The embedded unit uses a **dual-confirmation, multi-sensor fusion algorithm** to detect potholes with high accuracy and low false-positive rates.

| Component | Role |
|---|---|
| **ESP32 Microcontroller** | Central processor — dual-core, Wi-Fi/BLE enabled, handles sensor fusion and pothole detection logic |
| **HC-SR04 Ultrasonic Sensor** | Measures road surface depth (time-of-flight ranging), mounted facing downward |
| **MPU6050 IMU (Accelerometer + Gyroscope)** | Detects vibration/impact signatures characteristic of a pothole impact |
| **NEO-6M GPS Module** | Tags every confirmed pothole event with precise latitude/longitude |

### Detection Logic

A pothole event is confirmed using a **dual-confirmation approach**: the system cross-checks the ultrasonic depth reading against the IMU's vibration signature, flagging an event only when both sensors agree — reducing false positives from single-sensor triggers (e.g., speed bumps or drain covers alone).

Detected potholes are classified by severity (Minor / Moderate / Severe) based on the combined magnitude of the sensor response.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Express (Node.js) |
| Database | MongoDB |
| Embedded Firmware | C++ (Arduino framework for ESP32) |
| Hardware | ESP32, HC-SR04, MPU6050, NEO-6M GPS |

---

## 📁 Project Structure

```
Pothole-Guard/
├── Backend/     # API server — receives/stores pothole event data, serves it to the frontend
├── Frontend/    # Web dashboard — displays pothole events (location, severity, timestamp)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- The IoT hardware unit (ESP32 + sensors) if you intend to feed it live data

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shradha1802/Pothole-Guard.git
   cd Pothole-Guard
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file inside `Backend/` with the environment variables your server expects (e.g., database connection string, port). Update this section once the actual variable names are confirmed.

   Start the backend:
   ```bash
   npm start
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

4. Visit the local URL printed in your terminal (typically `http://localhost:5173` for Vite or `http://localhost:3000` for CRA) to view the dashboard.

### Hardware Setup (Optional — for live data)

- HC-SR04 → ESP32 GPIO
- MPU6050 → ESP32 I2C (SDA/SCL)
- NEO-6M GPS → ESP32 UART
- Power via a regulated supply appropriate for vehicle mounting

---

## 🖥️ Usage

1. The IoT unit is mounted under a vehicle and powered on; it detects confirmed pothole events and tags them with GPS coordinates. *(Live Wi-Fi transmission to the backend is planned — see Future Work. For now, event data reaches the backend through whatever interim method you're currently using — update this line to describe that.)*
2. The web dashboard (this repo) displays logged pothole events — location, severity, and timestamp — for review by maintenance teams or researchers.
3. Data can be used to prioritize road repair and generate maintenance reports.

---

## 🔮 Future Work

Planned enhancements include:
- **Cloud connectivity** — real-time Wi-Fi transmission from the ESP32 directly to this backend
- **Machine learning classification** to better distinguish potholes from speed bumps/railway crossings

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Shradha Choudhary

---

## 👥 Authors

Built as part of Project 21ECP302L, Department of Electronics & Communication Engineering, SRM Institute of Science and Technology (2026), under the guidance of Dr. Sayantani Bhattacharya.

- **Shradha Choudhary** — [@Shradha1802](https://github.com/Shradha1802)
- **Vaibhav Raj Gupta**
- **Sumukh Hegde**
