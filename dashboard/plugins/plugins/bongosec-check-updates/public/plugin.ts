import { CoreSetup, CoreStart, Plugin } from 'opensearch-dashboards/public';
import {
  AppPluginStartDependencies,
  BongosecCheckUpdatesPluginSetup,
  BongosecCheckUpdatesPluginStart,
} from './types';
import { UpdatesNotification } from './components/updates-notification';
import { DismissNotificationCheck } from './components/dismiss-notification-check';
import { setCore, setBongosecCore } from './plugin-services';
import { getAvailableUpdates } from './services';

export class BongosecCheckUpdatesPlugin
  implements Plugin<BongosecCheckUpdatesPluginSetup, BongosecCheckUpdatesPluginStart> {
  public setup(core: CoreSetup): BongosecCheckUpdatesPluginSetup {
    return {};
  }

  public start(core: CoreStart, plugins: AppPluginStartDependencies): BongosecCheckUpdatesPluginStart {
    setCore(core);
    setBongosecCore(plugins.bongosecCore);

    return {
      UpdatesNotification,
      getAvailableUpdates,
      DismissNotificationCheck,
    };
  }

  public stop() {}
}
