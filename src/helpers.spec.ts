import { expect } from "chai";
import "reflect-metadata";
import "mocha";
import { isObject } from "./helpers";

describe("Helpers", () => {
  it("should check isObject", () => {
    expect(isObject({})).to.be.true;
    expect(isObject([])).to.be.false;
    expect(isObject(42)).to.be.false;
  });
});
