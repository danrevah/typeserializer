import 'mocha';
import { expect } from 'chai';
import { Serializer } from './Serializer';
import { SerializerSymbol } from '../consts';

class Foo {
  @Serializer(() => true)
  prop = 'prop';
  prop2 = 'prop2';
  prop3 = 'prop3';
}

/* istanbul ignore next */
function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Serializer(() => true)
    @Serializer(() => true)
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Serializer', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(SerializerSymbol, foo);

    expect(metadata.prop).to.be.instanceof(Function);
    expect(metadata.prop()).to.be.true;
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Serializer decorator twice on property 'prop3' of class 'tmp'.");
  });
});
