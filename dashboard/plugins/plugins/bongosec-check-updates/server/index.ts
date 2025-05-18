import { PluginInitializerContext } from '../../../src/core/server';
import { BongosecCheckUpdatesPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new BongosecCheckUpdatesPlugin(initializerContext);
}

export { BongosecCheckUpdatesPluginSetup, BongosecCheckUpdatesPluginStart } from './types';
