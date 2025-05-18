<!---
Copyright (C) 2025, BongoSec
Created by BongoSec <info@khulnasoft.com>.
This program is free software; you can redistribute it and/or modify it under the terms of GPLv2
-->

# Bongosec DB
## Index
- [Bongosec DB](#bongosec-db)
  - [Index](#index)
  - [Purpose](#purpose)
  - [Activity diagrams](#activity-diagrams)


## Purpose
Bongosec DB is a daemon that wraps the access to SQLite database files. It provides:
- Concurrent socket dispatcher.
- Parallel queries to different databases.
- Serialized queries to the same database.
- Dynamic closing of database files.
- Implicit transactions and adjustable committing periods.
- Automatic database upgrades.
- Automatic defragmentation (vacuum) with adjustable parameters.


## Activity diagrams
<dl>
  <dt>001-vacuum</dt><dd>It illustrates the vacuum decision algorithm: in which cases Bongosec DB runs a <code>vacuum</code> command on databases.</dd>
</dl>
