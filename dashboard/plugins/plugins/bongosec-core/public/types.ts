import { API_USER_STATUS_RUN_AS } from '../common/api-user-status-run-as';
import { Configuration } from '../common/services/configuration';
import { DashboardSecurity } from './utils/dashboard-security';

export interface BongosecCorePluginSetup {
  utils: { formatUIDate: (date: Date) => string };
  API_USER_STATUS_RUN_AS: API_USER_STATUS_RUN_AS;
  configuration: Configuration;
  dashboardSecurity: DashboardSecurity;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BongosecCorePluginStart {
  hooks: { useDockedSideNav: () => boolean };
  utils: { formatUIDate: (date: Date) => string };
  API_USER_STATUS_RUN_AS: API_USER_STATUS_RUN_AS;
  configuration: Configuration;
  dashboardSecurity: DashboardSecurity;
}

export interface AppPluginStartDependencies {}
