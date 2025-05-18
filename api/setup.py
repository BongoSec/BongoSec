#!/usr/bin/env python

# This program is a free software; you can redistribute it and/or modify it under the terms of GPLv2

from setuptools import setup, find_namespace_packages

# To install the library, run the following
#
# python setup.py install
#
# prerequisite: setuptools
# http://pypi.python.org/pypi/setuptools

setup(
    name='api',
    version='1.0.0',
    description="Bongonet API",
    author_email="hello@khulnasoft.com",
    author="Bongonet",
    url="https://github.com/bongonet",
    keywords=["Bongonet API"],
    install_requires=[],
    packages=find_namespace_packages(exclude=["*.test", "*.test.*", "test.*", "test"]),
    package_data={'': ['spec/spec.yaml']},
    include_package_data=True,
    zip_safe=False,
    license='GPLv2',
    long_description="""\
    The Bongonet API is an open source RESTful API that allows for interaction with the Bongonet manager from a web browser, command line tool like cURL or any script or program that can make web requests. The Bongonet app relies on this heavily and Bongonet’s goal is to accommodate complete remote management of the Bongonet infrastructure via the Bongonet app. Use the API to easily perform everyday actions like adding an agent, restarting the manager(s) or agent(s) or looking up syscheck details.
    """
)