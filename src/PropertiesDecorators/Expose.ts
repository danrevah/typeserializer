import { ExposeSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function Expose(fn?: Function) {
  return createDecorator("Expose", ExposeSymbol, fn || (() => true));
}
