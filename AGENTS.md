# AGENTS.md: AI Agent Guide for `@form8ion/utils-cli`

## Executive Summary

This package is a __thin CLI adapter__ over the form8ion project ecosystem.
It wires opinionated defaults into `@form8ion/project`, `@form8ion/lift`,
and ecosystem plugins so the `form8ion-utils` commands scaffold and lift
projects with the conventions used by the form8ion organization.
Most behavior should stay in upstream packages.
This repository should primarily compose plugins, prompts, and reporting.

---

## Architecture Overview

### Command Flow

1. __Entry point__ (`src/index.js`) boots the CLI and update notifier.
1. __CLI wiring__ (`src/cli.js`) registers the available yargs commands.
1. __Scaffold command__ (`src/commands/scaffold/command.js`) delegates to
   `@form8ion/project`.
1. __Lift command__ (`src/commands/lift/command.js`) delegates to
   `@form8ion/lift`.
1. __Shared command helpers__ under `src/commands/common/` define the plugin
   graph and prompt behavior that tailor upstream packages to form8ion needs.

### Relationship to Upstream Packages

This repository sits above the core orchestration packages.

* `@form8ion/project` owns the primary scaffold flow, prompt registry, and
  most project-level orchestration semantics.
* `@form8ion/javascript` owns JavaScript-language scaffolding, testing, and
  package-level plugin composition.
* This CLI should reuse those contracts rather than reimplementing them.
* When behavior belongs to project orchestration or language-plugin logic,
  prefer changing the upstream package instead of adding bespoke logic here.

### Repository Purpose and Boundaries

The main responsibilities here are:

* registering commands
* composing plugin collections
* pre-answering organization-specific prompts
* enhancing upstream plugins with injected defaults or wrappers
* reporting results to the terminal

Avoid moving domain logic from `@form8ion/project` or
`@form8ion/javascript` into this package unless the behavior is truly
CLI-specific.

---

## File Structure and Composition Pattern

### Important Directories

* `src/index.js` boots the executable entry.
* `src/cli.js` defines the yargs command surface.
* `src/commands/scaffold/` contains the scaffold command and prompt adapter.
* `src/commands/lift/` contains the lift command and lift-specific enhancers.
* `src/commands/common/` contains shared plugin factories, prompt handlers,
  and framework maps.
* `test/integration/features/` contains end-to-end Cucumber scenarios.

### Composition Pattern

Most files in this repository should do one of these things:

* delegate to an upstream package
* adapt dependency injection
* add form8ion defaults
* combine multiple upstream plugins into a single CLI experience

Examples in the current codebase:

* `src/commands/common/enhanced-plugins.js` wraps
  `@form8ion/javascript` and `@form8ion/github`.
* `src/commands/scaffold/prompts.js` answers selected
  `@form8ion/project` prompts with organization defaults.
* `src/commands/common/prompts.js` answers selected `@form8ion/github`
  prompts with organization-specific choices.

Keep these adapters small.
If they start owning workflow policy or feature logic, that is usually a sign
the change belongs upstream.

---

## Prompt and Plugin Wiring Patterns

### Prompt Ownership

Prompt IDs and question-name registries are owned by the upstream package that
defines the prompt.

* `@form8ion/project` owns project scaffold prompt IDs and question names.
* `@form8ion/github` owns GitHub-related prompt IDs and question names.
* `@form8ion/javascript` owns JavaScript prompt questions and answer keys.

This repository should consume those public contracts.
Do not duplicate prompt constants locally unless there is no upstream export.

### Prompt Consumer Pattern

When adapting prompt behavior:

* destructure `ids` and `questionNames` from the upstream `promptConstants`
* switch on `id`
* answer only the prompts this CLI intentionally owns
* delegate other interactive prompts through the existing prompt utility when
  appropriate
* throw on unknown prompt IDs rather than silently swallowing them

Reference implementations:

* `src/commands/scaffold/prompts.js`
* `src/commands/common/prompts.js`

### Plugin Composition Pattern

Plugin collections should stay aligned with upstream plugin contracts.

* project-level plugin groups should match what `@form8ion/project` expects
  (`languages`, `vcsHosts`, `ciProviders`, `dependencyUpdaters`,
  `coverageServices`, and similar upstream groupings)
* JavaScript plugin groups should match what `@form8ion/javascript` expects
  (`applicationTypes`, `packageTypes`, `unitTestFrameworks`,
  `integrationTestFrameworks`, `packageBundlers`, and similar)
* enhanced plugin factories should preserve upstream exports and only override
  the conventions intentionally customized by this CLI

For example, `javascriptPluginFactory()` currently preserves the upstream
plugin surface while injecting form8ion defaults and enhanced scaffold/lift
implementations.

---

## Source Conventions

Follow the conventions already established by the upstream form8ion packages.

* Use ESM only.
* Prefer named functions for default exports.
* Keep source files focused and compositional.
* Reuse upstream helpers and constants instead of duplicating strings.
* Keep imports in two groups for source files and three groups for test files,
  matching nearby files.

Because this package is composition-heavy, clarity of boundaries matters more
than clever abstractions.
Prefer direct object composition over indirection when wiring plugins.

---

## Testing and Verification

Behavior changes require tests.
Match the testing approach used by the upstream beta branches:

1. define the integration scenario first when behavior changes externally
1. drive internal implementation with colocated unit tests
1. keep adapters thin and verify the exact upstream contract they are shaping

### Test Layout

* unit tests live beside implementation as `*.test.js`
* integration tests live under `test/integration/features/`
* integration scenarios exercise the CLI flow directly against source files
  (no build step required)

### Useful Commands

Run `nvm use` before npm commands.

```bash
nvm use
npm run test:unit:base
npm run test:integration
npm test
```

`npm test` is the full verification entry point for this repository.

---

## Change Guidance

### Prefer Upstream Changes When

* the project scaffold flow itself is wrong
* a prompt ID, question map, or prompt contract needs to change
* JavaScript plugin behavior is broadly incorrect
* a plugin contract should change for all consumers

### Change This Repository When

* the CLI should expose a different combination of existing plugins
* form8ion-specific defaults should be preselected
* result reporting or command wiring should change
* upstream plugins need CLI-local dependency injection or lightweight wrapping

### Avoid

* reimplementing upstream orchestration locally
* copying prompt constants or question keys into string literals
* introducing new architecture when existing composition patterns suffice
* moving domain logic into the CLI solely for convenience

---

## High-Value References

* `src/index.js`
* `src/cli.js`
* `src/commands/scaffold/command.js`
* `src/commands/scaffold/prompts.js`
* `src/commands/lift/command.js`
* `src/commands/common/plugins.js`
* `src/commands/common/enhanced-plugins.js`
* `src/commands/common/prompts.js`
* `test/integration/features/javascript/scaffold.feature`
* [form8ion/project `AGENTS.md`][project-agents] — `beta` branch (large
  refactor in progress there, not yet on `master`)
* [form8ion/project `copilot-instructions.md`][project-copilot] — `beta`
  branch
* [form8ion/javascript `copilot-instructions.md`][javascript-copilot] —
  `beta` branch

[project-agents]: https://github.com/form8ion/project/blob/beta/AGENTS.md

[project-copilot]: https://github.com/form8ion/project/blob/beta/.github/copilot-instructions.md

[javascript-copilot]: https://github.com/form8ion/javascript/blob/beta/.github/copilot-instructions.md
