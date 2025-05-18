# Copyright (C) 2015-2024, Bongosec Inc.
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

import pytest

from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH
from bongosec_testing.modules.modulesd import patterns
from bongosec_testing.tools.monitors.file_monitor import FileMonitor
from bongosec_testing.utils import callbacks


@pytest.fixture()
def wait_for_office365_start():
    # Wait for module office365 starts
    bongosec_log_monitor = FileMonitor(BONGOSEC_LOG_PATH)
    bongosec_log_monitor.start(callback=callbacks.generate_callback(patterns.MODULESD_STARTED, {
                              'integration': 'Office365'
                          }))
    assert (bongosec_log_monitor.callback_result == None), f'Error invalid configuration event not detected'
