import { DeserializerSymbol, NameSymbol, TypeSymbol } from '../consts';
import { isObject } from '../helpers';

export function deserialize<T>(json: string, classType: T): any {
  return transform(toObject(json), classType);
}

// -- Private --
function transformArray(arr: any[], classType: any): any[] {
  return arr.map((elm: any) => (Array.isArray(elm) ? transformArray(elm, classType) : transform(elm, classType)));
}

function transform(obj: any, classType: any) {
  if (!isObject(obj)) {
    return obj;
  }

  const instance = new classType();
  const typeMap = Reflect.getMetadata(TypeSymbol, instance) || {};
  const deserializerMap = Reflect.getMetadata(DeserializerSymbol, instance) || {};
  const nameMap = Reflect.getMetadata(NameSymbol, instance) || {};
  const reverseNames = Object.keys(nameMap).reduce((o: any, key: string) => ({ ...o, [nameMap[key]]: key }), {});

  Object.keys(obj).forEach((key: string) => {
    if (reverseNames.hasOwnProperty(key)) {
      instance[reverseNames[key]] = obj[key];
    } else {
      instance[key] = obj[key];
    }

    if (typeof deserializerMap[key] === 'function') {
      instance[key] = deserializerMap[key].call(null, instance[key], instance);
      return;
    }

    if (!typeMap.hasOwnProperty(key)) {
      return;
    }

    const type = typeMap[key];

    if (Array.isArray(type) && Array.isArray(obj[key])) {
      if (type.length !== 1) {
        throw new Error(
          '`@Type` can only be defined with a single value, or an array with a single value. for ex: `@Type(User)` or `@Type([User])`'
        );
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

function toObject(json: string): any {
  try {
    return JSON.parse(json);
  } catch (_) {
    throw `Unable to deserialize, not a valid JSON.`;
  }
}
