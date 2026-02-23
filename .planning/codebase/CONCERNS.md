# Concerns & Technical Debt

## Stability
- **Bleeding Edge Dependencies**: The project uses very new versions of core libraries (Next.js 16, React 19, Tailwind 4). This may lead to compatibility issues with community packages or breaking changes in minor updates.

## Quality Assurance
- **Missing Tests**: No unit or integration tests exist. Refactoring or updating dependencies carries high risk of regression.

## Maintainability
- **Hardcoded Content**: Content appears to be hardcoded in components (e.g., tabs in `TabbedInterface.tsx`). Consider moving to a config file or CMS if content grows.
