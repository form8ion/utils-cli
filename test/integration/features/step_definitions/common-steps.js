import {resolve} from 'path';

import {After, Before, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';
import importFresh from 'import-fresh';
import clearModule from 'clear-module';
import stubbedFs from 'mock-fs';
import td from 'testdouble';

import {World} from '../support/world';
import {githubToken} from './vcs/github-api-steps';

let action, javascriptQuestionNames, projectQuestionNames;
const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
export const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

export const projectNameAnswer = 'project-name';
export const projectDescriptionAnswer = 'some project description';

setWorldConstructor(World);

Before(async function () {
  this.githubUser = any.word();
  this.repoName = projectNameAnswer;
  this.repoOwner = 'form8ion';

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  require('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('execa');
  this.nodegit = td.replace('@form8ion/nodegit-wrapper');

  ({questionNames: projectQuestionNames} = importFresh('@form8ion/project'));
  ({questionNames: javascriptQuestionNames} = importFresh('@form8ion/javascript'));
  action = importFresh('../../../../src/commands/scaffold/command').handler;
});

After(function () {
  stubbedFs.restore();
  td.reset();

  clearModule('@form8ion/javascript');
  clearModule('@form8ion/lift-javascript');
  clearModule('@form8ion/javascript-core');
  clearModule('@form8ion/replace-travis-ci-with-github-action');
  clearModule('travis-token-updater');
  clearModule('@form8ion/husky');
  clearModule('@form8ion/project');
  clearModule('execa');
  clearModule('../../../../src/commands/scaffold/command');
});

When(/^the project is scaffolded$/, async function () {
  this.visibility = any.fromList(['Public', 'Private']);
  const {projectTypes} = require('@form8ion/javascript-core');
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);
  const jsProjectType = this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE) || projectTypes.PACKAGE;
  const shouldBeScoped = any.boolean();
  const scope = shouldBeScoped || 'Private' === this.visibility ? any.word() : undefined;

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine github.com\n  login ${githubToken}`,
    [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  await action({
    [projectQuestionNames.PROJECT_NAME]: projectNameAnswer,
    [projectQuestionNames.DESCRIPTION]: projectDescriptionAnswer,
    [projectQuestionNames.VISIBILITY]: this.visibility,
    ...'Public' === this.visibility && {
      [projectQuestionNames.LICENSE]: 'MIT',
      [projectQuestionNames.COPYRIGHT_YEAR]: 2000
    },
    ...'Private' === this.visibility && {[projectQuestionNames.UNLICENSED]: true},
    [projectQuestionNames.GIT_REPO]: repoShouldBeCreated,
    [projectQuestionNames.PROJECT_LANGUAGE]: projectLanguage,
    ...'JavaScript' === projectLanguage && {
      [javascriptQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [javascriptQuestionNames.PROJECT_TYPE]: jsProjectType,
      [javascriptQuestionNames.UNIT_TESTS]: true,
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.CONFIGURE_LINTING]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: 'Other',
      ...projectTypes.PACKAGE === jsProjectType && {
        [javascriptQuestionNames.PACKAGE_BUNDLER]: this.getAnswerFor(javascriptQuestionNames.PACKAGE_BUNDLER),
        [javascriptQuestionNames.PROVIDE_EXAMPLE]: true
      },
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
      [javascriptQuestionNames.SCOPE]: scope,
      [javascriptQuestionNames.DIALECT]: this.dialect
    }
  });
});
