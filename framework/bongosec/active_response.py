# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

from bongosec.core import active_response, common
from bongosec.core.agent import get_agents_info
from bongosec.core.exception import BongosecException, BongosecError, BongosecResourceNotFound
from bongosec.core.bongosec_queue import BongosecQueue
from bongosec.core.results import AffectedItemsBongosecResult
from bongosec.rbac.decorators import expose_resources


@expose_resources(actions=['active-response:command'], resources=['agent:id:{agent_list}'],
                  post_proc_kwargs={'exclude_codes': [1701, 1703]})
def run_command(agent_list: list = None, command: str = '', arguments: list = None,
                alert: dict = None) -> AffectedItemsBongosecResult:
    """Run AR command in a specific agent.

    Parameters
    ----------
    agent_list : list
        Agents list that will run the AR command.
    command : str
        Command running in the agents. If this value starts with !, then it refers to a script name instead of a
        command name.
    custom : bool
        Whether the specified command is a custom command or not.
    arguments : list
        Command arguments.
    alert : dict
        Alert information depending on the AR executed.

    Returns
    -------
    AffectedItemsBongosecResult
        Affected items.
    """
    result = AffectedItemsBongosecResult(all_msg='AR command was sent to all agents',
                                      some_msg='AR command was not sent to some agents',
                                      none_msg='AR command was not sent to any agent'
                                      )
    if agent_list:
        with BongosecQueue(common.AR_SOCKET) as wq:
            system_agents = get_agents_info()
            for agent_id in agent_list:
                try:
                    if agent_id not in system_agents:
                        raise BongosecResourceNotFound(1701)
                    if agent_id == "000":
                        raise BongosecError(1703)
                    active_response.send_ar_message(agent_id, wq, command, arguments, alert)
                    result.affected_items.append(agent_id)
                    result.total_affected_items += 1
                except BongosecException as e:
                    result.add_failed_item(id_=agent_id, error=e)
            result.affected_items.sort(key=int)

    return result
