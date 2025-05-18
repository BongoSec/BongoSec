# qa-integration
Bongosec QA framework for integration tests

## Installation

1. The framework is already available in the local directory at `qa-integration/`
2. Install python deps: `apt-get install python3 python3-dev python3-pip -y`
3. Install the framework: `pip install qa-integration/`
    > It will also install all the dependencies from the requirements.txt automatically.

## Usage

You can just import it from the test suite as any other python library
```python
from bongosec_testing.constants.paths.logs import BONGOSEC_LOG_PATH
from bongosec_testing.modules.analysisd import patterns
from bongosec_testing.tools.monitors.file_monitor import FileMonitor
from bongosec_testing.utils import callbacks


monitor = FileMonitor(BONGOSEC_LOG_PATH)
monitor.start(callback=callbacks.generate_callback(patterns.ANALYSISD_STARTED))

```
