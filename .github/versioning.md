# Versioning Guidelines

This document outlines the versioning system for the Spitball Mobile App, including how version numbers are structured, displayed, and how release notes are managed.

## Version Number Structure

We use [Semantic Versioning](https://semver.org/) with the format: `MAJOR.MINOR.PATCH`

1. **MAJOR** version: Incremented for incompatible API changes or significant feature overhauls
2. **MINOR** version: Incremented for new features added in a backward compatible manner
3. **PATCH** version: Incremented for backward compatible bug fixes

## Build Numbers

- Build numbers are independent of version numbers
- Format: `YYYYMMDD.build_number` (e.g., `20250404.1`)
- The date component (`YYYYMMDD`) represents the build date
- The `build_number` component increments for each build on the same day, starting at 1

## Version Display in App

- The version and build number should be prominently displayed in:
  - App settings screen
  - About page
  - Debug/developer menu
  - Loading/splash screen (subtly)

## Version Code Example

```typescript
// In app.json or app.config.js
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "20250404.1"
    },
    "android": {
      "versionCode": 20250404001
    }
  }
}
```

```typescript
// Component to display version info
import Constants from 'expo-constants';

function VersionDisplay() {
  return (
    <Text>
      Version {Constants.expoConfig.version} (Build {Platform.OS === 'ios' 
        ? Constants.expoConfig.ios.buildNumber 
        : Constants.expoConfig.android.versionCode})
    </Text>
  );
}
```

## Release Notes

### Release Notes Structure

1. **Summary**: 1-2 sentences describing the overall update focus
2. **New Features**: Bullet points of new capabilities
3. **Improvements**: Enhancements to existing features
4. **Bug Fixes**: Issues that were resolved
5. **Known Issues**: Any outstanding problems users should be aware of

### Guidelines for Writing Release Notes

- Keep release notes concise and user-focused
- Use simple, non-technical language
- Focus on user benefits, not technical implementation
- Group related changes
- For major features, include a single sentence explaining how to use the feature

### Storage and Display

- Release notes should be stored in:
  - A `CHANGELOG.md` file in the repository
  - The app itself, accessible from the Settings or About screen
  - App store update descriptions

### Release Notes Example

```markdown
# Version 1.2.0 (Build 20250510.1)

## Summary
This update improves the spitball firing mechanics and fixes several connection issues.

## New Features
- Added trajectory prediction line when aiming
- New sound effects for different spitball impacts
- "Quick Fire" mode for rapid shooting

## Improvements
- Smoother aiming controls with enhanced motion tracking
- Reduced connection time by 40%
- More visible hit indicators

## Bug Fixes
- Fixed connection loss when device is locked briefly
- Corrected targeting alignment on larger screen devices
- Resolved issue with hit counter not updating correctly

## Known Issues
- Connection may fail on some 5GHz Wi-Fi networks
```

## Version Update Process

1. Determine the appropriate version number change based on the nature of updates
2. Update version numbers in:
   - `app.json` or `app.config.js` for Expo
   - `package.json`
   - Any other location where version is hardcoded
3. Generate a new build number based on current date and increment
4. Update the changelog with release notes
5. Tag the release in Git with the version number: `git tag -a v1.2.0 -m "Release v1.2.0"`
6. Build and submit the app to app stores

## Emergency Patch Process

For critical fixes that need to be released quickly:
1. Increment only the PATCH version
2. Focus release notes on the specific issues fixed
3. Follow abbreviated testing process focusing on the affected areas
4. Use expedited app store review process if available