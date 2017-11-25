
import 'reflect-metadata';
import {ExclusionStrategiesNone} from './ExclusionStrategiesNone';
export {ExclusionStrategies} from '../consts';

export function TypeSerializer(strategy?: any): any {
  if (!strategy) {
    return ExclusionStrategiesNone;
  }

  return strategy;
}
