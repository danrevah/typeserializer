import { 
	DeserializerSymbol
	, TypeSymbol
	, NameSymbol 
} from '../consts';

export function deserialize<T>(json: string, classType: { new(): any }): T {
  return transform(JSON.parse(json), classType);
}

// -- Private --
function transformArray(arr: any[], classType: any): any[] {
  return arr.map((elm: any) => (Array.isArray(elm) ? transformArray(elm, classType) : transform(elm, classType)));
}

function transform<T>(obj: any, classType: { new(): any }): T {
  const instance = new classType();
  const typeMap = Reflect.getMetadata(TypeSymbol, instance) || {};
  const deserializerMap = Reflect.getMetadata(DeserializerSymbol, instance) || {};
  const nameMap = Reflect.getMetadata(NameSymbol, instance) || {};
  console.log(instance, obj)
  Object.keys(obj).forEach((key: string) => {
	let instanceKey = Object.keys(nameMap).find(i => nameMap[i]===key ) ;
	if(instanceKey) instance[instanceKey] = obj[key];
	else if (instance.hasOwnProperty(key)) instance[key] = obj[key];
	else return;
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
