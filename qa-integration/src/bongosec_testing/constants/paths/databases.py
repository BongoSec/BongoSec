# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import os
from . import BONGOSEC_PATH


CVE_DB_PATH = os.path.join(BONGOSEC_PATH, 'queue', 'vulnerabilities', 'cve.db')
CPE_HELPER_PATH = os.path.join(BONGOSEC_PATH, 'queue', 'vulnerabilities', 'dictionaries', 'cpe_helper.json')
