# Copyright (C) 2025, Bongosec
# Created by Bongosec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

AGENT_DAEMON = 'bongosec-agentd'
AGENTLESS_DAEMON = 'bongosec-agentlessd'
ANALYSISD_DAEMON = 'bongosec-analysisd'
API_DAEMON = 'bongosec-apid'
AUTHD_DAEMON = 'bongosec-authd'
CLUSTER_DAEMON = 'bongosec-clusterd'
CSYSLOG_DAEMON = 'bongosec-csyslogd'
EXEC_DAEMON = 'bongosec-execd'
INTEGRATOR_DAEMON = 'bongosec-integratord'
MAIL_DAEMON = 'bongosec-maild'
MODULES_DAEMON = 'bongosec-modulesd'
MONITOR_DAEMON = 'bongosec-monitord'
LOGCOLLECTOR_DAEMON = 'bongosec-logcollector'
REMOTE_DAEMON = 'bongosec-remoted'
SYSCHECK_DAEMON = 'bongosec-syscheckd'
BONGOSEC_DB_DAEMON = 'bongosec-db'

BONGOSEC_AGENT_DAEMONS = [AGENT_DAEMON,
                       EXEC_DAEMON,
                       MODULES_DAEMON,
                       LOGCOLLECTOR_DAEMON,
                       SYSCHECK_DAEMON]

BONGOSEC_MANAGER_DAEMONS = [AGENTLESS_DAEMON,
                         ANALYSISD_DAEMON,
                         API_DAEMON,
                         CLUSTER_DAEMON,
                         CSYSLOG_DAEMON,
                         EXEC_DAEMON,
                         INTEGRATOR_DAEMON,
                         LOGCOLLECTOR_DAEMON,
                         MAIL_DAEMON,
                         MODULES_DAEMON,
                         MONITOR_DAEMON,
                         REMOTE_DAEMON,
                         SYSCHECK_DAEMON,
                         BONGOSEC_DB_DAEMON]

API_DAEMONS_REQUIREMENTS = [API_DAEMON,
                            BONGOSEC_DB_DAEMON,
                            EXEC_DAEMON,
                            ANALYSISD_DAEMON,
                            REMOTE_DAEMON,
                            MODULES_DAEMON]

BONGOSEC_AGENT = 'bongosec-agent'
BONGOSEC_MANAGER = 'bongosec-manager'

BONGOSEC_AGENT_WIN = 'bongosec-agent.exe'
