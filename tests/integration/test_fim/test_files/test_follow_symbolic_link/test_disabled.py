'''
copyright: Copyright (C) 2015-2024, Bongosec Inc.

           Created by BongoSec <info@khulnasoft.com>.

           This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

type: integration

brief: File Integrity Monitoring (FIM) system watches selected files and triggering alerts when these
       files are modified. In particular, these tests will check if FIM events are still generated when
       a monitored directory is deleted and created again.
       The FIM capability is managed by the 'bongosec-syscheckd' daemon, which checks configured files
       for changes to the checksums, permissions, and ownership.

components:
    - fim

suite: basic_usage

targets:
    - agent

daemons:
    - bongosec-syscheckd

os_platform:
    - linux

os_version:
    - Arch Linux
    - Amazon Linux 2
    - Amazon Linux 1
    - CentOS 8
    - CentOS 7
    - Debian Buster
    - Red Hat 8
    - Ubuntu Focal
    - Ubuntu Bionic

references:
    - https://man7.org/linux/man-pages/man8/auditd.8.html
    - https://documentation.bongosec.github.io/current/user-manual/capabilities/auditing-whodata/who-linux.html
    - https://documentation.bongosec.github.io/current/user-manual/capabilities/file-integrity/index.html
    - https://documentation.bongosec.github.io/current/user-manual/reference/ossec-conf/syscheck.html

pytest_args:
    - fim_mode:
        realtime: Enable real-time monitoring on Linux (using the 'inotify' system calls) and Windows systems.
        whodata: Implies real-time monitoring but adding the 'who-data' information.
    - tier:
        0: Only level 0 tests are performed, they check basic functionalities and are quick to perform.
        1: Only level 1 tests are performed, they check functionalities of medium complexity.
        2: Only level 2 tests are performed, they check advanced functionalities and are slow to perform.

tags:
    - fim
'''
import sys
import pytest

from pathlib import Path

from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH
from bongosec_testing.constants.platforms import WINDOWS
from bongosec_testing.constants.platforms import MACOS
from bongosec_testing.modules.agentd.configuration import AGENTD_DEBUG, AGENTD_WINDOWS_DEBUG
from bongosec_testing.modules.fim.patterns import EVENT_TYPE_ADDED, EVENT_TYPE_DELETED, LINKS_SCAN_FINALIZED
from bongosec_testing.modules.monitord.configuration import MONITORD_ROTATE_LOG
from bongosec_testing.modules.fim.configuration import SYMLINK_SCAN_INTERVAL, SYSCHECK_DEBUG
from bongosec_testing.tools.monitors.file_monitor import FileMonitor
from bongosec_testing.utils import file
from bongosec_testing.utils.callbacks import generate_callback
from bongosec_testing.utils.configuration import get_test_cases_data, load_configuration_template

from . import TEST_CASES_PATH, CONFIGS_PATH


# Pytest marks to run on any service type on linux or windows.
pytestmark = [pytest.mark.agent, pytest.mark.linux, pytest.mark.darwin, pytest.mark.darwin, pytest.mark.tier(level=0)]

# Test metadata, configuration and ids.
cases_path = Path(TEST_CASES_PATH, 'cases_disabled.yaml')
config_path = Path(CONFIGS_PATH, 'configuration_disabled.yaml')
test_configuration, test_metadata, cases_ids = get_test_cases_data(cases_path)
test_configuration = load_configuration_template(config_path, test_configuration, test_metadata)

# Set configurations required by the fixtures.
local_internal_options = {SYSCHECK_DEBUG: 2, AGENTD_DEBUG: 2, MONITORD_ROTATE_LOG: 0, SYMLINK_SCAN_INTERVAL: 2}
if sys.platform == WINDOWS: local_internal_options.update({AGENTD_WINDOWS_DEBUG: 2})


@pytest.mark.parametrize('test_configuration, test_metadata', zip(test_configuration, test_metadata), ids=cases_ids)
def test_disabled(test_configuration, test_metadata, set_bongosec_configuration, truncate_monitored_files,
                  configure_local_internal_options, folder_to_monitor, symlink_target, symlink,
                  symlink_new_target, daemons_handler, start_monitoring):

    if sys.platform == MACOS and not test_metadata['fim_mode'] == 'scheduled':
        pytest.skip(reason="Realtime and whodata are not supported on macos")

    bongosec_log_monitor = FileMonitor(BONGOSEC_LOG_PATH)
    testfile_name = 'testie.txt'

    # Create in original target.
    file.truncate_file(BONGOSEC_LOG_PATH)
    file.write_file(symlink.joinpath(testfile_name))
    bongosec_log_monitor.start(generate_callback(EVENT_TYPE_ADDED))
    assert not bongosec_log_monitor.callback_result

    # Delete in original target.
    file.remove_file(symlink.joinpath(testfile_name))
    bongosec_log_monitor.start(generate_callback(EVENT_TYPE_DELETED))
    assert not bongosec_log_monitor.callback_result

    # Change target.
    file.modify_symlink_target(symlink_new_target, symlink)
    bongosec_log_monitor.start(generate_callback(LINKS_SCAN_FINALIZED))
    assert bongosec_log_monitor.callback_result
    bongosec_log_monitor.start(generate_callback(EVENT_TYPE_ADDED))
    file.truncate_file(BONGOSEC_LOG_PATH)

    # Create in new target.
    file.write_file(symlink.joinpath(testfile_name))
    bongosec_log_monitor.start(generate_callback(EVENT_TYPE_ADDED))
    assert not bongosec_log_monitor.callback_result

    # Delete in new target.
    file.remove_file(symlink.joinpath(testfile_name))
    bongosec_log_monitor.start(generate_callback(EVENT_TYPE_DELETED))
    assert not bongosec_log_monitor.callback_result
