# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is a free software; you can redistribute it and/or modify it under the terms of GPLv2

from unittest.mock import patch, MagicMock

import pytest

from bongosec.core.exception import BongosecException
from bongosec.core.bongosec_socket import BongosecSocket, BongosecSocketJSON, SOCKET_COMMUNICATION_PROTOCOL_VERSION, \
    create_bongosec_socket_message


@patch('bongosec.core.bongosec_socket.BongosecSocket._connect')
def test_BongosecSocket__init__(mock_conn):
    """Tests BongosecSocket.__init__ function works"""

    BongosecSocket('test_path')

    mock_conn.assert_called_once_with()


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
def test_BongosecSocket_protected_connect(mock_conn):
    """Tests BongosecSocket._connect function works"""

    BongosecSocket('test_path')

    mock_conn.assert_called_with('test_path')


@patch('bongosec.core.bongosec_socket.socket.socket.connect', side_effect=Exception)
def test_BongosecSocket_protected_connect_ko(mock_conn):
    """Tests BongosecSocket._connect function exceptions works"""

    with pytest.raises(BongosecException, match=".* 1013 .*"):
        BongosecSocket('test_path')


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.socket.socket.close')
def test_BongosecSocket_close(mock_close, mock_conn):
    """Tests BongosecSocket.close function works"""

    queue = BongosecSocket('test_path')

    queue.close()

    mock_conn.assert_called_once_with('test_path')
    mock_close.assert_called_once_with()


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.socket.socket.send')
def test_BongosecSocket_send(mock_send, mock_conn):
    """Tests BongosecSocket.send function works"""

    queue = BongosecSocket('test_path')

    response = queue.send(b"\x00\x01")

    assert isinstance(response, MagicMock)
    mock_conn.assert_called_once_with('test_path')


@pytest.mark.parametrize('msg, effect, send_effect, expected_exception', [
    ('text_msg', 'side_effect', None, 1105),
    (b"\x00\x01", 'return_value', 0, 1014),
    (b"\x00\x01", 'side_effect', Exception, 1014)
])
@patch('bongosec.core.bongosec_socket.socket.socket.connect')
def test_BongosecSocket_send_ko(mock_conn, msg, effect, send_effect, expected_exception):
    """Tests BongosecSocket.send function exceptions works"""

    queue = BongosecSocket('test_path')

    if effect == 'return_value':
        with patch('bongosec.core.bongosec_socket.socket.socket.send', return_value=send_effect):
            with pytest.raises(BongosecException, match=f'.* {expected_exception} .*'):
                queue.send(msg)
    else:
        with patch('bongosec.core.bongosec_socket.socket.socket.send', side_effect=send_effect):
            with pytest.raises(BongosecException, match=f'.* {expected_exception} .*'):
                queue.send(msg)

    mock_conn.assert_called_once_with('test_path')


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.unpack', return_value='1024')
@patch('bongosec.core.bongosec_socket.socket.socket.recv')
def test_BongosecSocket_receive(mock_recv, mock_unpack, mock_conn):
    """Tests BongosecSocket.receive function works"""

    queue = BongosecSocket('test_path')

    response = queue.receive()

    assert isinstance(response, MagicMock)
    mock_conn.assert_called_once_with('test_path')


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.socket.socket.recv', side_effect=Exception)
def test_BongosecSocket_receive_ko(mock_recv, mock_conn):
    """Tests BongosecSocket.receive function exception works"""

    queue = BongosecSocket('test_path')

    with pytest.raises(BongosecException, match=".* 1014 .*"):
        queue.receive()

    mock_conn.assert_called_once_with('test_path')


@patch('bongosec.core.bongosec_socket.BongosecSocket._connect')
def test_BongosecSocketJSON__init__(mock_conn):
    """Tests BongosecSocketJSON.__init__ function works"""

    BongosecSocketJSON('test_path')

    mock_conn.assert_called_once_with()


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.BongosecSocket.send')
def test_BongosecSocketJSON_send(mock_send, mock_conn):
    """Tests BongosecSocketJSON.send function works"""

    queue = BongosecSocketJSON('test_path')

    response = queue.send('test_msg')

    assert isinstance(response, MagicMock)
    mock_conn.assert_called_once_with('test_path')


@pytest.mark.parametrize('raw', [
    True, False
])
@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.BongosecSocket.receive')
@patch('bongosec.core.bongosec_socket.loads', return_value={'error':0, 'message':None, 'data':'Ok'})
def test_BongosecSocketJSON_receive(mock_loads, mock_receive, mock_conn, raw):
    """Tests BongosecSocketJSON.receive function works"""
    queue = BongosecSocketJSON('test_path')
    response = queue.receive(raw=raw)
    if raw:
        assert isinstance(response, dict)
    else:
        assert isinstance(response, str)
    mock_conn.assert_called_once_with('test_path')


@patch('bongosec.core.bongosec_socket.socket.socket.connect')
@patch('bongosec.core.bongosec_socket.BongosecSocket.receive')
@patch('bongosec.core.bongosec_socket.loads', return_value={'error':10000, 'message':'Error', 'data':'KO'})
def test_BongosecSocketJSON_receive_ko(mock_loads, mock_receive, mock_conn):
    """Tests BongosecSocketJSON.receive function works"""

    queue = BongosecSocketJSON('test_path')

    with pytest.raises(BongosecException, match=".* 10000 .*"):
        queue.receive()

    mock_conn.assert_called_once_with('test_path')


@pytest.mark.parametrize('origin, command, parameters', [
    ('origin_sample', 'command_sample', {'sample': 'sample'}),
    (None, 'command_sample', {'sample': 'sample'}),
    ('origin_sample', None, {'sample': 'sample'}),
    ('origin_sample', 'command_sample', None),
    (None, None, None)
])
def test_create_bongosec_socket_message(origin, command, parameters):
    """Test create_bongosec_socket_message function."""
    response_message = create_bongosec_socket_message(origin, command, parameters)
    assert response_message['version'] == SOCKET_COMMUNICATION_PROTOCOL_VERSION
    assert response_message.get('origin') == origin
    assert response_message.get('command') == command
    assert response_message.get('parameters') == parameters
