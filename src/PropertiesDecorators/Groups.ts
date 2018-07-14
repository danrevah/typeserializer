import { GroupsSymbol } from "../consts";
import { createDecorator } from "./Decorator";

export function Groups(groups: string[]) {
  return createDecorator("Groups", GroupsSymbol, groups);
}
