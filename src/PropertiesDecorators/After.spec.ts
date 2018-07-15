import 'mocha';
import { expect } from 'chai';
import { After } from './After';
import { AfterSymbol } from '../consts';

class Foo {
  @After('1.2.0') prop = 'prop';

  prop2 = 'prop2';

  @After('0.9.2') prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @After('')
    @After('')
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('After', () => {
  it('should add metadata to the object after list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(AfterSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: '1.2.0',
      prop3: '0.9.2',
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @After decorator twice on property 'prop3' of class 'tmp'.");
  });
});
