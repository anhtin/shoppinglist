This is a SPA built using React and TypeScript.

# Project Structure
The project is structured using a vertical slice architecture with each slice,
or feature, residing in its own folder under `src/features`. Each feature is
self-contained, including its own components, hooks, and state management logic.
A feature might also include nested sub-features. Generic components and
utilities are located under the `src/shared` folder. Cross-cutting features
reside in the `src/core` folder.

# Agent Instructions
- Read the `README.md` file in each feature folder when you work on the feature.
- Always write tests for new or changed features.
  - Modify existing tests to accommodate changes if necessary.
- Read the `.github/TESTING.md` file whenever you write or modify tests.
- Read the `.github/CODING.md` file whenever you write or modify code.
- Read the `.github/TECHNOLOGY.md` file whenever you need a third-party library