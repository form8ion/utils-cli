import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as scaffoldCommand from '../../src/commands/scaffold';
import * as travisTokensCommand from '../../src/commands/travis-tokens';
import cli from '../../src/cli';

suite('cli', () => {
  test('that the scaffolder is defined as a command', () => {
    const scriptName = sinon.stub();
    const usage = sinon.stub();
    const help = sinon.stub();
    const alias = sinon.stub();
    const command = sinon.stub();
    const command2 = sinon.stub();
    const demandCommand = sinon.stub();
    const argv = any.simpleObject();
    scriptName.withArgs('form8ion-utils').returns({usage});
    usage.withArgs('Usage: $0 <cmd> [args]').returns({command});
    command.withArgs(travisTokensCommand).returns({command: command2});
    command2.withArgs(scaffoldCommand).returns({demandCommand});
    demandCommand.withArgs(1, 'You need at least one command before moving on').returns({help});
    help.withArgs('h').returns({alias});
    alias.withArgs('h', 'help').returns({argv});

    assert.equal(cli({scriptName}), argv);
  });
});
