import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';

import {World} from '../support/world.js';
import {githubToken} from './vcs/github-api-steps.js';

let action, javascriptQuestionNames, projectQuestionNames;
const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle
const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
export const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

export const projectNameAnswer = 'project-name';
export const projectDescriptionAnswer = 'some project description';

setWorldConstructor(World);

Before(async function () {
  this.githubUser = any.word();
  this.repoName = projectNameAnswer;
  this.repoOwner = 'form8ion';
  this.visibility = any.fromList(['Public', 'Private']);

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  await import('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies
  await import('color-convert'); // eslint-disable-line import/no-extraneous-dependencies

  ({default: this.execa} = (await td.replaceEsm('@form8ion/execa-wrapper')));
  this.git = await td.replaceEsm('simple-git');

  ({questionNames: projectQuestionNames} = await import('@form8ion/project'));
  ({questionNames: javascriptQuestionNames} = await import('@form8ion/javascript'));
  ({handler: action} = (await import('../../../../src/commands/scaffold/command.js')));
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When(/^the project is scaffolded$/, async function () {
  const {projectTypes} = await import('@form8ion/javascript-core');
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
      [javascriptQuestionNames.UNIT_TEST_FRAMEWORK]: 'mocha',
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
