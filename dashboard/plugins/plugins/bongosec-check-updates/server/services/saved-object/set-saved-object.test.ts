import {
  getInternalSavedObjectsClient,
  getBongosecCore,
  getBongosecCheckUpdatesServices,
} from '../../plugin-services';
import { setSavedObject } from './set-saved-object';

const mockedGetInternalObjectsClient =
  getInternalSavedObjectsClient as jest.Mock;
const mockedGetBongosecCheckUpdatesServices =
  getBongosecCheckUpdatesServices as jest.Mock;
jest.mock('../../plugin-services');

describe('setSavedObject function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return saved object', async () => {
    mockedGetInternalObjectsClient.mockImplementation(() => ({
      create: () => ({ attributes: { hide_update_notifications: true } }),
    }));
    mockedGetBongosecCheckUpdatesServices.mockImplementation(() => ({
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
    }));

    const response = await setSavedObject(
      'bongosec-check-updates-user-preferences',
      { hide_update_notifications: true },
      'admin',
    );

    expect(response).toEqual({ hide_update_notifications: true });
  });

  test('should return an error', async () => {
    mockedGetInternalObjectsClient.mockImplementation(() => ({
      create: jest.fn().mockRejectedValue(new Error('setSavedObject error')),
    }));
    mockedGetBongosecCheckUpdatesServices.mockImplementation(() => ({
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
    }));

    const promise = setSavedObject(
      'bongosec-check-updates-user-preferences',
      { hide_update_notifications: true },
      'admin',
    );

    await expect(promise).rejects.toThrow('setSavedObject error');
  });
});
