
import {MiddlewareOptions} from './model';

export function TypeSerializerMiddleware(options: MiddlewareOptions = {}) {
  return function (req: any, res: any, next: Function) {

    res.tsJson = function (obj: any) {
      return [this, obj, options];
    };

    next();
  }
}
