import { CoreStart } from 'opensearch-dashboards/public';
import { createGetterSetter } from '../../../src/plugins/opensearch_dashboards_utils/common';
import { BongosecCorePluginStart } from '../../bongosec-core/public';

export const [getCore, setCore] = createGetterSetter<CoreStart>('Core');
export const [getBongosecCore, setBongosecCore] =
  createGetterSetter<BongosecCorePluginStart>('BongosecCore');
