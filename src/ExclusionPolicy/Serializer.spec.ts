
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {TypeSerializer} from './TypeSerializer';
import {ExclusionStrategies} from '../consts';
import {Expose} from '../PropertiesDecorators/Expose';
import {serialize} from './Serializer';
import {Groups} from '../PropertiesDecorators/Groups';
import {Exclude} from '../PropertiesDecorators/Exclude';

@TypeSerializer(ExclusionStrategies.All)
class FooTypeAll {

  @Expose()
  @Groups(['foo-group'])
  prop = 'prop';

  prop2 = 'prop2';

  @Expose()
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

});
