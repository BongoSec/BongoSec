<!---
Copyright (C) 2025, BongoSec
Created by BongoSec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
-->

# Centralized Configuration
## Index
- [Centralized Configuration](#centralized-configuration)
  - [Index](#index)
  - [Purpose](#purpose)
  - [Sequence diagram](#sequence-diagram)

## Purpose

One of the key features of Bongosec as a EDR is the Centralized Configuration, allowing to deploy configurations, policies, rootcheck descriptions or any other file from Bongosec Manager to any Bongosec Agent based on their grouping configuration. This feature has multiples actors: Bongosec Cluster (Master and Worker nodes), with `bongosec-remoted` as the main responsible from the managment side, and Bongosec Agent with `bongosec-agentd` as resposible from the client side.


## Sequence diagram
Sequence diagram shows the basic flow of Centralized Configuration based on the configuration provided. There are mainly three stages:
1. Bongosec Manager Master Node (`bongosec-remoted`) creates every `remoted.shared_reload` (internal) seconds the files that need to be synchronized with the agents.
2. Bongosec Cluster as a whole (via `bongosec-clusterd`) continuously synchronize files between Bongosec Manager Master Node and Bongosec Manager Worker Nodes
3. Bongosec Agent `bongosec-agentd` (via ) sends every `notify_time` (ossec.conf) their status, being `merged.mg` hash part of it. Bongosec Manager Worker Node (`bongosec-remoted`) will check if agent's `merged.mg` is out-of-date, and in case this is true, the new `merged.mg` will be pushed to Bongosec Agent.