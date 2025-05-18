/*
 * Bongosec app - Components compatibility operative system
 * Copyright (C) 2015-2022 Bongosec, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { BONGOSEC_AGENTS_OS_TYPE, BONGOSEC_MODULES_ID } from '../../common/constants';
import { vulnerabilityDetection, docker, office365 } from './applications';

export const UnsupportedComponents = {
  [BONGOSEC_AGENTS_OS_TYPE.LINUX]: [],
  [BONGOSEC_AGENTS_OS_TYPE.WINDOWS]: [
    BONGOSEC_MODULES_ID.AUDITING,
    docker.id,
    BONGOSEC_MODULES_ID.OPEN_SCAP,
  ],
  [BONGOSEC_AGENTS_OS_TYPE.DARWIN]: [
    BONGOSEC_MODULES_ID.AUDITING,
    docker.id,
    BONGOSEC_MODULES_ID.OPEN_SCAP,
  ],
  [BONGOSEC_AGENTS_OS_TYPE.SUNOS]: [vulnerabilityDetection.id, office365.id],
  [BONGOSEC_AGENTS_OS_TYPE.OTHERS]: [
    BONGOSEC_MODULES_ID.AUDITING,
    docker.id,
    BONGOSEC_MODULES_ID.OPEN_SCAP,
    vulnerabilityDetection.id,
    office365.id,
  ],
};

// Office 365 is only compatible with Linux, macOS and Windows
// https://documentation.bongosec.github.io/4.9/user-manual/reference/ossec-conf/office365-module.html#office365
