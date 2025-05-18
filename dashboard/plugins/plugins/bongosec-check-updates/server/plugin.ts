import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from 'opensearch-dashboards/server';

import {
  PluginSetup,
  BongosecCheckUpdatesPluginSetup,
  BongosecCheckUpdatesPluginStart,
  AppPluginStartDependencies,
} from './types';
import { defineRoutes } from './routes';
import {
  availableUpdatesObject,
  userPreferencesObject,
} from './services/saved-object/types';
import {
  setCore,
  setBongosecCore,
  setInternalSavedObjectsClient,
  setBongosecCheckUpdatesServices,
} from './plugin-services';
import { ISecurityFactory } from '../../bongosec-core/server/services/security-factory';

declare module 'opensearch-dashboards/server' {
  interface RequestHandlerContext {
    bongosec_check_updates: {
      logger: Logger;
      security: ISecurityFactory;
    };
  }
}

export class BongosecCheckUpdatesPlugin
  implements Plugin<BongosecCheckUpdatesPluginSetup, BongosecCheckUpdatesPluginStart>
{
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup, plugins: PluginSetup) {
    this.logger.debug('bongosec_check_updates: Setup');

    setBongosecCore(plugins.bongosecCore);
    setBongosecCheckUpdatesServices({ logger: this.logger });

    core.http.registerRouteHandlerContext('bongosec_check_updates', () => {
      return {
        logger: this.logger,
        security: plugins.bongosecCore.dashboardSecurity,
      };
    });

    const router = core.http.createRouter();

    // Register saved objects types
    core.savedObjects.registerType(availableUpdatesObject);
    core.savedObjects.registerType(userPreferencesObject);

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(
    core: CoreStart,
    plugins: AppPluginStartDependencies,
  ): BongosecCheckUpdatesPluginStart {
    this.logger.debug('bongosecCheckUpdates: Started');

    const internalSavedObjectsClient =
      core.savedObjects.createInternalRepository();
    setCore(core);

    setInternalSavedObjectsClient(internalSavedObjectsClient);

    return {};
  }

  public stop() {}
}
