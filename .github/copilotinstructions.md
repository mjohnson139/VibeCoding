# Development Rules for Spitball Mobile App

This document outlines the development rules and guidelines for the Spitball Mobile App project.

## Core Development Rules

1. **Feature Development Stages**
   - All features must go through the following stages:
     - **Idea**: Initial concept and requirements gathering
     - **Tinker**: Development and implementation phase
     - **Test**: Testing against specified test cases
     - **Release**: Deployment to users
     - **Monitor**: Observation of feature in production
     - **Refine**: Improvements based on feedback and monitoring

2. **Version Control**
   - All changes must be tracked through Git
   - Commit messages should be concise and accurate
   - Commit messages should be derived from summarization of prompts used to build the feature
   - Use feature branches for new development
   - Always update todo.md with completed tasks before committing

3. **Testing**
   - All features must have corresponding tests
   - Tests should run automatically when code changes are made
   - Async notifications should be sent with test results

4. **Code Style**
   - Use TypeScript for type safety
   - Follow React Native best practices
   - Components should be modular and reusable
   - Use functional components with hooks
   - Keep components small and focused on a single responsibility

5. **Documentation**
   - Update PRD document with any changes to requirements
   - Document complex logic with comments
   - Keep the TODO list updated
   - Document APIs and interfaces

6. **Performance**
   - Optimize rendering performance
   - Minimize bundle size
   - Be mindful of battery usage on mobile devices

7. **Security**
   - Follow security best practices
   - Don't store sensitive information in code
   - Use secure communication methods

8. **Peer Review**
   - All code should be reviewed before merging
   - Address feedback from reviews
   - Ensure tests pass before merging

## AI-Assisted Development Guidelines

1. When generating code with AI:
   - Review all generated code for correctness
   - Understand the implementation details
   - Test thoroughly to ensure functionality
   - Refactor as needed for maintainability
   - Ensure generated code follows project standards

2. Use AI efficiently:
   - Provide clear, detailed prompts
   - Break down complex tasks into smaller, manageable chunks
   - Iteratively refine AI-generated solutions
   - Use AI for repetitive boilerplate code