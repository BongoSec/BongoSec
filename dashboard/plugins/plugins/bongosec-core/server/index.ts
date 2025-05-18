import { PluginInitializerContext } from '../../../src/core/server';
import { BongosecCorePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new BongosecCorePlugin(initializerContext);
}

export type { BongosecCorePluginSetup, BongosecCorePluginStart } from './types';
export type { IConfigurationEnhanced } from './services/enhance-configuration';
