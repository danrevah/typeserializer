import {TypeSymbol} from '../consts';
import {createDecorator} from './Decorator';

export function Type(type: any) {
  return createDecorator('Type', TypeSymbol, type);
}
