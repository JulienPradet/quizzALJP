# Folders

## Global architecture

  - `assets` additional assets (such as .less files)
  - `dist` compiled code only
  - `doc` full documentation in .md files
  - `node_modules` project dependencies only
  - `src` global source code
    - `client` files only relevant for the client
    - `common` files that could run on both client and server
    - `server` files only relevant for the server
  - `test` tests for the quizz codebase. Test files should end by .test.js in
  order to make the difference with mock files. The folder architecture must match the same folder architecture as `src`.
  - `views` hosts the .ejs views

## Adding new features

When one wants to add a new feature, it should be as decoupled as possible. Thus
try to create new sub folders in order to add your features, and expose as
little API as possible, in order to ease tests, comprehension, and refactoring.
