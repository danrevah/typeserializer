import 'mocha';
import { expect } from 'chai';
import { Groups } from './Groups';
import { GroupsSymbol } from '../consts';

class Foo {
  @Groups(['user', 'admin'])
  prop = 'prop';

  prop2 = 'prop2';

  @Groups(['admin'])
  prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Groups([''])
    @Groups([''])
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Groups', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(GroupsSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: ['user', 'admin'],
      prop3: ['admin'],
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Groups decorator twice on property 'prop3' of class 'tmp'.");
  });
});
