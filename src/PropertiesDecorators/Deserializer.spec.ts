import 'mocha';
import { expect } from 'chai';
import { Deserializer } from './Deserializer';
import { DeserializerSymbol } from '../consts';

class Foo {
  @Deserializer((value: any) => 'propName'+value) prop = 'prop';

  prop2 = 'prop2';

  @Deserializer((value: any) => 'propName'+value) prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Deserializer((value: any) => 'propName'+value)
    @Deserializer((value: any) => 'propName'+value)
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
    expect(metadata.prop3).to.be.instanceof(Function);
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Deserializer decorator twice on property 'prop3' of class 'tmp'.");
  });
});
