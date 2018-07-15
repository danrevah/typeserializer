import {TypeSymbol} from '../consts';

export function deserialize<T>(json: string, classType: T): any {
  return transform(JSON.parse(json), classType);
}

// -- Private --
function transformArray(arr: any[], classType: any): any[] {
  return arr.map(
    (elm: any) => Array.isArray(elm) ? transformArray(elm, classType) : transform(elm, classType)
  )
}

function transform(obj: any, classType: any) {
  const instance = new (classType)();
  const typeMap = Reflect.getMetadata(TypeSymbol, instance) || {};

  Object.keys(obj).forEach((key: string) => {
    instance[key] = obj[key];

    if (!typeMap.hasOwnProperty(key)) {
      return;
    }

    const type = typeMap[key];

    if (Array.isArray(type) && Array.isArray(obj[key])) {
      if (type.length !== 1) {
        throw new Error('`@Type` can only be defined with a single value, or an array with a single value. for ex: `@Type(User)` or `@Type([User])`');
      }

      instance[key] = transformArray(obj[key], type[0]);
    } else if (type === Date) {
      instance[key] = new Date(obj[key]);
    } else {
      instance[key] = transform(obj[key], type);
    }
  });

  return instance;
}
