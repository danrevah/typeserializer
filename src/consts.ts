
import {ExclusionStrategiesAll} from './ExclusionPolicy/ExclusionStrategiesAll';
import {ExclusionStrategiesNone} from './ExclusionPolicy/ExclusionStrategiesNone';

export const ExposeSymbol = Symbol('Expose');
export const ExcludeSymbol = Symbol('Exclude');
export const GroupsSymbol = Symbol('Groups');
export const ExclusionStrategiesSymbol = Symbol('ExclusionStrategies');
export const ExclusionStrategies = {
  All: ExclusionStrategiesAll,
  None: ExclusionStrategiesNone
};
