
export {ExclusionStrategies} from '../ExclusionPolicy/consts';

export function TypeSerializer(strategy?: any): any {
  if (!strategy) {
    // @todo return ExclusionPolicyNone
  }

  return strategy;
}
