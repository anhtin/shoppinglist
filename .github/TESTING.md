# Testing
Tests are written using vitest-browser-react. They are run using vitest in
browser mode with playwright as the provider. The main focus lies on feature
tests. Component and unit tests are only written for complex logic that is not
covered by feature tests. Mocks are avoided whenever possible.

Feature tests that covers multiple sub-features should reside in the parent
feature's test file, e.g. `ParentFeature.test.tsx`. Feature tests that are
isolated to a sub-feature should be reside in the sub-feature's test file, e.g.
`SubFeature.test.tsx`. Component and unit tests should also reside in the
component's or unit's test file, e.g. `SomeComponentOrUnit.test.tsx`.

Test data are always generated using custom factory functions with optional
parameters for each top-level property. These factory functions reside in the
same test files where they are used or in a co-located `testUtils.ts` file. If
property value is specified, then the factory function should generate the
object with that value. Otherwise, the factory function should fallback to a
property value that is most sensible for the majority of cases.

Test cases are written in a BDD style using the `describe` and `test` functions.
The test code is written in the Arrange-Act-Assert pattern. A feature test might
look like this:
```ts
describe("Feature: <feature name>", () => {
  test("Scenario: <scenario description>", () => {
    /**
      * GIVEN <context>
      * WHEN <action>
      * THEN <expected outcome>
      */
    // Arrange
    // Act
    // Assert
  });

  test("Scenario: <different scenario description>", () => {
    /**
      * GIVEN <different context>
      * WHEN <different action>
      * THEN <different expected outcome>
      */
    // Arrange
    // Act
    // Assert
  });
});
```

The act part of a feature test should only render components or simulate user
interaction. The part should never invoke a function (e.g. a store action) as if
the user would do it themselves.