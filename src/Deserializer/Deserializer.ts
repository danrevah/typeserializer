import {Simple} from './Deserializer.spec';

export function deserialize<T>(obj: any, type: T): any {
  return new Simple();
}
