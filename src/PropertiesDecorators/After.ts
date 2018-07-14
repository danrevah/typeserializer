import { AfterSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function After(version: string) {
  return createDecorator("After", AfterSymbol, version);
}
