# Contribution guidelines

In order to contribute to the project, one should respect the following rules.
Keep in mind that these guidelines are primarly made for the core contributors
but should also be applied to external pull requests.

## Adding new features

- When adding a new feature, it MUST be done in a branch
```
git branch new_branch_name
```

- Any addition or change MUST be tested. The tests should be included in the
regular `npm test` command. We are not looking for a 100% code coverage. However
our tests are mandatory because they provide some usage examples, and highlight
the logic that need to be preserved in futur changes.

- Any addition or change MUST be documented. The documentation is in `/doc` and
is written in markdown. The regular `npm run generate-doc` should not break.

## Releases

We're not this far in the project ! Be patient :)
