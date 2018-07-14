
import 'mocha';
import {expect} from 'chai';
import {Strategy} from './Strategy';
import {ExclusionPolicy, StrategySymbol} from '../consts';

@Strategy(ExclusionPolicy.ALL)
class User {

}

function createClass() {
  @Strategy(ExclusionPolicy.ALL)
  @Strategy(ExclusionPolicy.ALL)
  class tmp {

  }

  return tmp;
}

describe('Strategy', () => {

  it('should have exclusion strategy on object', () => {
    const user = new User();
    const strategy = Reflect.getMetadata(StrategySymbol, user.constructor);

    expect(strategy).to.equal(ExclusionPolicy.ALL);
  });

  it('should not apply strategy decorator twice', () => {
    expect(createClass).to.throw('Cannot apply @Strategy decorator twice on class \'tmp\'.');
  });

});
