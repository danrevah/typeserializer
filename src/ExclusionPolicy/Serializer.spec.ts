
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {TypeSerializer} from './TypeSerializer';
import {ExclusionStrategies} from '../consts';
import {Expose} from '../PropertiesDecorators/Expose';
import {serialize} from './Serializer';
import {Groups} from '../PropertiesDecorators/Groups';
import {Exclude} from '../PropertiesDecorators/Exclude';
import {Before} from '../PropertiesDecorators/Before';
import {After} from '../PropertiesDecorators/After';

@TypeSerializer(ExclusionStrategies.All)
class FooTypeAll {

  @Expose()
  @Before('1.2.0')
  @Groups(['foo-group'])
  prop = 'prop';

  prop2 = 'prop2';

  @Expose()
  @After('1.2.0')
  @Groups(['bar-group'])
  prop3 = 'prop3';
}

@TypeSerializer()
class FooTypeNone {

  @Exclude()
  prop = 'prop';

  @Groups(['foo-group'])
  prop2 = 'prop2';

  @Groups(['bar-group'])
  prop3 = 'prop3';
}

@TypeSerializer(ExclusionStrategies.All)
class WrapperFooAll extends FooTypeAll {
  @Expose()
  @Groups(['foo-group'])
  fooNoneInner: FooTypeNone;
}

class Wrapper {
  fooAll: FooTypeAll;
  fooNone: FooTypeNone;
}

class WrapperDeep {
  fooAll: WrapperFooAll;
  fooNone: FooTypeNone;
}



describe('Serializer', () => {

  it('should serialize properties by expose and groups', () => {
    const foo = new FooTypeAll();

    expect(serialize(foo)).to.deep.equal({
      prop: 'prop',
      prop3: 'prop3'
    });

    expect(serialize(foo, ['foo-group'])).to.deep.equal({
      prop: 'prop'
    });

    expect(serialize(foo, ['bar-group'])).to.deep.equal({
      prop3: 'prop3'
    });
  });

  it('should serialize properties by expose and groups', () => {
    const foo = new FooTypeNone();

    expect(serialize(foo)).to.deep.equal({
      prop2: 'prop2',
      prop3: 'prop3'
    });

    expect(serialize(foo, ['foo-group'])).to.deep.equal({
      prop2: 'prop2'
    });

    expect(serialize(foo, ['bar-group'])).to.deep.equal({
      prop3: 'prop3'
    });
  });

  it('should serialize objects on flat hierarchy', () => {
    const wrapper = new Wrapper();
    wrapper.fooAll = new FooTypeAll();
    wrapper.fooNone = new FooTypeNone();

    expect(serialize(wrapper)).to.deep.equal({
      fooAll: {
        prop: 'prop',
        prop3: 'prop3'
      },
      fooNone: {
        prop2: 'prop2',
        prop3: 'prop3'
      }
    });
  });

  it('should serialize objects on flat hierarchy with groups', () => {
    const wrapper = new Wrapper();
    wrapper.fooAll = new FooTypeAll();
    wrapper.fooNone = new FooTypeNone();

    expect(serialize(wrapper, ['foo-group'])).to.deep.equal({
      fooAll: {
        prop: 'prop'
      },
      fooNone: {
        prop2: 'prop2'
      }
    });
  });

  it('should serialize objects on deep hierarchy', () => {
    const wrapper = new WrapperDeep();
    wrapper.fooAll = new WrapperFooAll();
    wrapper.fooAll.fooNoneInner = new FooTypeNone();
    wrapper.fooNone = new FooTypeNone();

    expect(serialize(wrapper)).to.deep.equal({
      fooAll: {
        fooNoneInner: {
          prop2: 'prop2',
          prop3: 'prop3'
        },
        prop: 'prop',
        prop3: 'prop3'
      },
      fooNone: {
        prop2: 'prop2',
        prop3: 'prop3'
      }
    });
  });

  it('should serialize objects on deep hierarchy with groups', () => {
    const wrapper = new WrapperDeep();
    wrapper.fooAll = new WrapperFooAll();
    wrapper.fooAll.fooNoneInner = new FooTypeNone();
    wrapper.fooNone = new FooTypeNone();

    expect(serialize(wrapper, ['foo-group'])).to.deep.equal({
      fooAll: {
        fooNoneInner: {
          prop2: 'prop2'
        },
        prop: 'prop'
      },
      fooNone: {
        prop2: 'prop2'
      }
    });
  });

  it('should serialize objects before & after version', () => {
    const foo = new FooTypeAll();

    expect(serialize(foo, [], {version: '1.1.9'})).to.deep.equal({
      prop: 'prop'
    });

    expect(serialize(foo, [], {version: '1.2.0'})).to.deep.equal({
      prop3: 'prop3'
    });
  });

});
