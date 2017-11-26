
import {Exclude} from './Exclude';
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {ExcludeSymbol} from '../consts';

class Foo {

  @Exclude()
  prop = 'prop';

  prop2 = 'prop2';

  @Exclude()
  prop3 = 'prop3';
}

describe('Exclude', () => {

  it('should add metadata to the object exclude list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(ExcludeSymbol, foo);

    expect(metadata).to.deep.equal([
      { propertyKey: 'prop', fn: undefined},
      { propertyKey: 'prop3', fn: undefined }
    ]);
  });

});
