import {promises as fs} from 'node:fs';
import {StatusCodes} from 'http-status-codes';
import deepEqual from 'deep-equal';
import {load} from 'js-yaml';

import {After, AfterAll, BeforeAll, Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {assert} from 'chai';

export const githubToken = any.word();

const server = setupServer();

server.events.on('request:start', ({request}) => {
  // eslint-disable-next-line no-console
  console.log('Outgoing:', request.method, request.url);
});

function authorizationHeaderIncludesToken(request) {
  return request.headers.get('authorization') === `token ${githubToken}`;
}

BeforeAll(async () => {
  server.listen();
});

After(function () {
  server.resetHandlers();
});

AfterAll(() => {
  server.close();
});

Given(/^the GitHub token is valid$/, async function () {
  this.repoSshUrl = any.url();
  this.nextStepsFiledOnGithub = [];

  server.use(
    http.get(`https://api.github.com/repos/form8ion/${this.projectName}`, ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return new HttpResponse(null, {status: StatusCodes.NOT_FOUND});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    }),
    http.post('https://api.github.com/orgs/form8ion/repos', async ({request}) => {
      if (
        authorizationHeaderIncludesToken(request)
        && deepEqual(await request.json(), {name: this.projectName, private: 'Private' === this.visibility})
      ) {
        return HttpResponse.json({
          ssh_url: this.repoSshUrl,
          html_url: any.url()
        });
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    }),
    http.get('https://api.github.com/search/issues', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({items: []});
      }

      return undefined;
    }),
    http.post(`https://api.github.com/repos/form8ion/${this.projectName}/issues`, async ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        this.nextStepsFiledOnGithub.push(await request.json());

        return HttpResponse.json({
          ssh_url: any.url(),
          html_url: any.url()
        });
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    }),
    http.get('https://api.github.com/user', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({login: this.githubUser});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    }),
    http.get('https://api.github.com/user/orgs', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([
          ...any.listOf(() => ({login: any.word(), id: any.integer()})),
          {login: 'form8ion', id: 49035156},
          ...any.listOf(() => ({login: any.word(), id: any.integer()}))
        ]);
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    }),
    http.get('https://api.github.com/orgs/form8ion/teams', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([{name: 'maintainers', slug: 'maintainers', id: 3208999}]);
      }

      return undefined;
    })
  );
});

Then('next-steps are added as issues on GitHub', async function () {
  assert.deepEqual(
    this.nextStepsFiledOnGithub,
    [
      {
        title: 'Add the appropriate `save` flag to the installation instructions in the README',
        body: '<!-- '
          + 'octokit-unique-issue id="add-the-appropriate-save-flag-to-the-installation-instructions-in-the-readme" -->'
      },
      {
        title: 'Define supported node.js versions as `engines.node` in the `package.json` file',
        body: '<!-- '
          + 'octokit-unique-issue id="define-supported-node-js-versions-as-engines-node-in-the-package-json-file" -->'
      },
      {
        title: 'Publish pre-release versions to npm until package is stable enough to publish v1.0.0',
        body: '<!-- octokit-unique-issue id='
          + '"publish-pre-release-versions-to-npm-until-package-is-stable-enough-to-publish-v-1-0-0" -->'
      },
      {
        title: 'Remove the canary test for mocha once more valuable tests exist',
        body: '<!-- octokit-unique-issue id="remove-the-canary-test-for-mocha-once-more-valuable-tests-exist" -->'
      },
      {
        title: 'Decide if the default renovate config is appropriate,'
          + ' or if one of the :js-app or :js-package version are a better fit',
        body: '<!-- '
          + 'octokit-unique-issue id="decide-if-the-default-renovate-config-is-appropriate-'
          + 'or-if-one-of-the-js-app-or-js-package-version-are-a-better-fit" -->'
      },
      {title: 'Commit scaffolded files', body: '<!-- octokit-unique-issue id="commit-scaffolded-files" -->'},
      {
        title: 'Set local `master` branch to track upstream `origin/master`',
        body: '<!-- octokit-unique-issue id="set-local-master-branch-to-track-upstream-origin-master" -->'
      }
    ]
  );
});

Then('github is configured', async function () {
  const repositorySettings = load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`));

  assert.equal(repositorySettings.repository.homepage, 'https://npm.im/@form8ion/project-name');
  assert.equal(
    repositorySettings.rulesets.find(rule => 'verification must pass' === rule.name).bypass_actors[0].actor_id,
    3208999
  );
});
