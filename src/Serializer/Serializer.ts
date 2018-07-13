

export function serialize(obj: any) {
  return Object.getOwnPropertyNames(obj).reduce((json: any, propertyKey: string) => {
    json[propertyKey] = obj[propertyKey];
    return json;
  }, {});
}
