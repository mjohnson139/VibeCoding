# Expo Development Rules

## Feature Lifecycle
idea → tinker → test → release → monitor → refine

## Core Rules
- Update todo.md before each commit [REQUIRED]
- Use TypeScript for all new code
- Create tests for all features
- Follow React Native performance best practices
- Ensure mobile battery efficiency
- Always prefer simple solutions
- Avoid duplication of code whenever possible
- Write code that takes into account different environments: dev, test, and prod
- Keep the codebase very clean and organized
- Focus on areas of code relevant to the task
- Do not touch code that is unrelated to the task
- Write thorough tests for all major functionality

## Development Workflow
- After making changes, ALWAYS start up a new server for testing
- Avoid writing scripts in files if possible, especially if run only once
- Keep files under 200-300 lines of code; refactor at that point
- Never mock data for dev or prod environments (only for tests)
- Never add stubbing or fake data patterns that affect dev or prod
- Never overwrite .env files without explicit confirmation
- Always consider what other methods and areas might be affected by changes

## Component Structure
- Use functional components with hooks
- Keep components <150 lines
- Create reusable components in `/components`
- Define types/interfaces in separate files
- Use Context API for global state

## Code Evolution
- Always look for existing code to iterate on instead of creating new code
- Do not drastically change patterns before trying to iterate on existing ones
- Only make changes that are requested or well understood and related to the request
- When fixing issues, exhaust all options with existing implementations before introducing new patterns
- If introducing new patterns, remove old implementations to avoid duplicate logic
- Avoid making major architectural changes to working features unless explicitly instructed

## Expo Best Practices
- Use Expo SDK APIs over native modules when available
- Implement responsive layouts with `Dimensions` API
- Optimize images using Expo's asset system
- Use `expo-constants` for environment config
- Prefer `expo-font` for custom typography
- Leverage `expo-updates` for OTA updates

## React Native Patterns
- Use React Navigation for routing
- Implement optimistic UI updates
- Handle offline states gracefully
- Implement proper keyboard handling
- Use proper error boundaries

## Performance Guidelines
- Memoize expensive components with React.memo()
- Use useCallback() for functions passed to children
- Virtualize long lists with FlatList
- Implement proper loading states
- Optimize re-renders with useMemo()

## Testing Standards
- Write unit tests for utils and hooks
- Test components with React Testing Library
- Implement E2E tests for critical flows