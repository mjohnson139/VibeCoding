# Commit Message Conventions

This document outlines the conventions for creating commit messages in the Spitball Mobile App project.

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
   - `ci`: Changes to CI configuration files and scripts
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
   - Separate from summary with a blank line

5. **Footer**: (Optional) References to issues, PRs, or breaking changes
   - Reference issues: `Fixes #123` or `Relates to #456`
   - Breaking changes: Start with `BREAKING CHANGE:`
   - Separate from body with a blank line

## Vibe Coding Specific Conventions

1. **Prompt Summarization**
   - All commit messages should be derived from summarizing the prompts used to build the feature
   - Include the key requirements that guided the implementation

2. **Feature Stage Tracking**
   - Include the feature stage in the scope: `feat(idea->tinker)`, `feat(tinker->test)`
   - Example: `feat(qrcode/tinker->test): implement QR code generation`

3. **Version References**
   - Include version tag if the commit is part of a specific release: `feat(v1.2.0): ...`

## Examples

```
feat(qrcode): implement QR code generation for WebSocket connection

Generate QR codes containing local IP address and port number.
Used react-native-qrcode-svg for rendering.

Completes first part of the peer connection feature.
```

```
fix(websocket): resolve connection timeout on slow networks

Increased timeout threshold and added retry mechanism.
Added visual feedback during connection attempts.

Fixes #42
```

```
refactor(3dscene): switch from expo-three to react-three-fiber

Improved compatibility with latest Expo SDK.
Eliminated security vulnerabilities in outdated dependencies.
```

## Guidelines for Writing Good Commit Messages

1. **Be Specific**: Clearly communicate what changed and why
2. **Be Concise**: Aim for clarity with minimal words
3. **Be Consistent**: Follow the same format for all commits
4. **Be Informative**: Provide context for future readers
5. **Be Logical**: Each commit should be a logical unit of work