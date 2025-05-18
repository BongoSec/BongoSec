import { BongosecCorePluginStart } from '../../bongosec-core/public';
import { AvailableUpdates } from '../common/types';

export interface BongosecCheckUpdatesPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BongosecCheckUpdatesPluginStart {
  UpdatesNotification: () => JSX.Element | null;
  getAvailableUpdates: (
    queryApi: boolean,
    forceQuery: boolean,
  ) => Promise<AvailableUpdates>;
  DismissNotificationCheck: () => JSX.Element | null;
}

export interface AppPluginStartDependencies {
  bongosecCore: BongosecCorePluginStart;
}
