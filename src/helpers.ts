
export function isObject(val: any) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}
