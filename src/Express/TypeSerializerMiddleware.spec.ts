
import {expect} from 'chai';
import 'reflect-metadata';
import 'mocha';
import {TypeSerializerMiddleware} from './TypeSerializerMiddleware';

describe('Express TypeSerializerMiddleware', () => {

  it('should check isObject', () => {
    const options = {version: '1'};
    const middleware = TypeSerializerMiddleware(options);
    const res: any = {};

    middleware(null, res, () => {});

    const param = {foo: 'bar'};
    const [context, obj, opts] = res.tsJson(param);

    expect(context).to.equal(res);
    expect(param).to.equal(obj);
    expect(options).to.equal(opts);
  });

});
