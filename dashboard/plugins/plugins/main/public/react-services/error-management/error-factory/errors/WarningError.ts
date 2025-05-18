import { IBongosecErrorInfo, IBongosecErrorLogOpts } from '../../types';
import BongosecError from './BongosecError';

export class WarningError extends BongosecError {
  logOptions: IBongosecErrorLogOpts;
  constructor(error: Error, info?: IBongosecErrorInfo) {
    super(error, info);
    Object.setPrototypeOf(this, WarningError.prototype);
    this.logOptions = {
      error: {
        message: `[${this.constructor.name}]: ${error.message}`,
        title: `An warning has occurred`,
        error: error,
      },
      level: 'WARNING',
      severity: 'BUSINESS',
      display: true,
      store: false,
    };
  }
}
