# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import sys
import os

from bongosec_testing.constants.platforms import MACOS, WINDOWS

TEMP_FILE_PATH = '/tmp'

if sys.platform == WINDOWS:
    BONGOSEC_PATH = os.path.join("C:", os.sep, "Program Files (x86)", "ossec-agent")
    ROOT_PREFIX = os.path.join('c:', os.sep)

elif sys.platform == MACOS:
    BONGOSEC_PATH = os.path.join("/", "Library", "Ossec")
    ROOT_PREFIX = os.path.join('/', 'private', 'var', 'root')

else:
    BONGOSEC_PATH = os.path.join("/", "var", "ossec")
    ROOT_PREFIX = os.sep
