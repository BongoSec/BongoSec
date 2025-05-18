'''
copyright: Copyright (C) 2015-2024, Bongosec Inc.

           Created by BongoSec <info@khulnasoft.com>.

           This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

type: integration

brief: Bongosec-db is the daemon in charge of the databases with all the Bongosec persistent information, exposing a socket
       to receive requests and provide information. The Bongosec core uses list-based databases to store information
       related to agent keys, and FIM/Rootcheck event data.
       This test checks that the agent database version is the expected one. To do this, it performs a query to the agent
       database that gets the database version.

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
import pytest

from bongosec_testing.utils.database import query_wdb
from bongosec_testing.tools.simulators import agent_simulator as ag


# Marks
pytestmark = [pytest.mark.server, pytest.mark.tier(level=0)]

# Variables
expected_database_version = '15'

# Test daemons to restart.
daemons_handler_configuration = {'all_daemons': True}

# Tests
def test_agent_database_version(daemons_handler, simulate_agent):
    '''
    description: Check that the agent database version is the expected one. To do this, it performs a query to the agent
                 database that gets the database version.

    test_phases:
        - setup:
            - Restart bongosec-manager service.
        - test:
            - Get the version of the manager database through the socket
            - Get the version of the agent database through the socket
            - Check that the manager database version is the expected one.
            - Check that the agent database version is the expected one.

    bongosec_min_version: 4.4.0

    parameters:
        - daemons_handler:
            type: fixture
            brief: Restart the bongosec service.
        - simulate_agent:
            type: fixture
            brief: Simulate an agent

    assertions:
        - Verify that database version is the expected one.

    expected_output:
        - Database version: 12

    tags:
        - bongosec_db
        - wdb_socket
    '''
    agent = simulate_agent

    manager_version = query_wdb("agent 0 sql SELECT value FROM metadata WHERE key='db_version'")[0]['value']
    agent_version = query_wdb(f"agent {agent.id} sql SELECT value FROM metadata WHERE key='db_version'")[0]['value']

    assert manager_version == expected_database_version, 'The manager database version is not the expected one. \n' \
                                                         f'Expected version: {expected_database_version}\n'\
                                                         f'Obtained version: {manager_version}'
    assert agent_version == expected_database_version, 'The agent database version is not the expected one. \n' \
                                                       f'Expected version: {expected_database_version}\n'\
                                                       f'Obtained version: {agent_version}'
