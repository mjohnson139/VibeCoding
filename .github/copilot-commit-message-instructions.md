# Commit Message Guidelines

## Pre-Commit Steps
1. `git status` → Review changed files
2. Update todo.md → Mark completed tasks [x]
3. For releases → Update build number in app.json + CHANGELOG.md

## Format: `type(scope): summary`

## Types
feat: Feature | fix: Bug fix | docs: Documentation
refactor: Code restructuring | style: Formatting
test: Tests | perf: Performance | chore: Maintenance

## Scope Examples
- Feature area: `qrcode`, `websocket`, `3dscene`
- Stage transition: `idea->tinker`, `tinker->test`
- Version: `v1.2.0`

## Guidelines for Humans & Copilot
- Imperative mood: "add" not "added"
- Summary: < 50 chars, no period
- Body: Explain what & why
- Use recent prompts/chat to summarize changes
- Include motivation for changes
- Reference relevant issues: "Fixes #123"
- Always update todo.md before committing
- Release format: `chore(release): bump to 1.2.0`

## Examples
```
feat(qrcode/tinker): implement QR code generation

Generate QR codes with local IP/port for WebSocket.
Used react-native-qrcode-svg per requirements.
```

```
chore(release): bump to 1.2.0

Build: 20250404.1
Added QR code and WebSocket connection features.
```