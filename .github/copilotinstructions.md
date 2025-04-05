# Expo Development Rules

## Feature Lifecycle
idea → tinker → test → release → monitor → refine

## Core Rules
- Update todo.md before each commit [REQUIRED]
- Use TypeScript for all new code
- Create tests for all features
- Follow React Native performance best practices
- Ensure mobile battery efficiency

## Component Structure
- Use functional components with hooks
- Keep components <150 lines
- Create reusable components in `/components`
- Define types/interfaces in separate files
- Use Context API for global state

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