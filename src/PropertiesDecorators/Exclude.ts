import {ExcludeSymbol} from '../consts';
import {createDecorator} from './Decorator';

export function Exclude(fn?: Function) {
  return createDecorator('Exclude', ExcludeSymbol, fn || (() => true));
}
