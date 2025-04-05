# Code Review Instructions

When reviewing code for the Spitball Mobile App, please focus on the following aspects:

## Functionality

- Does the code correctly implement the feature as described in the PRD?
- Does it follow the feature development stages (idea, tinker, test, release, monitor, refine)?
- Are edge cases handled appropriately?
- Is there proper error handling?

## Code Quality

- Does the code follow TypeScript/React Native best practices?
- Are components modular and reusable?
- Are functions small and focused on a single responsibility?
- Is the code DRY (Don't Repeat Yourself)?
- Is there proper type safety implementation?

## Performance

- Are there any obvious performance bottlenecks?
- Is rendering optimized (e.g., memoization where appropriate)?
- Are expensive operations properly managed?
- Is battery usage considered (especially for sensor usage)?

## Security

- Are there any security vulnerabilities?
- Is sensitive data properly protected?
- Is user input validated and sanitized?
- Are peer-to-peer connections properly secured?

## Testing

- Does the code include appropriate tests?
- Do the tests cover the main functionality?
- Do the tests include edge cases?
- Can the tests be run automatically?

## Documentation

- Is the code well-commented where necessary?
- Are complex algorithms or business logic explained?
- Are the PRD and todo list updated appropriately?
- Is there clear documentation for APIs and interfaces?

## Spitball-Specific Concerns

- For WebSocket connections: Is connection handling robust?
- For QR code functionality: Is the display clear and information secure?
- For 3D rendering: Is the implementation performant on mobile devices?
- For motion controls: Is device sensor data used efficiently?

## Feedback Format

When providing feedback, please:
1. Start with positive aspects of the implementation
2. Group related concerns
3. Provide specific suggestions for improvement
4. Distinguish between critical issues and minor improvements
5. Reference relevant documentation or examples when helpful