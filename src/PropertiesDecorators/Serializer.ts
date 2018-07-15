import { SerializerSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function Serializer<T>(fn: (value: any, obj: any) => T) {
  return createDecorator("Serializer", SerializerSymbol, fn);
}
