"""
Copyright (C) 2025, Bongosec
Created by Bongosec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
"""
import os

from . import BONGOSEC_PATH


# Paths that are mainly used by the Analysisd module but serves to other modules too
DEFAULT_RULESET_PATH = os.path.join(BONGOSEC_PATH, 'ruleset')
DEFAULT_RULES_PATH = os.path.join(DEFAULT_RULESET_PATH, 'rules')
DEFAULT_DECODERS_PATH = os.path.join(DEFAULT_RULESET_PATH, 'decoders')
CIS_RULESET_PATH = os.path.join(DEFAULT_RULESET_PATH, 'sca')
