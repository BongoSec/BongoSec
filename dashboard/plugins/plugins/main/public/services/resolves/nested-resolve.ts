import { WzMisc } from '../../factories/misc';
import { BongosecConfig } from '../../react-services';
import { getWzConfig } from './get-config';
import { settingsWizard } from './settings-wizard';

export function nestedResolve(params) {
  const wzMisc = new WzMisc();
  const healthCheckStatus = sessionStorage.getItem('healthCheck');
  if (!healthCheckStatus) return;
  const bongosecConfig = new BongosecConfig();
  return getWzConfig(bongosecConfig).then(() =>
    settingsWizard(
      params,
      wzMisc,
      params.location && params.location.pathname.includes('/health-check'),
    ),
  );
}
