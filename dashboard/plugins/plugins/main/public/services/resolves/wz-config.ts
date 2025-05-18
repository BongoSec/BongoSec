import { BongosecConfig } from '../../react-services';
import { getWzConfig } from './get-config';

export function wzConfig() {
  return getWzConfig(new BongosecConfig());
}
