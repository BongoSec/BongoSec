import { useEffect, useState } from 'react';
import BongosecError from '../../error-factory/errors/BongosecError';
import { ErrorHandler } from '../error-handler';

/**
 *
 * @param callback
 * @returns
 */
export const useErrorHandler = (callback: Function) => {
  const [res, setRes] = useState(null);
  const [error, setError] = useState<Error|BongosecError|null>(null);
  useEffect(() => {
    const handleCallback =  async () => {
      try {
        let res = await callback();
        setRes(res);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          error = ErrorHandler.handleError(error);
        }
        setRes(null);
        setError(error as Error | BongosecError);
      }
    }

    handleCallback();
  }, [])
  
  return [res, error];
};
