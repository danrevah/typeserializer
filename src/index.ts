
// import {ExclusionStrategies} from './ExclusionPolicy/consts';
import {TypeSerializer} from './ExclusionPolicy/index';
// import {Expose} from './PropertiesDecorators/Expose';
import {Groups} from './PropertiesDecorators/Groups';
import {serialize} from './ExclusionPolicy/Serializer';
import {Exclude} from './PropertiesDecorators/Exclude';

export {TypeSerializer, ExclusionStrategies} from './ExclusionPolicy';
export {Expose} from './PropertiesDecorators/Expose';
export {Groups} from './PropertiesDecorators/Groups';
export {serialize} from './ExclusionPolicy/Serializer';
export {Exclude} from './PropertiesDecorators/Exclude';

@TypeSerializer()
class Test {

  @Exclude()
  @Groups(['perfect'])
  abc = '1';

  @Groups(['also'])
  def = '2';

  @Groups(['perfect', 'also'])
  hyj = '3';
}

const t = new Test();

console.log(JSON.stringify(t));
console.log(JSON.stringify(serialize(t, ['perfect'])));
