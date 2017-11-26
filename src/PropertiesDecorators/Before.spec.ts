
import {Before} from './Before';
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {BeforeSymbol} from '../consts';

class Foo {

  @Before('1.0.0')
  prop = 'prop';

  prop2 = 'prop2';
}

describe('Before', () => {

  it('should add metadata to the object before list with the specific property and version', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(BeforeSymbol, foo);

    expect(metadata).to.deep.equal([
      { propertyKey: 'prop', version: '1.0.0' }
    ]);
  });

});
