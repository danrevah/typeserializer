
import 'reflect-metadata';
import {ExclusionStrategiesNone} from './ExclusionStrategiesNone';

export function TypeSerializer(strategy?: any): any {
  if (!strategy) {
    return ExclusionStrategiesNone;
  }

  return strategy;
}
