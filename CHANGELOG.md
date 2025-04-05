# Changelog

All notable changes to the Spitball app will be documented in this file.

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
- Setup of Expo/React Native environment