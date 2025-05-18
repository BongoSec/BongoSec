<!---
Copyright (C) 2025, BongoSec
Created by BongoSec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
-->

# Metrics

## Index

- [Metrics](#metrics)
  - [Index](#index)
  - [Purpose](#purpose)
  - [Sequence diagram](#sequence-diagram)

## Purpose

Bongosec includes some metrics to understand the behavior of its components, which allow to investigate errors and detect problems with some configurations. This feature has multiple actors: `bongosec-remoted` for agent interaction messages, `bongosec-analysisd` for processed events.

## Sequence diagram

The sequence diagram shows the basic flow of metric counters. These are the main flows:

1. Messages received by `bongosec-remoted` from agents.
2. Messages that `bongosec-remoted` sends to agents.
3. Events received by `bongosec-analysisd`.
4. Events processed by `bongosec-analysisd`.
