# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

import sys

from bongosec_testing.constants.platforms import WINDOWS


if sys.platform == WINDOWS:
    PREFIX = r'.*execd.*'
else:
    PREFIX = r'.*bongosec-execd.*'
