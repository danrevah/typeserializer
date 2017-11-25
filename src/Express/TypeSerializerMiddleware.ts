
export function TypeSerializerMiddleware() {
  return function (req: any, res: any, next: Function) {

    res.tsJson = function (obj: any) {
      return [this, obj];
    };

    next();
  }
}
