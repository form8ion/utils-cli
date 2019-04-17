import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import {javascript} from '../../../src/enhanced-scaffolders';

suite('enhanced scaffolders', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js scaffolder', async () => {
    const options = any.simpleObject();
    const output = any.simpleObject();
    javascriptScaffolder.scaffold
      .withArgs({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForJavaScript, public: true}}})
      .resolves(output);

    assert.equal(await javascript(options), output);
  });
});
