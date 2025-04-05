# Changelog

All notable changes to the Spitball app will be documented in this file.

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
- QR code generation feature to display local IP and port for peer discovery

### Changed
- Updated QRCodeGenerator to use expo-network for compatibility with Expo projects

### Fixed
- Resolved issue with fetching local IP address

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