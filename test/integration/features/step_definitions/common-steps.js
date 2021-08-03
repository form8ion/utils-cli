import {promises} from 'fs';
import {resolve} from 'path';
import {After, Before, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';

import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {World} from '../support/world';
import {githubToken} from './vcs/github-api-steps';

let action,
  dialects,
  javascriptQuestionNames,
  projectQuestionNames;

const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];

export const projectNameAnswer = 'project-name';
export const projectDescriptionAnswer = 'some project description';

setWorldConstructor(World);

Before(async function () {
  this.githubUser = any.word();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  require('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('execa');
  ({questionNames: projectQuestionNames} = require('@form8ion/project'));
  ({questionNames: javascriptQuestionNames} = require('@travi/javascript-scaffolder'));
  ({dialects} = require('@form8ion/javascript-core'));
  action = require('../../../../src/commands/scaffold/command').handler;

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: {
      '@travi': {
        'javascript-scaffolder': {
          templates: {
            'rollup.config.js': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/javascript-scaffolder/templates/rollup.config.js'
            )),
            'example.mustache': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@travi/javascript-scaffolder/templates/example.mustache'
            ))
          }
        }
      },
      '@form8ion': {
        project: {
          templates: {
            'editorconfig.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@form8ion/project/templates/editorconfig.txt'
            )),
            'README.mustache': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@form8ion/project/templates/README.mustache'
            ))
          }
        },
        'mocha-scaffolder': {
          templates: {
            'canary-test.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@form8ion/mocha-scaffolder/templates/canary-test.txt'
            )),
            'mocha-setup.txt': await promises.readFile(resolve(
              ...pathToNodeModules,
              '@form8ion/mocha-scaffolder/templates/mocha-setup.txt'
            ))
          }
        }
      }
    }
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When(/^the project is scaffolded$/, async function () {
  const visibility = any.fromList(['Public', 'Private']);
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectType = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);
  const shouldBeScoped = any.boolean();
  const scope = shouldBeScoped || 'Private' === visibility ? any.word() : undefined;

  await action({
    [projectQuestionNames.PROJECT_NAME]: projectNameAnswer,
    [projectQuestionNames.DESCRIPTION]: projectDescriptionAnswer,
    [projectQuestionNames.VISIBILITY]: visibility,
    ...'Public' === visibility && {
      [projectQuestionNames.LICENSE]: 'MIT',
      [projectQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === visibility && {[projectQuestionNames.UNLICENSED]: true},
    [projectQuestionNames.GIT_REPO]: repoShouldBeCreated,
    [projectQuestionNames.PROJECT_LANGUAGE]: projectType,
    ...'JavaScript' === projectType && {
      [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [javascriptQuestionNames.PROJECT_TYPE]: 'Package',
      [javascriptQuestionNames.UNIT_TESTS]: true,
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.CONFIGURE_LINTING]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
      [javascriptQuestionNames.SCOPE]: scope,
      [javascriptQuestionNames.DIALECT]: dialects.BABEL
    }
  });
});
