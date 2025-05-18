#!/usr/bin/env python

# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

from bongosec import __version__

from setuptools import setup, find_namespace_packages

setup(name='bongosec',
      version=__version__,
      description='Bongosec control with Python',
      url='https://github.com/bongosec',
      author='Bongosec',
      author_email='hello@bongosec.github.io',
      license='GPLv2',
      packages=find_namespace_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
      package_data={'bongosec': ['core/bongosec.json',
                              'core/cluster/cluster.json', 'rbac/default/*.yaml']},
      include_package_data=True,
      install_requires=[],
      zip_safe=False,
      )
