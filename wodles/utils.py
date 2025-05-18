# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

import os
import subprocess
from functools import lru_cache
from sys import exit


@lru_cache(maxsize=None)
def find_bongosec_path() -> str:
    """
    Get the Bongosec installation path.

    Returns
    -------
    str
        Path where Bongosec is installed or empty string if there is no framework in the environment.
    """
    abs_path = os.path.abspath(os.path.dirname(__file__))
    allparts = []
    while 1:
        parts = os.path.split(abs_path)
        if parts[0] == abs_path:  # sentinel for absolute paths
            allparts.insert(0, parts[0])
            break
        elif parts[1] == abs_path:  # sentinel for relative paths
            allparts.insert(0, parts[1])
            break
        else:
            abs_path = parts[0]
            allparts.insert(0, parts[1])

    bongosec_path = ''
    try:
        for i in range(0, allparts.index('wodles')):
            bongosec_path = os.path.join(bongosec_path, allparts[i])
    except ValueError:
        pass

    return bongosec_path


def call_bongosec_control(option: str) -> str:
    """
    Execute the bongosec-control script with the parameters specified.

    Parameters
    ----------
    option : str
        The option that will be passed to the script.

    Returns
    -------
    str
        The output of the call to bongosec-control.
    """
    bongosec_control = os.path.join(find_bongosec_path(), "bin", "bongosec-control")
    try:
        proc = subprocess.Popen([bongosec_control, option], stdout=subprocess.PIPE)
        (stdout, stderr) = proc.communicate()
        return stdout.decode()
    except (OSError, ChildProcessError):
        print(f'ERROR: a problem occurred while executing {bongosec_control}')
        exit(1)


def get_bongosec_info(field: str) -> str:
    """
    Execute the bongosec-control script with the 'info' argument, filtering by field if specified.

    Parameters
    ----------
    field : str
        The field of the output that's being requested. Its value can be 'BONGOSEC_VERSION', 'BONGOSEC_REVISION' or
        'BONGOSEC_TYPE'.

    Returns
    -------
    str
        The output of the bongosec-control script.
    """
    bongosec_info = call_bongosec_control("info")
    if not bongosec_info:
        return "ERROR"

    if not field:
        return bongosec_info

    env_variables = bongosec_info.rsplit("\n")
    env_variables.remove("")
    bongosec_env_vars = dict()
    for env_variable in env_variables:
        key, value = env_variable.split("=")
        bongosec_env_vars[key] = value.replace("\"", "")

    return bongosec_env_vars[field]


@lru_cache(maxsize=None)
def get_bongosec_version() -> str:
    """
    Return the version of Bongosec installed.

    Returns
    -------
    str
        The version of Bongosec installed.
    """
    return get_bongosec_info("BONGOSEC_VERSION")


@lru_cache(maxsize=None)
def get_bongosec_revision() -> str:
    """
    Return the revision of the Bongosec instance installed.

    Returns
    -------
    str
        The revision of the Bongosec instance installed.
    """
    return get_bongosec_info("BONGOSEC_REVISION")


@lru_cache(maxsize=None)
def get_bongosec_type() -> str:
    """
    Return the type of Bongosec instance installed.

    Returns
    -------
    str
        The type of Bongosec instance installed.
    """
    return get_bongosec_info("BONGOSEC_TYPE")


ANALYSISD = os.path.join(find_bongosec_path(), 'queue', 'sockets', 'queue')
# Max size of the event that ANALYSISID can handle
MAX_EVENT_SIZE = 65535
