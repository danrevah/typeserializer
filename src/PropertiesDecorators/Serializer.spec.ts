import 'mocha';
import { expect } from 'chai';
import { Serializer } from './Serializer';
import { SerializerSymbol } from '../consts';

class Foo {
  @Serializer((value: any) => 'propName' + value)
  prop = 'prop';

  prop2 = 'prop2';

  @Serializer((value: any) => 'propName' + value)
  prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Serializer((value: any) => 'propName' + value)
    @Serializer((value: any) => 'propName' + value)
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
    expect(metadata.prop3).to.be.instanceof(Function);
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Serializer decorator twice on property 'prop3' of class 'tmp'.");
  });
});
