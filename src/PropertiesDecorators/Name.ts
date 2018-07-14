import { NameSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function Name(name: string) {
  return createDecorator("Name", NameSymbol, name);
}
