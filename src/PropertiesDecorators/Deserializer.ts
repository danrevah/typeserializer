import { DeserializerSymbol } from '../consts';
import { createDecorator } from "./Decorator";

export function Deserializer<T>(fn: (value: any, obj: any) => T) {
  return createDecorator("Deserializer", DeserializerSymbol, fn);
}
