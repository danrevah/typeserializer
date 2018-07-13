
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {serialize} from '../Serializer/Serializer';

class Foo {

  @Expose()
  prop: any;

  prop2: any;

  @Expose()
  prop3: any;
}

describe('Expose', () => {

  it('should add metadata to the object expose list with the specific property', () => {
    const foo = new Foo();

    foo.prop = 'prop';
    foo.prop2 = 'prop2';
    foo.prop3 = 'prop3';

    console.log('yo',Object.getOwnPropertyDescriptor(foo, 'prop'));

    expect(serialize(foo)).to.equal('{"prop2":"prop2"}');
  });

});
