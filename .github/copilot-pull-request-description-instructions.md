# Pull Request Description Instructions

When generating a pull request description for the Spitball Mobile App, please include the following sections and information:

## Title Format

Format: `[Feature Stage] Brief description of the changes`

Example: `[Tinker -> Test] Implement QR code generation and scanning`

## Description Sections

### What Changed

Provide a concise summary of the changes made in this pull request. Focus on:
- What features or fixes were implemented
- Which components were modified
- Any architectural decisions made

### Why It Changed

Explain the motivation behind these changes:
- Reference related requirements from the PRD
- Explain the problems being solved
- Note any technical debt being addressed

### How to Test

Detailed instructions for testing the changes:
- Step-by-step testing procedures
- Environment setup required
- Expected outcomes at each step
- Edge cases to verify

### Visual Changes (if applicable)

- Include screenshots or videos demonstrating UI changes
- Show before/after comparisons if relevant
- Highlight changes across different device sizes if applicable

### Technical Notes

- Note any important implementation details
- Mention dependencies added or removed
- Explain any non-obvious technical decisions
- Highlight performance considerations
- Document any security implications

### Feature Stage Transition

Describe the current feature development stage and whether this PR transitions it:
- Which feature stage is being completed (idea->tinker, tinker->test, etc.)
- What remains to be done in future PRs
- Any known limitations to be addressed later

## Example PR Description

```
# [Tinker -> Test] Implement QR code generation and WebSocket connection

## What Changed
- Added QR code generation screen to display local network information
- Implemented WebSocket server setup on the host device
- Created connection status animation with gradient background
- Added success/failure visual feedback

## Why It Changed
This implements the core peer discovery and connection feature from the PRD (section 3.2), allowing devices to establish a direct peer-to-peer connection using QR codes and WebSockets.

## How to Test
1. Run the app on two devices connected to the same WiFi network
2. On device A: Tap "Start Game" and verify QR code appears with local IP/port
3. On device B: Tap "Join Game" and scan the QR code from device A
4. Verify connection animation shows while connecting
5. Confirm both devices show green success screen when connected
6. Test failure case by turning off WiFi on one device during connection

## Visual Changes
[Screenshots of QR code, connection animation, and success screens]

## Technical Notes
- Used `react-native-qrcode-svg` for QR generation
- WebSocket implementation uses standard browser WebSocket API
- Connection animation uses React Native's Animated API
- Added network info detection for getting local IP address

## Feature Stage Transition
This PR completes the "Tinker" stage of the Peer Discovery feature and moves it to "Test." All core functionality is implemented, but we may need to add more robust error handling and reconnection logic in future PRs.
```