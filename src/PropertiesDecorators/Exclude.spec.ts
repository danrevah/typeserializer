import 'mocha';
import { expect } from 'chai';
import { Exclude } from './Exclude';
import { ExcludeSymbol } from '../consts';

class Foo {
  @Exclude() prop = 'prop';

  prop2 = 'prop2';

  @Exclude() prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Exclude()
    @Exclude()
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Exclude', () => {
  it('should add metadata to the object exclude list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(ExcludeSymbol, foo);

    expect(metadata.prop()).to.equal(true);
    expect(metadata.prop3()).to.equal(true);
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Exclude decorator twice on property 'prop3' of class 'tmp'.");
  });
});
