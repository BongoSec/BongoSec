import { PluginInitializer, PluginInitializerContext } from 'opensearch_dashboards/public';
import { BongosecPlugin } from './plugin';
import { BongosecSetup, BongosecSetupPlugins, BongosecStart, BongosecStartPlugins } from './types';

export const plugin: PluginInitializer<BongosecSetup, BongosecStart, BongosecSetupPlugins, BongosecStartPlugins> = (
  initializerContext: PluginInitializerContext
) => {
  return new BongosecPlugin(initializerContext);
};

// These are your public types & static code
export { BongosecSetup, BongosecStart };
