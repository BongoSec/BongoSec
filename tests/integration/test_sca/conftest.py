"""
 Copyright (C) 2015-2024, Bongosec Inc.
 Created by BongoSec <info@khulnasoft.com>.
 This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
"""
import pytest
import sys

from bongosec_testing.tools.monitors import file_monitor
from bongosec_testing.modules.modulesd.sca import patterns
from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH
from bongosec_testing.utils import callbacks
from bongosec_testing.constants.platforms import WINDOWS


# Fixtures
@pytest.fixture()
def wait_for_sca_enabled():
    '''
    Wait for the sca module to start.
    '''
    log_monitor = file_monitor.FileMonitor(BONGOSEC_LOG_PATH)
    log_monitor.start(callback=callbacks.generate_callback(patterns.CB_SCA_ENABLED), timeout=60 if sys.platform == WINDOWS else 10)
    assert log_monitor.callback_result
