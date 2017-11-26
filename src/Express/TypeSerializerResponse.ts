
import {serialize} from '../ExclusionPolicy/Serializer';

export function TypeSerializerResponse(groupNames: string[]) {
  return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = <Function>descriptor.value;

    descriptor.value = function () {
      const [context, a, options] = method.apply(this, arguments);
      return context.json(serialize(a, groupNames, options));
    }
  };
}
