
import {Expose} from './Expose';
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {ExposeSymbol} from "../consts";

class Foo {

  @Expose()
  prop = 'prop';

  prop2 = 'prop2';

  @Expose()
  prop3 = 'prop3';
}

describe('Expose', () => {

  it('should add metadata to the object expose list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(ExposeSymbol, foo);

    expect(metadata).to.deep.equal([
      { propertyKey: 'prop' },
      { propertyKey: 'prop3' }
    ]);
  });

});
