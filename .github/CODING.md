# Coding Conventions
- Cohesion is highly valued. Related code is always grouped together.
  - Tests are co-located with the code they test.
- Use named functions over arrow functions for defining root-level functions and components.
  - Arrow functions are preferred inside other functions.
- Always use named exports. Avoid default export for user-code.
- Keep the public API of a module small. Only export what is necessary to use and test the module.
  - Do not export React component props. Prefer to use `ComponentProps<typeof Component>` instead.
- Prefer `*List`-suffix for plural form on names for code constructs.
- Prefer TypeScript type aliases over interfaces for defining object shapes.
- Prefer `const` over `let`. Avoid `var`.
- Use `async/await` for asynchronous code. Avoid `.then()` and `.catch()`.
- Use template literals for string interpolation. Avoid string concatenation with `+`.
- Sort imports by name and in the following order groups:
  1. External libraries
  2. Internal modules (shared, core, features)
  3. Relative imports (../, ./)
- Always format code using Prettier. Run `npm run format`.