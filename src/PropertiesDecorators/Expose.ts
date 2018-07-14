import {ExposeSymbol} from '../consts';
import {createDecorator} from './Decorator';

export function Expose() {
  return createDecorator('Expose', ExposeSymbol, true);
}
