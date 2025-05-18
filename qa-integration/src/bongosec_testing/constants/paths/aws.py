# Copyright (C) 2015, Bongosec Inc.
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

"""
    File contains all paths variables used in the AWS test suite.
"""

from pathlib import Path

# Local imports
from . import BONGOSEC_PATH

AWS_MODULE_PATH = Path(BONGOSEC_PATH, 'wodles', 'aws')
S3_CLOUDTRAIL_DB_PATH = Path(AWS_MODULE_PATH, 's3_cloudtrail.db')
AWS_SERVICES_DB_PATH = Path(AWS_MODULE_PATH, 'aws_services.db')
AWS_BINARY_PATH = Path(AWS_MODULE_PATH, 'aws-s3')
