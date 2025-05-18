import {
  CoreStart,
  ISavedObjectsRepository,
  Logger,
} from 'opensearch-dashboards/server';
import { createGetterSetter } from '../../../src/plugins/opensearch_dashboards_utils/common';
import { BongosecCorePluginStart } from '../../bongosec-core/server';

export const [getInternalSavedObjectsClient, setInternalSavedObjectsClient] =
  createGetterSetter<ISavedObjectsRepository>('SavedObjectsRepository');
export const [getCore, setCore] = createGetterSetter<CoreStart>('Core');
export const [getBongosecCore, setBongosecCore] =
  createGetterSetter<BongosecCorePluginStart>('BongosecCore');
export const [getBongosecCheckUpdatesServices, setBongosecCheckUpdatesServices] =
  createGetterSetter<{ logger: Logger }>('BongosecCheckUpdatesServices');
