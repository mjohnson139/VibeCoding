# Spitball App TODO List

## Setup

- [x] Initialize Git repository
- [x] Create initial Expo project structure (`/MVP`) with TypeScript template
- [x] Install necessary dependencies (`expo-barcode-scanner`, `react-native-qrcode-svg`, `@react-three/fiber`, `three`, `expo-sensors`)
- [x] Create a rock solid .gitignore file.
- [x] Create a list of development rules in the .github directory.
- [x] List workflow optimization files in .github directory.
- [x] Create versioning instructions file.
- [x] Create instruction files in the .github directory
- [ ] Review and condense remaining instruction files (PR descriptions, code reviews)

## Feature: Peer Discovery & Connection (PRD 3.2)

- [ ] **Tinker:** Implement QR code generation (displaying local IP/port)
- [ ] **Tinker:** Implement QR code scanning
- [ ] **Tinker:** Establish WebSocket server on one peer
- [ ] **Tinker:** Establish WebSocket client connection on the other peer after scan
- [ ] **Tinker:** Implement connection status animation (oscillating gradient)
- [ ] **Tinker:** Implement success (green glow) and failure (red flash + beep) states for animation
- [ ] **Test:** Test connection on the same local network
  - **Test Instructions:**
    1. Launch app on two different devices on the same WiFi network
    2. On Device A: Navigate to "Connect" screen by tapping "Start Game" button
    3. Verify QR code displayed on Device A is clear and accompanied by text showing the local IP/port
    4. On Device B: Navigate to "Scan" screen by tapping "Join Game" button
    5. Hold Device B camera up to Device A's QR code
    6. Verify that Device B shows oscillating red-yellow-green gradient during connection
    7. Verify connection success: Both screens should glow solid green and display "Connected!"
    8. Test failure case: Turn off WiFi on one device during connection and verify red flash with audible beep
    9. Verify "Disconnect" button appears and functions on both devices after connection

## Feature: Spitball Firing & Receiving (PRD 3.3)

- [ ] **Tinker:** Set up basic 3D scene with `@react-three/fiber` and `expo-gl`
- [ ] **Tinker:** Implement device motion controls (`expo-sensors`) for aiming
- [ ] **Tinker:** Display crosshairs (shooter) / target (receiver) in the 3D scene
- [ ] **Tinker:** Implement elastic shooter animation on tap/button press
- [ ] **Tinker:** Implement spitball projectile animation (visualizing distance)
- [ ] **Tinker:** Send "fire" event over WebSocket
- [ ] **Tinker:** Receive "fire" event over WebSocket
- [ ] **Tinker:** Display incoming spitball and impact visualization
- [ ] **Test:** Test firing and receiving between connected peers
  - **Test Instructions:**
    1. After successful connection between Device A and Device B, observe both enter 3D scene
    2. On Device A (shooter): 
       - Verify crosshairs are visible in center of screen
       - Move device around and verify crosshairs respond to motion
       - Aim at an intended target position
       - Tap and hold "Fire" button at bottom of screen
       - Observe elastic shooter animation stretching based on hold duration
       - Release to fire and verify spitball launches with appropriate trajectory
       - Observe spitball traveling with distance perspective (getting smaller)
    3. On Device B (target):
       - Verify target is visible and responds to device motion
       - When Device A fires, verify incoming spitball animation appears
       - Verify impact visual effect and sound when spitball hits
       - Check "Hit Counter" in corner increments
    4. Test role switching:
       - Tap "Switch Roles" button on either device
       - Verify Device A now shows target and Device B shows crosshairs
       - Repeat firing test from other direction
    5. Test multi-shot scenario:
       - Fire multiple spitballs in quick succession
       - Verify all are rendered and tracked correctly

## Feature: User Onboarding & Identity (PRD 3.1) - Deferred

- [ ] Define requirements for persistent/decentralized identity (if needed later)

## General

- [ ] Set up automated testing framework
  - **Test Instructions:**
    1. Access Test Dashboard from main menu via "Developer Options" button
    2. Verify all test categories are listed with pass/fail status
    3. Run manual test by tapping "Run Tests" button
    4. Verify background test runs automatically when code changes are detected
    5. Check notification appears with test results
    6. Tap notification to navigate directly to failing test details (if any)
- [ ] Implement background testing notifications
