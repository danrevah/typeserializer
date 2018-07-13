
import 'mocha';
import {expect} from 'chai';
import {Exclude} from './Exclude';
import {serialize} from '../Serializer/Serializer';

class Foo {

  @Exclude()
  prop: string = 'prop';

  prop2: string = 'prop2';

  @Exclude()
  prop3: string = 'prop3';
}

class Bar {

  @Exclude(() => true)
  prop: string = 'prop';

  prop2: string = 'prop2';

  @Exclude(() => false)
  prop3: string = 'prop3';
}

describe('Exclude', () => {

  it('should exclude properties while serializing', () => {
    const foo = new Foo();
    const serialized = serialize(foo);

    expect(serialized.hasOwnProperty('prop')).to.be.false;
    expect(serialized.hasOwnProperty('prop2')).to.be.true;
    expect(serialized.hasOwnProperty('prop3')).to.be.false;
    expect(serialized.prop2).to.equal('prop2');
  });

  it('should exclude properties who match the function while serializing', () => {
    const bar = new Bar();
    const serialized = serialize(bar);

    expect(serialized.hasOwnProperty('prop')).to.be.false;
    expect(serialized.hasOwnProperty('prop2')).to.be.true;
    expect(serialized.hasOwnProperty('prop3')).to.be.true;
    expect(serialized.prop2).to.equal('prop2');
    expect(serialized.prop3).to.equal('prop3');
  });

});
