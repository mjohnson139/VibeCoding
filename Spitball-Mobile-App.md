# Spitball Mobile App

A fun decentralized game where friends can shoot spitballs at eachother.

## Software Stack
- Expo
- Javascript

## Environments
- dev
- test
- live

## Decentralized Principles
- Clients use peer-to-peer communications with no central server.
- Communication Methods: HTTPS, WebSocket, Bluetooth
- Authentication: Zero-Knowledge Proofs (ZKPs)

---

# Product Requirements Document (PRD)

## 1. Overview
A mobile application allowing users (friends) to engage in a playful "spitball fight" using decentralized communication methods.

## 2. Goals
- Create a fun, engaging, and simple user experience.
- Implement reliable peer-to-peer communication.
- Ensure user privacy and security through decentralized architecture and ZKPs.

## 3. Core Features

### 3.1 User Onboarding & Identity
   - **Idea:** Users need a temporary session identity for peer-to-peer connection. (Deferring complex decentralized identity with ZKPs for now).

### 3.2 Peer Discovery & Connection
   - **Idea:** Users connect directly with a friend's device on the same local network by scanning a QR code.
   - **Tinker:**
     - Use **WebSockets** for the direct peer-to-peer connection.
     - The QR code will contain the necessary local network information (e.g., IP address, port) for the WebSocket connection.
     - Required libraries: `expo-barcode-scanner` (scanning), `react-native-qrcode-svg` (generating). Consider React Native `Animated` API or `react-native-reanimated` for animations.
     - Display an oscillating red-yellow-green gradient animation (using React Native animation tools) while attempting connection.
     - On successful connection: Animation stops, background glows green.
     - On failed connection: Animation stops, background flashes red with an audible beep.

### 3.3 Spitball Firing & Receiving
   - **Idea:** The primary game mechanic. Users can "fire" a virtual spitball at a connected friend.
   - **Tinker:** 
     - Implement using **@react-three/fiber** and **three.js** for 3D rendering.
     - The shooter interface displays crosshairs; the receiver interface displays a target.
     - Phone motion (using device sensors) controls the aiming of the crosshairs/target.
     - The spitball firing animation should depict an elastic shooter launching the spitball.
     - Visualize distance: the spitball appears to travel from the shooter towards the target.
     - The receiving app shows the incoming spitball and a visual cue upon "impact".

---

## Development Rules & Process

- **Foundation:** This PRD serves as the guiding document.
- **Feature Stages:** idea -> tinker -> test -> release -> monitor -> refine
- **Version Control:** All changes tracked via Git. Commit messages summarize the prompt/work done.
- **Testing:** Automated tests run on code changes, with async notifications for results.

