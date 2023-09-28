# cli

cli for various tools for the organization

<!--status-badges start -->

[![Codecov][coverage-badge]][coverage-link]
[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Usage

<!--consumer-badges start -->

[![npm][npm-badge]][npm-link]
[![MIT license][license-badge]][license-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/utils-cli --global
```

### Commands

#### `scaffold`

Scaffolds a new project

```sh
$ form8ion-utils scaffold
```

#### `lift`

Lifts an existing project by configuring new functionality

```sh
$ form8ion-utils lift
```

#### `travis-tokens`

Roll the `NPM_TOKEN` or `GH_TOKEN` across multiple repositories

```sh
$ form8ion-utils travis-tokens
```

Find additional details for this command in the [travis-token-updater](https://github.com/travis-token-updater)
repository

## Contributing

<!--contribution-badges start -->

[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![PRs Welcome][PRs-badge]][PRs-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Executing Locally Without Bundling

```sh
$ npx babel-node src/index.js <command>
```

### Verification

```sh
$ npm test
```

[npm-link]: https://www.npmjs.com/package/@form8ion/utils-cli

[npm-badge]: https://img.shields.io/npm/v/@form8ion/utils-cli?logo=npm

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/utils-cli.svg

[coverage-link]: https://codecov.io/github/form8ion/utils-cli

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/utils-cli?logo=codecov

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/utils-cli/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/utils-cli/node-ci.yml.svg?branch=master&logo=github

[node-badge]: https://img.shields.io/node/v/@form8ion/utils-cli?logo=node.js

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
