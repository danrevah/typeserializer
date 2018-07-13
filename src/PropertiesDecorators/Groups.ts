import {GroupsSymbol} from '../consts';

export function Groups(groups: string[]) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(GroupsSymbol, target) || {};
    Reflect.defineMetadata(GroupsSymbol, {...obj, ...{[key]: groups}}, target);
  };
}
