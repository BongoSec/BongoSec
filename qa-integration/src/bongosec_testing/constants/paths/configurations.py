"""
Copyright (C) 2025, Bongosec
Created by Bongosec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
"""
import os
import sys

from bongosec_testing.constants.platforms import WINDOWS

from . import BONGOSEC_PATH
from bongosec_testing.constants.paths.api import BONGOSEC_API_FOLDER_PATH, BONGOSEC_API_SECURITY_FOLDER_PATH


if sys.platform == WINDOWS:
    BASE_CONF_PATH = BONGOSEC_PATH
else:
    BASE_CONF_PATH = os.path.join(BONGOSEC_PATH, 'etc')

BONGOSEC_CLIENT_KEYS_PATH = os.path.join(BASE_CONF_PATH, 'client.keys')
SHARED_CONFIGURATIONS_PATH = os.path.join(BASE_CONF_PATH, 'shared')
BONGOSEC_CONF_PATH = os.path.join(BASE_CONF_PATH, 'ossec.conf')
BONGOSEC_LOCAL_INTERNAL_OPTIONS = os.path.join(BASE_CONF_PATH, 'local_internal_options.conf')
ACTIVE_RESPONSE_CONFIGURATION = os.path.join(SHARED_CONFIGURATIONS_PATH, 'ar.conf')
AR_CONF = os.path.join(SHARED_CONFIGURATIONS_PATH, 'ar.conf')
CUSTOM_RULES_PATH = os.path.join(BASE_CONF_PATH, 'rules')
CUSTOM_RULES_FILE = os.path.join(CUSTOM_RULES_PATH, 'local_rules.xml')
CUSTOM_DECODERS_PATH = os.path.join(BASE_CONF_PATH, 'decoders')
CUSTOM_DECODERS_FILE = os.path.join(CUSTOM_DECODERS_PATH, 'local_decoder.xml')
DEFAULT_AUTHD_PASS_PATH = os.path.join(BASE_CONF_PATH, 'authd.pass')

# Bongosec API configurations path
BONGOSEC_API_CONFIGURATION_PATH = os.path.join(BONGOSEC_API_FOLDER_PATH, 'configuration', 'api.yaml')
BONGOSEC_SECURITY_CONFIGURATION_PATH = os.path.join(BONGOSEC_API_SECURITY_FOLDER_PATH, 'security.yaml')
