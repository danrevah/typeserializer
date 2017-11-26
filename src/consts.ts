
import {ExclusionStrategiesAll} from './ExclusionPolicy/ExclusionStrategiesAll';
import {ExclusionStrategiesNone} from './ExclusionPolicy/ExclusionStrategiesNone';

export const ExposeSymbol = Symbol('Expose');
export const ExcludeSymbol = Symbol('Exclude');
export const BeforeSymbol = Symbol('Before');
export const AfterSymbol = Symbol('After');
export const GroupsSymbol = Symbol('Groups');
export const ExclusionStrategiesSymbol = Symbol('ExclusionStrategies');
export const ExclusionStrategies = {
  All: ExclusionStrategiesAll,
  None: ExclusionStrategiesNone
};
