
import 'mocha';
import {expect} from 'chai';
import {Expose} from './Expose';
import {serialize} from '../Serializer/Serializer';
import {Groups} from './Groups';
import {Before} from './Before';
import {After} from './After';

class Foo {

  @Before('1.2.0')
  @Expose({ name: 'foo' })
  prop: string = 'prop';

  @After('1.0.0')
  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

class Bar {

  @Expose({ name: 'bar' })
  @Groups(['special'])
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

  @Expose({name: 'barClass' })
  @Groups(['special'])
  bar: Bar;

  constructor() {
    this.bar = new Bar();
    this.bar.prop = 'prop-changed';
  }
}

class ThreeLevels {

  @Expose()
  @Groups(['special'])
  twoLevels: TwoLevels;

  constructor() {
    this.twoLevels = new TwoLevels();
  }
}

class FourLevels {

  @Expose()
  @Groups(['special'])
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

  it('should expose properties while serializing with version', () => {
    const foo = new Foo();
    expect(serialize(foo, [], '1.1.0')).to.equal('{"foo":"prop","prop2":"prop2","prop3":"prop3"}');
    expect(serialize(foo, [], '1.3.0')).to.equal('{"prop2":"prop2","prop3":"prop3"}');
    expect(serialize(foo, [], '0.9.0')).to.equal('{"foo":"prop","prop3":"prop3"}');
  });

  it('should expose properties while serializing class with functions', () => {
    const bar = new Bar();
    expect(serialize(bar)).to.equal('{"bar":"prop","prop2":"prop2","prop3":"prop3"}');
  });

  it('should expose properties while serializing class with group', () => {
    const bar = new Bar();
    expect(serialize(bar, ['special'])).to.equal('{"bar":"prop"}');
  });

  it('should not expose properties while serializing class with group who does not exist', () => {
    const bar = new Bar();
    expect(serialize(bar, ['other'])).to.equal('{}');
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

  it('should expose properties while serializing class with three level hierarchy and group', () => {
    const fourLevels = new FourLevels();
    expect(serialize(fourLevels, ['special'])).to.equal('{"threeLevels":{"twoLevels":{"barClass":{"bar":"prop-changed"}}}}');
  });

});
