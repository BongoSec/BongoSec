'''
copyright: Copyright (C) 2015-2024, Bongosec.
           Created by BongoSec <info@khulnasoft.com>.
           This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

type: integration

brief: Bongosec-db is the daemon in charge of the databases with all the Bongosec persistent information, exposing a socket
       to receive requests and provide information. Bongosec-db has the capability to do automatic database backups, based
       on the configuration parameters. This test, checks the proper working of the backup configuration and the
       backup files are generated correctly.

tier: 0

modules:
    - bongosec_db

components:
    - manager

daemons:
    - bongosec-db

os_platform:
    - linux

os_version:
    - Arch Linux
    - Amazon Linux 2
    - Amazon Linux 1
    - CentOS 8
    - CentOS 7
    - CentOS 6
    - Ubuntu Focal
    - Ubuntu Bionic
    - Ubuntu Xenial
    - Ubuntu Trusty
    - Debian Buster
    - Debian Stretch
    - Debian Jessie
    - Debian Wheezy
    - Red Hat 8
    - Red Hat 7
    - Red Hat 6

references:
    - https://documentation.bongosec.github.io/current/user-manual/reference/daemons/bongosec-db.html

tags:
    - bongosec_db
'''
import os
from pathlib import Path
import subprocess

import pytest
import time
import numbers
import glob

from bongosec_testing.utils.services import control_service
from bongosec_testing.tools.monitors import file_monitor
from bongosec_testing.utils import callbacks
from bongosec_testing.constants.paths.logs import BONGOSEC_PATH, BONGOSEC_LOG_PATH
from bongosec_testing.utils.time import validate_interval_format, time_to_seconds
from bongosec_testing.modules.bongosec_db import patterns
from bongosec_testing.utils import configuration

from . import CONFIGURATIONS_FOLDER_PATH, TEST_CASES_FOLDER_PATH

# Marks
pytestmark =  [pytest.mark.server, pytest.mark.tier(level=0)]

# Configuration
t_config_path = Path(CONFIGURATIONS_FOLDER_PATH, 'configuration_bongosec_db_backups_conf.yaml')
t_cases_path = Path(TEST_CASES_FOLDER_PATH, 'cases_bongosec_db_backups_conf.yaml')
t_config_parameters, t_config_metadata, t_case_ids = configuration.get_test_cases_data(t_cases_path)
t_configurations = configuration.load_configuration_template(t_config_path, t_config_parameters, t_config_metadata)

backups_path = Path(BONGOSEC_PATH, 'backup', 'db')

# Variables
interval = 5
timeout = 15

# Tests
@pytest.mark.parametrize('test_configuration, test_metadata', zip(t_configurations, t_config_metadata), ids=t_case_ids)
def test_wdb_backup_configs(test_configuration, test_metadata, set_bongosec_configuration,
                            truncate_monitored_files, remove_backups):
    '''
    description: Check that given different wdb backup configuration parameters, the expected behavior is achieved.
                 For this, the test gets a series of parameters for the bongosec_db_backups_conf.yaml file and applies
                 them to the manager's ossec.conf. It checks in case of erroneous configurations that the manager was
                 unable to start; otherwise it will check that after creating "max_files+1", there are a total of
                 "max_files" backup files in the backup folder.

    bongosec_min_version: 4.4.0

    parameters:
        - test_configuration:
            type: dict
            brief: Configuration loaded from `configuration_templates`.
        - test_metadata:
            type: dict
            brief: Test case metadata.
        - set_bongosec_configuration:
            type: fixture
            brief: Apply changes to the ossec.conf configuration.
        - truncate_monitored_files:
            type: fixture
            brief: Truncate all the log files and json alerts files before and after the test execution.
        - remove_backups:
            type: fixture
            brief: Creates the folder where the backups will be stored in case it doesn't exist. It clears it when the
                   test yields.
    assertions:
        - Verify that manager starts behavior is correct for any given configuration.
        - Verify that the backup file has been created, wait for "max_files+1".
        - Verify that after "max_files+1" files created, there's only "max_files" in the folder.

    input_description:
        - Test cases are defined in the parameters and metada variables, that will be applied to the the
          bongosec_db_backup_command.yaml file. The parameters tested are: "enabled", "interval" and "max_files".
          With the given input the test will check the correct behavior of wdb automatic global db backups.

    expected_output:
        - f"Invalid value element for interval..."
        - f"Invalid value element for max_files..."
        - f'Did not receive expected "Created Global database..." event'
        - f'Expected {test_max_files} backup creation messages, but got {result}'
        - f'Wrong backup file ammount, expected {test_max_files} but {total_files} are present in folder.

    tags:
        - bongosec_db
        - wdb_socket

    '''
    test_interval = test_metadata['interval']
    test_max_files = test_metadata['max_files']
    bongosec_log_monitor = file_monitor.FileMonitor(BONGOSEC_LOG_PATH)
    try:
        control_service('restart')
    except (subprocess.CalledProcessError, ValueError) as err:
        if not validate_interval_format(test_interval):
            bongosec_log_monitor.start(callback=callbacks.generate_callback(patterns.WRONG_INTERVAL_CALLBACK), timeout=timeout)
            assert bongosec_log_monitor.callback_result, 'Did not receive expected ' \
                                                    '"Invalid value element for interval..." event'

            return
        elif not isinstance(test_max_files, numbers.Number) or test_max_files==0:
            bongosec_log_monitor.start(callback=callbacks.generate_callback(patterns.WRONG_MAX_FILES_CALLBACK), timeout=timeout)
            assert bongosec_log_monitor.callback_result, 'Did not receive expected ' \
                                                        '"Invalid value element for max_files..." event'
            return
        else:
            pytest.fail(f"Got unexpected Error: {err}")

    interval = time_to_seconds(test_interval)
    # Wait for backup files to be generated
    time.sleep(interval*(int(test_max_files)+1))

    # Manage if backup generation is not enabled - no backups expected
    if test_metadata['enabled'] == 'no':
        # Fail the test if a file or more were found in the backups_path
        if os.listdir(backups_path):
            pytest.fail("Error: A file was found in backups_path. No backups where expected when enabled is 'no'.")
    # Manage if backup generation is enabled - one or more backups expected
    else:
        bongosec_log_monitor.start(callback=callbacks.generate_callback(patterns.BACKUP_CREATION_CALLBACK),
                                        timeout=timeout, accumulations=int(test_max_files)+1)
        result = bongosec_log_monitor.callback_result
        assert result, 'Did not receive expected\
                        "Created Global database..." event'


        assert len(result) == int(test_max_files)+1, f'Expected {test_max_files} backup creation messages, but got {result}.'
        files = glob.glob(str(backups_path) + '/*.gz')
        total_files = len(files)
        assert total_files == int(test_max_files), f'Wrong backup file ammount, expected {test_max_files}' \
                                                f' but {total_files} are present in folder: {files}'
