#!/usr/bin/env python

###
#  Copyright (C) 2025, BongoSecAll rights reserved.
#  bongosec.github.io
#
#  This program is free software; you can redistribute it
#  and/or modify it under the terms of the GNU General Public
#  License (version 2) as published by the FSF - Free Software
#  Foundation.
###

# Instructions:
#  - Use the embedded interpreter to run the script: {bongosec_path}/framework/python/bin/python3 get_agents.py

import json

import bongosec.agent as agent

if __name__ == "__main__":

    result = agent.get_agents()
    print(json.dumps(result.render(), indent=4, sort_keys=True, default=str))
