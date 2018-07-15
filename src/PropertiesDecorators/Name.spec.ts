import 'mocha';
import { expect } from 'chai';
import { Name } from './Name';
import { NameSymbol } from '../consts';

class Foo {
  @Name('prop1') prop = 'prop';

  prop2 = 'prop2';

  @Name('admin') prop3 = 'prop3';
}

function declareClass() {
  /* istanbul ignore next */
  class tmp {
    @Name('')
    @Name('')
    prop3 = 'prop3';
  }

  /* istanbul ignore next */
  return tmp;
}

describe('Name', () => {
  it('should add metadata to the object before list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(NameSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: 'prop1',
      prop3: 'admin',
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw("Cannot apply @Name decorator twice on property 'prop3' of class 'tmp'.");
  });
});
