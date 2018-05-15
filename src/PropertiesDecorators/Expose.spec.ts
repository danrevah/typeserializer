
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {serialize} from '../Serializer/Serializer';

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


    expect(serialize(foo)).to.equal('{"prop2":"prop2"}');
  });

});
