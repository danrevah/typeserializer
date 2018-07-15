import 'mocha';
import { expect } from 'chai';
import { Before } from './Before';
import { BeforeSymbol } from '../consts';

class Foo {
  @Before('1.2.0') prop = 'prop';

  prop2 = 'prop2';

  @Before('0.9.2') prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Before('')
    @Before('')
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Before', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(BeforeSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: '1.2.0',
      prop3: '0.9.2',
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Before decorator twice on property 'prop3' of class 'tmp'.");
  });
});
