export const PLUGIN_ID = 'bongosecCheckUpdates';
export const PLUGIN_NAME = 'bongosec_check_updates';

export const SAVED_OBJECT_UPDATES = 'bongosec-check-updates-available-updates';
export const SAVED_OBJECT_USER_PREFERENCES = 'bongosec-check-updates-user-preferences';

export enum routes {
  checkUpdates = '/api/bongosec-check-updates/updates',
  userPreferences = '/api/bongosec-check-updates/user-preferences/me',
}
