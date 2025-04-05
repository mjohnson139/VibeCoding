# Versioning

## Numbers & Structure
- App version: `MAJOR.MINOR.PATCH` → `1.2.3`
- Build number: `YYYYMMDD.n` → `20250404.1` (today's first build)
- Android versionCode: `YYYYMMDD00n` → `20250404001`

## Update Locations
- `app.json`: {"expo": {"version": "1.0.0", "ios": {"buildNumber": "20250404.1"}}}
- `CHANGELOG.md`: Store release notes
- Git: `git tag -a v1.2.0 -m "Release v1.2.0"`

## Release Notes Format
```
# v1.2.0 (Build 20250404.1)
Improved spitball mechanics and connectivity.

- Added: Trajectory prediction, new sounds
- Fixed: Connection stability, targeting
- Known: Issues on 5GHz networks
```

## Display Version
```typescript
<Text>V{Constants.expoConfig.version} (B{Constants.expoConfig.ios.buildNumber})</Text>
```