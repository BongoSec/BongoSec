import { ISecurityFactory } from '../../bongosec-core/server/services/security-factory';
import { BongosecCorePluginStart } from '../../bongosec-core/server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppPluginStartDependencies {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BongosecCheckUpdatesPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BongosecCheckUpdatesPluginStart {}

export type PluginSetup = {
  securityDashboards?: {}; // TODO: Add OpenSearch Dashboards Security interface
  bongosecCore: { dashboardSecurity: ISecurityFactory };
};

export interface AppPluginStartDependencies {
  bongosecCore: BongosecCorePluginStart;
}
