import { BeforeSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function Before(version: string) {
  return createDecorator("Before", BeforeSymbol, version);
}
