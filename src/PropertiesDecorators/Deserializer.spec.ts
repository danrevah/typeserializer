import 'mocha';
import { expect } from 'chai';
import { Deserializer } from './Deserializer';
import { DeserializerSymbol } from '../consts';

class Foo {
  @Deserializer(() => true)
  prop = 'prop';
  prop2 = 'prop2';
  prop3 = 'prop3';
}

/* istanbul ignore next */
function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Deserializer(() => true)
    @Deserializer(() => true)
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Deserializer', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(DeserializerSymbol, foo);

    expect(metadata.prop).to.be.instanceof(Function);
    expect(metadata.prop()).to.be.true;
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Deserializer decorator twice on property 'prop3' of class 'tmp'.");
  });
});
