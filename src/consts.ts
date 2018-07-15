import "reflect-metadata";

// Property Decorators
export const ExcludeSymbol = Symbol("Exclude");
export const ExposeSymbol = Symbol("Expose");
export const GroupsSymbol = Symbol("Groups");
export const BeforeSymbol = Symbol("Before");
export const AfterSymbol = Symbol("After");
export const NameSymbol = Symbol("Name");
export const TypeSymbol = Symbol("Type");

// Class Decorators
export const StrategySymbol = Symbol("Strategy");

// Enums
export enum ExclusionPolicy {
  NONE,
  ALL,
}

// Consts
export const Detector = {
  CIRCULAR_REFERENCE: Symbol('CircularReference')
};
