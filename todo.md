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
- [x] Review and condense remaining instruction files (PR descriptions, code reviews)

## Feature: Peer Discovery & Connection (PRD 3.2)

- [x] **Tinker:** Implement QR code generation (displaying device ID)
- [x] **Tinker:** Implement QR code scanning
- [x] **Tinker:** Design and implement the qrcode view, that shows on start, with an image of a camera that allows you to switch to scan mode.  Keep the camera the size of the QRcode and show a faint view of the QR code that it generated as an overlay.  
- [x] **Tinker:** Allow for a basic token based auth that requires a scan of the QRCode to be able to connect. Also allow a basic user profile to be encoded in the QR code with a handle, and the players stats.  
- [x] **Tinker:** Establish peer-to-peer connection using Nearby Connections
- [x] **Tinker:** Implement connection status animation (oscillating gradient)
- [x] **Tinker:** Implement success (green glow) and failure (red flash + beep) states for animation
- [ ] **Test:** Test connection between devices with Bluetooth enabled
  - **Test Instructions:**
    1. Launch app on two different devices with Bluetooth enabled
    2. On Device A: Navigate to "Connect" screen by tapping "Start Game" button
    3. Verify QR code displayed on Device A is clear and accompanied by text showing the device ID
    4. On Device B: Navigate to "Scan" screen by tapping "Join Game" button
    5. Hold Device B camera up to Device A's QR code
    6. Verify that Device B shows oscillating red-yellow-green gradient during connection
    7. Verify connection success: Both screens should glow solid green and display "Connected!"
    8. Test failure case: Turn off Bluetooth on one device during connection and verify red flash with audible beep
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

## Environment Management

- [x] Implement environment switching system (dev, test, live)
  - [x] Create environment configuration files for each environment
  - [x] Implement UI toggle for switching environments
  - [x] Store last used environment in local storage
  - [x] Add visual indicator of current environment (dev/test/live)
  - [x] Ensure all network calls use environment-specific endpoints
  - [x] Make environment switching possible without app restart
  - [ ] Add environment-specific logging levels
  - [ ] Create documentation for environment setup and switching
  - **Implementation Guidelines:**
    1. All code should be environment-aware
    2. API endpoints should be configurable per environment
    3. Features should be toggleable based on environment
    4. Test data should be available in dev/test environments
    5. Visual indicators should clearly show current environment (color-coded status bar)
    6. Detailed logs in dev/test, minimal logs in live
