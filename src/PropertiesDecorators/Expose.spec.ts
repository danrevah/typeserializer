
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {serialize} from '../Serializer/Serializer';

class Foo {

  @Expose({ name: 'foo' })
  prop: string = 'prop';

  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

class Bar {

  @Expose({ name: 'bar' })
  prop: string = 'prop';

  prop2: string = 'prop2';

  prop3: string = 'prop3';

  fn() {
    this.prop2 = 'prop2-2';
  }

  fn2() {
    this.prop2 = 'prop2-2';
  }
}

class TwoLevels {

  @Expose({name: 'barClass'})
  bar: Bar;

  constructor() {
    this.bar = new Bar();
    this.bar.prop = 'prop-changed';
  }
}

class ThreeLevels {

  twoLevels: TwoLevels;

  constructor() {
    this.twoLevels = new TwoLevels();
  }
}

class FourLevels {

  threeLevels: ThreeLevels;

  constructor() {
    this.threeLevels = new ThreeLevels();
  }
}

describe('Expose', () => {

  it('should expose properties while serializing', () => {
    const foo = new Foo();
    expect(serialize(foo)).to.equal('{"foo":"prop","prop2":"prop2","prop3":"prop3"}');
  });

  it('should expose properties while serializing class with functions', () => {
    const bar = new Bar();
    expect(serialize(bar)).to.equal('{"bar":"prop","prop2":"prop2","prop3":"prop3"}');
  });

  it('should expose properties while serializing class with two level hierarchy', () => {
    const twoLevels = new TwoLevels();
    expect(serialize(twoLevels)).to.equal('{"barClass":{"bar":"prop-changed","prop2":"prop2","prop3":"prop3"}}');
  });

  it('should expose properties while serializing class with three level hierarchy', () => {
    const threeLevels = new ThreeLevels();
    expect(serialize(threeLevels)).to.equal('{"twoLevels":{"barClass":{"bar":"prop-changed","prop2":"prop2","prop3":"prop3"}}}');
  });

  it('should expose properties while serializing class with three level hierarchy', () => {
    const fourLevels = new FourLevels();
    expect(serialize(fourLevels)).to.equal('{"threeLevels":{"twoLevels":{"barClass":{"bar":"prop-changed","prop2":"prop2","prop3":"prop3"}}}}');
  });

});
