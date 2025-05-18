# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
from . import MODULESD_PREFIX


# Callback patterns to find events in log file.
MODULESD_CONFIGURATION_ERROR = r".*ERROR: {error_type} content for tag '{tag}' at module '{integration}'."
MODULESD_STARTED = r".*INFO: Module {integration} started."
CONFIGURATION_ERROR = r'.*ERROR.*Configuration error at.*'
