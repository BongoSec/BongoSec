# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import os
import sys

from bongosec_testing.constants.platforms import WINDOWS

from . import BONGOSEC_PATH


BASE_LOGS_PATH = os.path.join(BONGOSEC_PATH, 'logs')

if sys.platform == WINDOWS:
    BASE_LOGS_PATH = BONGOSEC_PATH
    ACTIVE_RESPONSE_LOG_PATH = os.path.join(BASE_LOGS_PATH, 'active-response', 'active-responses.log')
else:
    ACTIVE_RESPONSE_LOG_PATH = os.path.join(BASE_LOGS_PATH, 'active-responses.log')

BONGOSEC_LOG_PATH = os.path.join(BASE_LOGS_PATH, 'ossec.log')
ALERTS_LOG_PATH = os.path.join(BASE_LOGS_PATH, 'alerts', 'alerts.log')
ALERTS_JSON_PATH = os.path.join(BASE_LOGS_PATH, 'alerts', 'alerts.json')
ARCHIVES_LOG_PATH = os.path.join(BASE_LOGS_PATH, 'archives', 'archives.log')
ARCHIVES_JSON_PATH = os.path.join(BASE_LOGS_PATH, 'archives', 'archives.json')

# API logs paths
BONGOSEC_API_LOG_FILE_PATH = os.path.join(BASE_LOGS_PATH, 'api.log')
BONGOSEC_API_JSON_LOG_FILE_PATH = os.path.join(BASE_LOGS_PATH, 'api.json')

BONGOSEC_CLUSTER_LOGS_PATH = os.path.join(BASE_LOGS_PATH, 'cluster.log')

MACOS_LOG_COMMAND_PATH = '/usr/bin/log'
