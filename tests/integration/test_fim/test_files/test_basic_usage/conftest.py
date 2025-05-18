# Copyright (C) 2015-2024, Bongosec Inc.
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
import pytest

from pathlib import Path

from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH
from bongosec_testing.modules.fim.patterns import EVENT_TYPE_ADDED
from bongosec_testing.tools.monitors.file_monitor import FileMonitor
from bongosec_testing.utils import file
from bongosec_testing.utils.callbacks import generate_callback


@pytest.fixture()
def path_to_edit(test_metadata: dict) -> str:
    to_edit = test_metadata.get('path_to_edit')
    is_directory = test_metadata.get('is_directory')

    if is_directory:
        file.recursive_directory_creation(to_edit)
        file.write_file(Path(to_edit, 'newfile'), 'test')
    else:
        file.write_file(to_edit, 'test')

    FileMonitor(BONGOSEC_LOG_PATH).start(generate_callback(EVENT_TYPE_ADDED))

    yield to_edit

    file.delete_path_recursively(to_edit)
