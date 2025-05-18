#!/usr/bin/env python
# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

from unittest.mock import patch

import pytest

from bongosec.tests.util import InitWDBSocketMock

with patch('bongosec.core.common.bongosec_uid'):
    with patch('bongosec.core.common.bongosec_gid'):
        from bongosec.core.syscollector import *
        from bongosec.core import common


# Tests

@pytest.mark.parametrize("os_name", [
    'Windows',
    'Linux'
])
@patch('bongosec.core.agent.Agent.get_basic_information')
def test_get_valid_fields(mock_info, os_name):
    """Check get_valid_fields returns expected type and content

    Parameters
    ----------
    os_name : str
        Request information of this OS.
    """
    with patch('bongosec.core.agent.Agent.get_agent_os_name', return_value=os_name):
        response = get_valid_fields(Type.OS, '0')
        assert isinstance(response, tuple) and isinstance(response[1], dict), 'Data type not expected'
        assert 'sys_osinfo' in response[0], f'"sys_osinfo" not contained in {response}'


@patch('bongosec.core.utils.path.exists', return_value=True)
@patch('bongosec.core.agent.Agent.get_basic_information', return_value=None)
@patch('bongosec.core.agent.Agent.get_agent_os_name', return_value='Linux')
def test_BongosecDBQuerySyscollector(mock_basic_info, mock_agents_info, mock_exists):
    """Verify that the method connects correctly to the database and returns the correct type."""
    with patch('bongosec.core.utils.BongosecDBConnection') as mock_wdb:
        mock_wdb.return_value = InitWDBSocketMock(sql_schema_file='schema_syscollector_000.sql')
        db_query = BongosecDBQuerySyscollector(agent_id='000', offset=0, limit=common.DATABASE_LIMIT, select=None,
                                            search=None, sort=None, filters=None,
                                            fields=get_valid_fields(Type.OS, '000')[1], table='sys_osinfo',
                                            array=True, nested=True, query='')
        db_query._filter_status(None)
        data = db_query.run()
        assert isinstance(db_query, BongosecDBQuerySyscollector) and isinstance(data, dict)
