
import {ExposeSymbol, GroupsSymbol} from './consts';

export function serialize(object: any, groupNames: string[] = []) {
  const groups = Reflect.getMetadata(GroupsSymbol, object) || {};
  const exposed = Reflect.getMetadata(ExposeSymbol, object) || [];

  const exposedProperties = groupNames.reduce((exposed: string[], groupName: string) => {
    return exposed.concat(groups[groupName] || []);
  }, []);

  return Object.getOwnPropertyNames(object).reduce((json: any, propertyKey: string) => {

    if (exposedProperties.indexOf(propertyKey) > -1 &&
      exposed.find((e: any) => e.propertyKey === propertyKey)) {
      json[propertyKey] = object[propertyKey];
    }

    return json;
  }, {});
}
