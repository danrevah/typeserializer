
import {After} from './After';
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {AfterSymbol} from '../consts';

class Foo {

  @After('1.2.x')
  prop = 'prop';

  prop2 = 'prop2';
}

describe('After', () => {

  it('should add metadata to the object after list with the specific property and version', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(AfterSymbol, foo);

    expect(metadata).to.deep.equal([
      { propertyKey: 'prop', version: '1.2.x' }
    ]);
  });

});
