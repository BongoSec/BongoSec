"""
Copyright (C) 2025, Bongosec
Created by Bongosec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
"""
import os

from . import BONGOSEC_PATH

# API paths that do not fit in `configurations`

# Folders
BONGOSEC_API_FOLDER_PATH = os.path.join(BONGOSEC_PATH, 'api')
BONGOSEC_API_CONFIGURATION_FOLDER_PATH = os.path.join(BONGOSEC_API_FOLDER_PATH, 'configuration')
BONGOSEC_API_SECURITY_FOLDER_PATH = os.path.join(BONGOSEC_API_CONFIGURATION_FOLDER_PATH, 'security')
BONGOSEC_API_SCRIPTS_FOLDER_PATH = os.path.join(BONGOSEC_API_FOLDER_PATH, 'scripts')

# API scripts paths
BONGOSEC_API_SCRIPT = os.path.join(BONGOSEC_API_SCRIPTS_FOLDER_PATH, 'bongosec_apid.py')

# Databases paths
RBAC_DATABASE_PATH = os.path.join(BONGOSEC_API_SECURITY_FOLDER_PATH, 'rbac.db')

# SSL paths
BONGOSEC_API_CERTIFICATE = os.path.join(BONGOSEC_API_CONFIGURATION_FOLDER_PATH, 'ssl', 'server.crt')
