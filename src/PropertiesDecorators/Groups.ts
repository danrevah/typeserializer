import {GroupsSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function Groups(groups: string[]) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(GroupsSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @Groups decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(GroupsSymbol, {...obj, ...{[key]: groups}}, target);
  };
}
