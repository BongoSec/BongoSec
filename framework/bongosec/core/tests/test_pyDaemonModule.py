# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is a free software; you can redistribute it and/or modify it under the terms of GPLv2

from unittest.mock import patch
import pytest

from bongosec.core.pyDaemonModule import *
from bongosec.core.exception import BongosecException
from tempfile import NamedTemporaryFile, TemporaryDirectory


@pytest.mark.parametrize('effect', [
   None,
   OSError(10000, 'Error')
])
@patch('bongosec.core.pyDaemonModule.sys.exit')
@patch('bongosec.core.pyDaemonModule.os.setsid')
@patch('bongosec.core.pyDaemonModule.sys.stderr.write')
@patch('bongosec.core.pyDaemonModule.sys.stdin.fileno')
@patch('bongosec.core.pyDaemonModule.os.dup2')
@patch('bongosec.core.pyDaemonModule.os.chdir')
def test_pyDaemon(mock_chdir, mock_dup, mock_fileno, mock_write, mock_setsid, mock_exit, effect):
    """Tests pyDaemon function works"""

    with patch('bongosec.core.pyDaemonModule.os.fork', return_value=255, side_effect=effect):
        pyDaemon()

    if effect == None:
        mock_exit.assert_called_with(0)
    else:
        mock_exit.assert_called_with(1)
    mock_setsid.assert_called_once_with()
    mock_chdir.assert_called_once_with('/')


@patch('bongosec.core.pyDaemonModule.common.BONGOSEC_PATH', new='/tmp')
def test_create_pid():
    """Tests create_pid function works"""

    with TemporaryDirectory() as tmpdirname:
        tmpfile = NamedTemporaryFile(dir=tmpdirname, delete=False, suffix='-255.pid')
        with patch('bongosec.core.pyDaemonModule.common.OS_PIDFILE_PATH', new=tmpdirname.split('/')[2]):
            create_pid(tmpfile.name.split('/')[3].split('-')[0], '255')


@patch('bongosec.core.pyDaemonModule.common.BONGOSEC_PATH', new='/tmp')
@patch('bongosec.core.pyDaemonModule.os.chmod', side_effect=OSError)
def test_create_pid_ko(mock_chmod):
    """Tests create_pid function exception works"""

    with TemporaryDirectory() as tmpdirname:
        tmpfile = NamedTemporaryFile(dir=tmpdirname, delete=False, suffix='-255.pid')
        with patch('bongosec.core.pyDaemonModule.common.OS_PIDFILE_PATH', new=tmpdirname.split('/')[2]):
            with pytest.raises(BongosecException, match=".* 3002 .*"):
                create_pid(tmpfile.name.split('/')[3].split('-')[0], '255')


@patch('bongosec.core.pyDaemonModule.common.BONGOSEC_PATH', new='/tmp')
def test_delete_pid():
    """Tests delete_pid function works"""

    with TemporaryDirectory() as tmpdirname:
        tmpfile = NamedTemporaryFile(dir=tmpdirname, delete=False, suffix='-255.pid')
        with patch('bongosec.core.pyDaemonModule.common.OS_PIDFILE_PATH', new=tmpdirname.split('/')[2]):
            delete_pid(tmpfile.name.split('/')[3].split('-')[0], '255')
