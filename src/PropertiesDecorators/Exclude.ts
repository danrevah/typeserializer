import {ExcludeSymbol} from '../consts';
import {createDecorator} from './Decorator';

export function Exclude() {
  return createDecorator('Exclude', ExcludeSymbol, true);
}
