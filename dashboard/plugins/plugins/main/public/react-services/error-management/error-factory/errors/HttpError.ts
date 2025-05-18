import { IBongosecErrorInfo, IBongosecErrorLogOpts } from '../../types';
import BongosecError from './BongosecError';

export class HttpError extends BongosecError {
  logOptions: IBongosecErrorLogOpts;
  constructor(error: Error, info?: IBongosecErrorInfo) {
    super(error, info);
    this.logOptions = {
      error: {
        message: `[${this.constructor.name}]: ${error.message}`,
        title: `An error has occurred`,
        error: error,
      },
      level: 'ERROR',
      severity: 'BUSINESS',
      display: true,
      store: false,
    };
  }
}