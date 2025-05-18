# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import os
import sys

from bongosec_testing.constants.platforms import WINDOWS

from . import BONGOSEC_PATH


VAR_PATH = os.path.join(BONGOSEC_PATH, 'var')
VAR_RUN_PATH = os.path.join(VAR_PATH, 'run')

ANALYSISD_STATE = os.path.join(VAR_RUN_PATH, 'bongosec-analysisd.state')

if sys.platform == WINDOWS:
    VERSION_FILE = os.path.join(BONGOSEC_PATH, 'VERSION.json')
    AGENTD_STATE = os.path.join(BONGOSEC_PATH, 'bongosec-agent.state')
else:
    VERSION_FILE = ''
    AGENTD_STATE = os.path.join(VAR_RUN_PATH, 'bongosec-agentd.state')

VAR_MULTIGROUPS_PATH = os.path.join(VAR_PATH, 'multigroups')
