import { expect } from 'chai';
import 'reflect-metadata';
import 'mocha';
import { isObject, versionCompare } from './helpers';

describe('Helpers', () => {
  it('should check isObject', () => {
    expect(isObject({})).to.be.true;
    expect(isObject([])).to.be.false;
    expect(isObject(42)).to.be.false;
  });

  it('should check versionCompare', () => {
    expect(versionCompare('2.1.0', '2.0.0')).to.equal(1);
    expect(versionCompare('1.0.0', '2.0.0')).to.equal(-1);
    expect(versionCompare('1.2.4', '1.2.5')).to.equal(-1);
    expect(versionCompare('1.3.4', '1.4.5')).to.equal(-1);
    expect(versionCompare('1.3.4', '1.3.4')).to.equal(0);
    expect(versionCompare('1.0.0', 'foo')).to.be.NaN;
  });
});
