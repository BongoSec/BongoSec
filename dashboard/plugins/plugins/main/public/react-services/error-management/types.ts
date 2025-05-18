import { UIErrorLog } from '../error-orchestrator/types';

export interface IBongosecErrorLogOpts extends Omit<UIErrorLog,'context'> {}
export interface IErrorOpts {
  error: Error;
  message: string;
  code?: number;
}

export interface IBongosecError extends Error, IErrorOpts {
  error: Error;
  message: string;
  code?: number;
  logOptions: IBongosecErrorLogOpts;
}

export interface IBongosecErrorConstructor {
  new (error: Error, info: IBongosecErrorInfo): IBongosecError;
}

export interface IBongosecErrorInfo {
  message: string;
  code?: number;
}
