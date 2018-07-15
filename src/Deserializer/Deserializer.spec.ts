import { expect } from 'chai';
import { deserialize } from './Deserializer';
import { Deserializer, Type } from '../';

const fixtureSimple =
  '{"firstName":"Dan","lastName":"Revah","age":28,"isHere":true,"birthDate":"2018-07-15T05:35:03.000Z"}';
const fixtureChild = `{"child":${fixtureSimple}}`;
const fixtureChildren = `{"children":[${fixtureSimple}, ${fixtureSimple}]}`;
const fixtureDeserialize = `{"prop":"name"}`;

export class Simple {
  firstName: string;
  lastName: string;
  age: number;
  isHere: boolean;

  @Type(Date) birthDate: Date;
}

export class SimpleChild {
  @Type(Simple) child: Simple;
}

export class SimpleChildArr {
  @Type([Simple])
  children: Simple[];
}

export class CauseException {
  @Type([Simple, Simple])
  children: Simple[];
}

export class Prop {
  constructor(public name: string) {}
}

export class SimpleDeserializer {
  @Deserializer((value: string) => new Prop('my-prop-' + value))
  prop: Prop;
}

describe('Deserializer', () => {
  it('should equal basic type with primitives and Date', () => {
    const simple: Simple = deserialize(fixtureSimple, Simple);

    expect(simple.firstName).to.equal('Dan');
    expect(simple.lastName).to.equal('Revah');
    expect(simple.age).to.equal(28);
    expect(simple.isHere).to.equal(true);
    expect(simple.birthDate).instanceof(Date);
  });

  it('should equal with child hierarchy', () => {
    const simple: SimpleChild = deserialize(fixtureChild, SimpleChild);

    expect(simple.child).to.be.instanceof(Simple);
    expect(simple.child.firstName).to.equal('Dan');
    expect(simple.child.lastName).to.equal('Revah');
    expect(simple.child.age).to.equal(28);
    expect(simple.child.isHere).to.equal(true);
    expect(simple.child.birthDate).instanceof(Date);
  });

  it('should equal with array as child hierarchy', () => {
    const simple: SimpleChildArr = deserialize(fixtureChildren, SimpleChildArr);

    expect(simple.children[0]).to.be.instanceof(Simple);
    expect(simple.children[0].firstName).to.equal('Dan');
    expect(simple.children[0].lastName).to.equal('Revah');
    expect(simple.children[0].age).to.equal(28);
    expect(simple.children[0].isHere).to.equal(true);
    expect(simple.children[0].birthDate).instanceof(Date);

    expect(simple.children[1]).to.be.instanceof(Simple);
    expect(simple.children[1].firstName).to.equal('Dan');
    expect(simple.children[1].lastName).to.equal('Revah');
    expect(simple.children[1].age).to.equal(28);
    expect(simple.children[1].isHere).to.equal(true);
    expect(simple.children[1].birthDate).instanceof(Date);
  });

  it('should throw an error if have more than once value in @Type array annotation', () => {
    expect(() => deserialize(fixtureChildren, CauseException)).to.throw(
      '`@Type` can only be defined with a single value, or an array with a single value. for ex: `@Type(User)` or `@Type([User])`'
    );
  });

  it('should use the `@Deserialize` function on a property while deserialize', () => {
    const simpleDes: SimpleDeserializer = deserialize(fixtureDeserialize, SimpleDeserializer);
    expect(simpleDes.prop.name).to.equal('my-prop-name');
  });
});
