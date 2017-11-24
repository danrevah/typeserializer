
import 'reflect-metadata';
import {ExclusionStrategiesNone} from './ExclusionStrategiesNone';
export {ExclusionStrategies} from '../ExclusionPolicy/consts';

export function TypeSerializer(strategy?: any): any {
  if (!strategy) {
    return ExclusionStrategiesNone;
  }

  return strategy;
}
