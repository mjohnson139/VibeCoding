# Commit Message Instructions

## Commit Message Structure

```
<type>(<scope>): <summary>

<body>

<footer>
```

## Elements

1. **Type**: Describes the kind of change
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Changes that don't affect code (formatting, etc.)
   - `refactor`: Code change that neither fixes a bug nor adds a feature
   - `perf`: Code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `build`: Changes that affect the build system
   - `chore`: Other changes that don't modify src or test files

2. **Scope**: (Optional) The feature, module, or component affected
   - Examples: `qrcode`, `websocket`, `3dscene`, `auth`, etc.

3. **Summary**: Brief description of the change
   - Use imperative, present tense: "change" not "changed" or "changes"
   - Don't capitalize the first letter
   - No period at the end
   - Keep it under 50 characters when possible
   - Should complete the sentence: "If applied, this commit will..."

4. **Body**: (Optional) More detailed description
   - Use imperative, present tense
   - Include motivation for the change
   - Explain changes in more detail

5. **Footer**: (Optional) References to issues, PRs, or breaking changes
   - Reference issues: `Fixes #123` or `Relates to #456`
   - Breaking changes: Start with `BREAKING CHANGE:`

## Vibe Coding Specific Conventions

- Include the feature stage in the scope: `feat(idea->tinker)`, `feat(tinker->test)`
- Summarize the prompts used to build the feature
- For version-related commits, include version tag: `feat(v1.2.0): ...`

## Example

```
feat(qrcode/tinker): implement QR code generation for WebSocket connection

Generate QR codes containing local IP address and port number.
Used react-native-qrcode-svg for rendering.

Completes first part of the peer connection feature.
```