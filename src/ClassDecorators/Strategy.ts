import { isUndefined } from "../helpers";
import { ExclusionPolicy, StrategySymbol } from "../consts";

export function Strategy(strategy: ExclusionPolicy) {
  return function(constructor: Function) {
    const _strategy = Reflect.getMetadata(StrategySymbol, constructor);

    if (!isUndefined(_strategy)) {
      throw new Error(`Cannot apply @Strategy decorator twice on class '${constructor.name}'.`);
    }

    Reflect.defineMetadata(StrategySymbol, strategy, constructor);
  };
}
