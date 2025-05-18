import { IBongosecErrorInfo, IBongosecErrorLogOpts } from '../../types';
import { HttpError } from './HttpError';

export class BongosecReportingError extends HttpError {
  constructor(error: Error, info?: IBongosecErrorInfo) {
    super(error, info);
  }
}
