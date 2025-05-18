/*
 * Bongosec app
 *
 * Copyright (C) 2015-2022 Bongosec, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { WzSecurityOpenSearchDashboardsSecurity } from './wz-security-opensearch-dashboards-security';

jest.mock('./generic-request', () => ({
  GenericRequest: {
    request: (method, path) => {
      return {
        data: {
          data: {
            bongosec: {
              hash: '',
              reserved: true,
              hidden: false,
              backend_roles: ['admin'],
              attributes: {email: 'bongosec@email.com', full_name: 'bongosec surname'},
              description: 'admin user',
              opendistro_security_roles: [],
              static: false,
            },
          },
        },
      };
    },
  },
}));
describe('Bongosec Internal Users', () => {
  it('Should return the ODFE internal users', async () => {
    const users = await WzSecurityOpenSearchDashboardsSecurity.getUsers();
    const expected_result = [
        { username: 'bongosec', email: 'bongosec@email.com', full_name: 'bongosec surname', roles: [] },
      ];
    expect(users).toEqual(expected_result);
  });
});
