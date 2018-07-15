import { expect } from "chai";
import {deserialize} from './Deserializer';

const fixtureSimple = '{"firstName":"Dan","lastName":"Revah","age":28,"isHere":true,"birthDate":"2018-07-15T05:35:03.989Z"}';

export class Simple {
  firstName: string;
  lastName: string;
  age: number;
  isHere: boolean;
  birthDate: Date;
}

describe("Deserializer", () => {

  it("should ", () => {
    const simple: Simple = deserialize(fixtureSimple, Simple);

    expect(simple.firstName).to.equal('Dan');
    expect(simple.lastName).to.equal('Revah');
    expect(simple.age).to.equal(28);
    expect(simple.isHere).to.equal(true);
    // @todo birthdate
    // expect(simple.isHere).to.equal(true);
  });

});
