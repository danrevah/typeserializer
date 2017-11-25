
import {GroupsSymbol} from '../consts';

export function Groups(groups: string[]) {

  return function (target: any, propertyKey: string) {
    const groupsObj = groups.reduce((groupsObj, groupName: string) => {
      if (!groupsObj[groupName]) {
        groupsObj[groupName] = [];
      }

      groupsObj[groupName] = groupsObj[groupName].concat(propertyKey);
      return groupsObj;
    }, Reflect.getMetadata(GroupsSymbol, target) || {});

    Reflect.defineMetadata(GroupsSymbol, groupsObj, target);
  };
}
