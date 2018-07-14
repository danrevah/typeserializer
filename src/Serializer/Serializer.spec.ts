
import {expect} from 'chai';
import {Expose} from '../PropertiesDecorators/Expose';
import {serialize} from './Serializer';
import {Groups} from '../PropertiesDecorators/Groups';
import {Before} from '../PropertiesDecorators/Before';
import {After} from '../PropertiesDecorators/After';
import {Name} from '../PropertiesDecorators/Name';
import {Strategy} from '../ClassDecorators/Strategy';
import {ExclusionPolicy} from '../consts';
import {Exclude} from '../';

class Foo {

  @Before('1.2.0')
  @Name('foo')
  prop: string = 'prop';

  @After('1.0.0')
  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

class Bar {

  @Groups(['special'])
  @Name('bar')
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

  @Name('barClass')
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

@Strategy(ExclusionPolicy.ALL)
class User {

  @Expose()
  @Groups(['personal'])
  firstName: string = 'Dan';

  @Expose()
  @Groups(['personal'])
  lastName: string = 'Revah';

  @Expose()
  username: string = 'danrevah';

  password: string = '123456';
}

@Strategy(ExclusionPolicy.ALL)
class DynamicFoo {

  @Expose(() => true)
  prop: string = 'prop';

  @Expose(() => false)
  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

class DynamicNoneFoo {

  @Exclude(() => true)
  prop: string = 'prop';

  @Exclude(() => false)
  prop2: string = 'prop2';

  prop3: string = 'prop3';
}

class TwoLevelsArray {

  @Name('barClass')
  @Groups(['special'])
  bar: Bar[];

  constructor() {
    this.bar = [new Bar(), new Bar()];
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

  it('should expose only exposed properties while exclusion policy is set to ALL', () => {
    const user = new User();
    expect(serialize(user)).to.equal('{"firstName":"Dan","lastName":"Revah","username":"danrevah"}');
  });

  it('should expose only exposed properties while exclusion policy is set to ALL and show current group', () => {
    const user = new User();
    expect(serialize(user, ['personal'])).to.equal('{"firstName":"Dan","lastName":"Revah"}');
  });

  it('should expose properties while serializing with functions', () => {
    const foo = new DynamicFoo();
    expect(serialize(foo)).to.equal('{"prop":"prop"}');
  });

  it('should exclude properties while serializing with functions', () => {
    const foo = new DynamicNoneFoo();
    expect(serialize(foo)).to.equal('{"prop2":"prop2","prop3":"prop3"}');
  });

  it('should serialize arrays nested types', () => {
    const foo = new TwoLevelsArray();
    expect(serialize(foo)).to.equal(
      '{"barClass":[{"bar":"prop","prop2":"prop2","prop3":"prop3"},{"bar":"prop","prop2":"prop2","prop3":"prop3"}]}'
    );
  });
});
