
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {serialize} from '../Serializer/Serializer';

class Foo {

  @Expose({ name: 'bar' })
  prop: string = 'prop';

  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

describe('Expose', () => {

  it('should expose properties while serializing', () => {
    const foo = new Foo();
    expect(serialize(foo)).to.equal('');
  });

});
