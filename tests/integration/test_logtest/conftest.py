# Copyright (C) 2015-2024, Bongosec.
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

import pytest

from bongosec_testing.modules.analysisd.patterns import LOGTEST_STARTED
from bongosec_testing.tools.monitors.file_monitor import FileMonitor
from bongosec_testing.utils.callbacks import generate_callback
from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH

@pytest.fixture(scope='module')
def wait_for_logtest_startup(request):
    """Wait until logtest has begun."""
    log_monitor = FileMonitor(BONGOSEC_LOG_PATH)
    log_monitor.start(callback=generate_callback(LOGTEST_STARTED), timeout=40, only_new_events=True)
