import { BongosecCorePlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new BongosecCorePlugin();
}
export { BongosecCorePluginSetup, BongosecCorePluginStart } from './types';
