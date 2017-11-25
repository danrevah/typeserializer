
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {Groups} from './Groups';
import {GroupsSymbol} from '../consts';

class Foo {

  @Groups(['group-foo'])
  prop = 'prop';

  prop2 = 'prop2';

  @Groups(['group-bar'])
  prop3 = 'prop3';
}

describe('Groups', () => {

  it('should add metadata to the object groups list with the specific property', () => {
    const foo = new Foo();
    const metadata = Reflect.getMetadata(GroupsSymbol, foo);

    expect(metadata).to.deep.equal({
      'group-foo': ['prop'],
      'group-bar': ['prop3'],
    });
  });

});
