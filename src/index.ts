
import {ExclusionStrategies} from './ExclusionPolicy/consts';
import {TypeSerializer} from './ExclusionPolicy/index';
import {Expose} from './PropertiesDecorators/Expose';
import {Groups} from './PropertiesDecorators/Groups';
import {serialize} from './ExclusionPolicy/serializer';

export {TypeSerializer, ExclusionStrategies} from './ExclusionPolicy';
export {Expose} from './PropertiesDecorators/Expose';
export {Groups} from './PropertiesDecorators/Groups';
export {serialize} from './ExclusionPolicy/serializer';

@TypeSerializer(ExclusionStrategies.All)
class Test {

  @Expose()
  @Groups(['also'])
  abc = '1';

  @Expose()
  @Groups(['perfect'])
  def = '2';

  @Groups(['perfect', 'also'])
  hyj = '3';
}

const t = new Test();

console.log(JSON.stringify(t));
console.log(JSON.stringify(serialize(t, ['perfect'])));
