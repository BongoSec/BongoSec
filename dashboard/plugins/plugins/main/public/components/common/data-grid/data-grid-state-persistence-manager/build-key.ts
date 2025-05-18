const BONGOSEC_DATA_GRID_COLUMNS_PREFIX = 'wz-data-grid-state';

export const buildKey = (moduleId: string) =>
  `${BONGOSEC_DATA_GRID_COLUMNS_PREFIX}-${moduleId}`;
