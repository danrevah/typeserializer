
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {ExposeSymbol} from '../consts';

class Foo {

  @Expose()
  prop = 'prop';

  prop2 = 'prop2';

  @Expose()
  prop3 = 'prop3';
}

function declareClass() {
  class tmp {

    prop = 'prop';
    prop2 = 'prop2';

    @Expose()
    @Expose()
    prop3 = 'prop3';
  }

  return tmp;
}

describe('Expose', () => {

  it('should add metadata to the object expose list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(ExposeSymbol, foo);

    expect(metadata).to.deep.equal({
      prop: true,
      prop3: true
    });
  });

  it('should not add metadata twice, it should throws an exception instead', () => {
    expect(declareClass).to.throw('Cannot apply @Expose decorator twice on property \'prop3\' of class \'tmp\'.');
  });

});
