# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is a free software; you can redistribute it and/or modify it under the terms of GPLv2

from unittest.mock import patch
import pytest


with patch('bongosec.core.common.bongosec_uid'):
    with patch('bongosec.core.common.bongosec_gid'):
        from bongosec.core.task import *
        from bongosec.core.utils import BongosecDBQuery


def test_bongosec_db_query_task__init__():
    """Check if BongosecDBQueryTask is properly initialized."""
    with patch('bongosec.core.utils.BongosecDBQuery.__init__') as mock_wdbq, \
            patch('bongosec.core.utils.BongosecDBBackend.__init__', return_value=None) as mock_wdb_backend:
        BongosecDBQueryTask()
        mock_wdbq.assert_called_once()
        mock_wdb_backend.assert_called_with(query_format='task')


@patch('bongosec.core.bongosec_socket.BongosecSocket._connect')
@patch('bongosec.core.bongosec_socket.BongosecSocket.receive', return_value=b'"{\'test\':\'test\'}"')
@patch('bongosec.core.bongosec_socket.BongosecSocket.send')
@patch('bongosec.core.bongosec_socket.BongosecSocket.close')
def test_send_to_tasks_socket(mock_close, mock_send, mock_receive, mock_connect):
    """Check if the function send_to_tasks_socket works properly.

    Parameters
    ----------
        mock_send: MagicMock
            Mock of BongosecSocket's method send.
        mock_connect: MagicMock
            Mock of BongosecSocket's method connect.
        mock_close: MagicMock
            Mock of BongosecSocket's method close.
        mock_receive: MagicMock
            Mock of BongosecSocket's method receive.
    """
    command = {'test': 'test'}
    send_to_tasks_socket(command)
    mock_send.assert_called_with(b'{"test": "test"}')
    mock_close.assert_called_once()


def test_send_to_tasks_socket_ko():
    """Check if the function send_to_tasks_socket raises an exception when there's an error with the socket."""
    with pytest.raises(BongosecInternalError, match=".* 1121 .*"):
        send_to_tasks_socket({'test': 'test'})


def test_bongosec_db_query_task__final_query():
    """Check if BongosecDBQueryTask's method _final_query works properly."""
    with patch('bongosec.core.utils.BongosecDBBackend.__init__', return_value=None), \
            patch('bongosec.core.utils.BongosecDBQuery._default_query', return_value='test'):
        wdbq_task = BongosecDBQueryTask()
        assert wdbq_task._final_query() == f'test WHERE task_id IN (test) LIMIT :limit OFFSET :offset'


def test_bongosec_db_query_task__format_data_into_dictionary():
    """Check that BongosecDBQueryTask's method _format_data_into_dictionary works properly."""
    data = [
        {'task_id': 1, 'agent_id': '002', 'node': 'worker1', 'module': 'upgrade_module', 'command': 'upgrade',
         'create_time': 1606466932, 'last_update_time': 1606466953, 'status': 'Legacy', 'error_message': None}
    ]

    with patch('bongosec.core.utils.BongosecDBBackend.__init__', return_value=None), \
            patch('bongosec.core.utils.BongosecDBQuery._default_query', return_value='test'):
        wdbq_task = BongosecDBQueryTask()

    wdbq_task._data = data
    result = wdbq_task._format_data_into_dictionary()

    assert result['items'][0]['task_id'] == 1
    assert result['items'][0]['agent_id'] == '002'
    assert result['items'][0]['node'] == 'worker1'
    assert result['items'][0]['module'] == 'upgrade_module'
    assert result['items'][0]['command'] == 'upgrade'
    assert result['items'][0]['create_time'] == '2020-11-27T08:48:52Z'
    assert result['items'][0]['last_update_time'] == '2020-11-27T08:49:13Z'
    assert result['items'][0]['status'] == 'Legacy'
    assert result['items'][0]['error_message'] == None


@pytest.mark.parametrize('field_name, field_filter, q_filter', [
    ('agent_list', 'field', {'value': '1', 'operator': 'LIKE'}),
    ('task_list', 'test', {'value': '1', 'operator': 'LIKE'}),
    ('test_field', 'test', {'value': '1', 'operator': 'LIKE'})
])
def test_bongosec_db_query_task__process_filter(field_name, field_filter, q_filter):
    """Check that BongosecDBQueryTask's method _process_filter works properly."""
    with patch('bongosec.core.utils.BongosecDBBackend.__init__', return_value=None), \
            patch('bongosec.core.utils.BongosecDBQuery._default_query', return_value='test'):
        wdbq_task = BongosecDBQueryTask()

    with patch.object(BongosecDBQuery, '_process_filter') as mock_sup_proc:
        wdbq_task._process_filter(field_name, field_filter, q_filter)
        if field_name == 'agent_list':
            assert f'agent_id {q_filter["operator"]} (:{field_filter})' in wdbq_task.query
            assert wdbq_task.request[field_filter] == q_filter['value']
        elif field_name == 'task_list':
            assert f'task_id {q_filter["operator"]} (:{field_filter})' in wdbq_task.query
            assert wdbq_task.request[field_filter] == q_filter['value']
        else:
            mock_sup_proc.assert_called()
