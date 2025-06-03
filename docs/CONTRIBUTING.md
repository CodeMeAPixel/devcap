# Contributing to Developer Capitalist

Thank you for your interest in contributing to Developer Capitalist! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](/CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue using the bug report template and include:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior and actual behavior
- Screenshots if applicable
- Any relevant information about your environment

### Suggesting Features

We welcome feature suggestions! Create an issue using the feature request template and:
- Provide a clear description of the feature
- Explain why this feature would be beneficial
- Include any mock-ups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Pull Request Guidelines

- Update the README.md with details of changes if applicable
- Update the documentation when adding or changing functionality
- The PR should work in development environment
- Include tests for new features when possible
- Follow the existing code style and structure

## Development Setup

Follow the setup instructions in the main [documentation](/docs/README.md).

### Code Structure

- `/src/app`: Next.js app directory with routes and pages
- `/src/components`: React components
- `/src/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets

### Coding Standards

- Use TypeScript for type safety
- Follow ESLint rules (run `npm run lint` to check)
- Use named exports for better tree-shaking
- Use React hooks effectively
- Keep components focused on a single responsibility

## Testing

- Run existing tests with `npm test`
- Add tests for new functionality when applicable

## Documentation

- Update documentation when adding or changing features
- Keep code comments clear and useful
- Use JSDoc-style comments for functions

Thank you for contributing to Developer Capitalist!
