import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import cli from '../../src/cli';

suite('cli', () => {
  test('that the scaffolder is defined as a command', () => {
    const scriptName = sinon.stub();
    const usage = sinon.stub();
    const help = sinon.stub();
    const alias = sinon.stub();
    const argv = any.simpleObject();
    scriptName.withArgs('form8ion-utils').returns({usage});
    usage.withArgs('Usage: $0 <cmd> [args]').returns({help});
    help.withArgs('h').returns({alias});
    alias.withArgs('h', 'help').returns({argv});

    assert.equal(cli({scriptName}), argv);
  });
});
