import {After, Before, Given} from '@cucumber/cucumber';
import any from '@travi/any';
import nock from 'nock';
import {StatusCodes} from 'http-status-codes';

let githubScope;
export const githubToken = any.word();

Before(async () => {
  nock.disableNetConnect();

  githubScope = nock('https://api.github.com/');
});

After(() => {
  nock.enableNetConnect();
  nock.cleanAll();
});

Given(/^the GitHub token is valid$/, async function () {
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .post('/user/repos')
    .reply(StatusCodes.OK, {
      ssh_url: any.url(),
      html_url: any.url()
    });
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .get(`/users/${this.githubUser}/repos`)
    .reply(StatusCodes.OK, []);
  githubScope
    .matchHeader('Authorization', `token ${githubToken}`)
    .get('/user')
    .reply(StatusCodes.OK, {login: this.githubUser});
});
