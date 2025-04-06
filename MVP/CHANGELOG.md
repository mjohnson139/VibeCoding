# Changelog

All notable changes to the Spitball app will be documented in this file.

## [1.0.2] - 2025-04-06

### Added
- Game screen transition after successful connection
- Centered animation during connection process

### Changed
- Updated connection animation to appear in the center of the screen
- Improved connection flow with automatic transition to game screen
- Updated build numbers to reflect current date (20250406)

### Fixed
- Resolved "Cannot find native module 'ExpoNearbyConnectionsModule'" error
- Fixed npm vulnerabilities (reduced from 110 to 13)
- Generated native code directories for proper module linking

## [1.0.5] - 2025-04-05

### Added
- WebSocket server/client infrastructure for peer-to-peer communication
- Real-time connection status with animated gradient feedback
- Connection state management (connecting, connected, error)
- Disconnect functionality with status indicators
- Socket.IO integration for reliable WebSocket communications

### Changed
- Enhanced QR code generation to include connection data
- Updated QR scanner to process connection information
- Improved Connect Screen with dynamic connection status display

### Fixed
- Properly handle WebSocket connection errors
- Improved error reporting for connection issues

## [1.0.4] - 2025-04-05

### Added
- Redesigned ConnectScreen component with improved layout
- Enhanced QR code scanner with intuitive crosshair interface

### Changed
- Improved camera view with constrained dimensions
- Updated scanner UI with rounded frame and targeting crosshairs
- Better organization of components in main App screen

### Fixed
- Resolved layout issues with overlapping components
- Fixed camera view sizing and positioning
- Adjusted QR code scanner to be more visually appealing

## [1.0.3] - 2025-04-05

### Added
- QR code scanning feature for peer discovery

### Changed
- Updated QRCodeScanner to use the latest expo-camera API

### Fixed
- Resolved issues with camera permissions and facing property

## [1.0.2] - 2025-04-05

### Added
- Expo Nearby Connections implementation for peer-to-peer connectivity
- Bluetooth-based device discovery and connection handling
- QR code generation now includes device ID and username
- Connection status indications for Bluetooth connectivity
- Web interface placeholder with mobile device mockup
- Visual progress indicators for milestone completion

### Changed
- Replaced WebSocket-based networking with Nearby Connections API
- Updated QR code scanner to work with new connection method
- Modified connection flow to use Bluetooth instead of IP/port
- Updated error messages to guide users about Bluetooth requirements
- Updated todo list to reflect completed connection tasks

### Fixed
- Improved connection reliability across different networks
- Eliminated firewall and NAT traversal issues by using direct device-to-device connections

## [1.0.1] - 2025-04-05

### Added
- Environment management concept (dev, test, live)
- Environment-switching capabilities documented in todo.md
- Visual environment indicator showing current environment (DEV/TEST/LIVE)
- Persistent environment storage using AsyncStorage
- Environment-specific configuration system
- Redesigned version indicator matching environment indicator style

### Changed
- Updated version numbers in package.json and app.json
- Updated build numbers to reflect current date (20250405)
- Improved UI with consistent styling for indicators
- Moved version indicator to match new design language

### Fixed
- None

## [1.0.0] - 2025-04-04

### Added
- Initial application setup
- Basic project structure
- Installation of core dependencies (expo-barcode-scanner, react-native-qrcode-svg, @react-three/fiber, three, expo-sensors)
