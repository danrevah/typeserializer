import 'mocha';
import { expect } from 'chai';
import { Type } from './Type';
import { TypeSymbol } from '../consts';

class Foo {
  @Type(Foo) prop = 'prop';

  prop2 = 'prop2';

  @Type(Foo) prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Type(Foo)
    @Type(Foo)
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Type', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(TypeSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: Foo,
      prop3: Foo,
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Type decorator twice on property 'prop3' of class 'tmp'.");
  });
});
