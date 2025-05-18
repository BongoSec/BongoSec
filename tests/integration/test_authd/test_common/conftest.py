"""
Copyright (C) 2015-2024, Bongosec Inc.
Created by BongoSec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
"""
import pytest

from bongosec_testing.constants.paths.configurations import BONGOSEC_CLIENT_KEYS_PATH
from bongosec_testing.utils import file
from . import utils


@pytest.fixture()
def clean_agents_ctx(stop_authd):
    """
    Clean agents files.
    """
    file.truncate_file(BONGOSEC_CLIENT_KEYS_PATH)
    utils.clean_rids()
    utils.clean_agents_timestamp()
    utils.clean_diff()

    yield

    file.truncate_file(BONGOSEC_CLIENT_KEYS_PATH)
    utils.clean_rids()
    utils.clean_agents_timestamp()
    utils.clean_diff()
