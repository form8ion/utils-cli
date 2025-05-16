import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import {questionNames as liftQuestionNames} from '@form8ion/lift';
import {promptConstants as githubPromptConstants} from '@form8ion/github';

import {After, Before, Given, setWorldConstructor, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';

import {World} from '../support/world.js';
import {githubToken} from './vcs/github-steps.js';

let scaffold, lift, javascriptQuestionNames, projectQuestionNames;
const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle
const pathToNodeModules = [__dirname, '../../../../', 'node_modules/'];
export const stubbedNodeModules = stubbedFs.load(resolve(...pathToNodeModules));

export const projectNameAnswer = 'project-name';
export const projectDescriptionAnswer = 'some project description';

setWorldConstructor(World);

Before(async function () {
  this.githubUser = any.word();
  this.repoName = projectNameAnswer;
  this.projectName = projectNameAnswer;
  this.repoOwner = 'form8ion';
  this.visibility = any.fromList(['Public', 'Private']);
  this.projectRoot = process.cwd();

  ({execa: this.execa} = (await td.replaceEsm('execa')));
  this.git = await td.replaceEsm('simple-git');

  ({questionNames: projectQuestionNames} = await import('@form8ion/project'));
  ({questionNames: javascriptQuestionNames} = await import('@form8ion/javascript'));
  ({handler: scaffold} = (await import('../../../../src/commands/scaffold/command.js')));
  ({handler: lift} = (await import('../../../../src/commands/lift/command.js')));
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

Given('the {string} scaffolder is chosen', async function (scaffolder) {
  this.chosenScaffolder = scaffolder;
});

When(/^the project is scaffolded$/, async function () {
  const {projectTypes} = await import('@form8ion/javascript-core');
  const repoShouldBeCreated = this.getAnswerFor(projectQuestionNames.GIT_REPO);
  const projectLanguage = this.getAnswerFor(projectQuestionNames.PROJECT_LANGUAGE);
  const jsProjectType = this.getAnswerFor(javascriptQuestionNames.PROJECT_TYPE) || projectTypes.PACKAGE;
  const shouldBeScoped = any.boolean();

  stubbedFs({
    [`${process.env.HOME}/.netrc`]: `machine api.github.com\n  login ${githubToken}`,
    node_modules: stubbedNodeModules
  });

  await scaffold({
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
      [javascriptQuestionNames.UNIT_TEST_FRAMEWORK]: this.unitTestFramework
        || 'mocha',
      [javascriptQuestionNames.INTEGRATION_TESTS]: true,
      [javascriptQuestionNames.CI_SERVICE]: 'Travis',
      [javascriptQuestionNames.CONFIGURE_LINTING]: true,
      [javascriptQuestionNames.PROJECT_TYPE_CHOICE]: this.projectTypePlugin || 'Other',
      ...projectTypes.PACKAGE === jsProjectType && {
        [javascriptQuestionNames.PACKAGE_BUNDLER]: this.getAnswerFor(javascriptQuestionNames.PACKAGE_BUNDLER),
        [javascriptQuestionNames.PROVIDE_EXAMPLE]: true
      },
      [javascriptQuestionNames.SHOULD_BE_SCOPED]: shouldBeScoped,
      [javascriptQuestionNames.DIALECT]: this.dialect
    }
  });
});

When('the project is lifted', async function () {
  this.existingGitIgnores = any.listOf(any.word);
  const {
    [githubPromptConstants.ids.REQUIRED_CHECK_BYPASS]: requiredCheckBypassPromptQuestionNames
  } = githubPromptConstants.questionNames;

  stubbedFs({
    node_modules: stubbedNodeModules,
    'README.md': '',
    '.gitignore': this.existingGitIgnores.join(os.EOL),
    ...'JetBrains' === this.editor && {'.idea': {}}
  });

  await lift({
    decisions: {
      [liftQuestionNames.SCAFFOLDER]: this.chosenScaffolder,
      [requiredCheckBypassPromptQuestionNames.CHECK_BYPASS_TEAM]: any.integer()
    }
  });
});
