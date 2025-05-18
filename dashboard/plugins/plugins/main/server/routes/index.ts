import { IRouter } from 'opensearch_dashboards/server';
import { BongosecApiRoutes } from './bongosec-api';
import { BongosecElasticRoutes } from './bongosec-elastic';
import { BongosecHostsRoutes } from './bongosec-hosts';
import { BongosecUtilsRoutes, UiLogsRoutes } from './bongosec-utils';
import { BongosecReportingRoutes } from './bongosec-reporting';

export const setupRoutes = (router: IRouter, services) => {
  BongosecApiRoutes(router, services);
  BongosecElasticRoutes(router, services);
  BongosecHostsRoutes(router, services);
  BongosecUtilsRoutes(router, services);
  BongosecReportingRoutes(router, services);
  UiLogsRoutes(router, services);
};
