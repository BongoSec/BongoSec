import { PluginInitializerContext } from 'opensearch_dashboards/server';

import { BongosecPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, plugin platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new BongosecPlugin(initializerContext);
}

export { BongosecPluginSetup, BongosecPluginStart } from './types';
