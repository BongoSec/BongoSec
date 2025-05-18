# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import os
import sys

from bongosec_testing.constants.platforms import WINDOWS

from . import BONGOSEC_PATH

if sys.platform == WINDOWS:
    BIN_PATH = BONGOSEC_PATH
    AGENT_AUTH_PATH = os.path.join(BONGOSEC_PATH, 'agent-auth.exe')
else:
    BIN_PATH = os.path.join(BONGOSEC_PATH, 'bin')
    AGENT_AUTH_PATH= os.path.join(BIN_PATH, 'agent-auth')

BONGOSEC_CONTROL_PATH = os.path.join(BIN_PATH, 'bongosec-control')
AGENT_AUTH_PATH = os.path.join(BIN_PATH, 'agent-auth')
ACTIVE_RESPONSE_BIN_PATH = os.path.join(BONGOSEC_PATH, 'active-response', 'bin')
ACTIVE_RESPONSE_FIREWALL_DROP = os.path.join(ACTIVE_RESPONSE_BIN_PATH, 'firewall-drop')
MANAGE_AGENTS_BINARY = os.path.join(BIN_PATH, 'manage_agents')
AGENT_GROUPS_BINARY = os.path.join(BIN_PATH, 'agent_groups')
