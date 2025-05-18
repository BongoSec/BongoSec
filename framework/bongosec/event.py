# Copyright (C) 2025, BongoSec
# Created by BongoSec <info@khulnasoft.com>.
# This program is a free software; you can redistribute it and/or modify it under the terms of GPLv2

from bongosec.core.common import QUEUE_SOCKET
from bongosec.core.exception import BongosecError
from bongosec.core.results import BongosecResult, AffectedItemsBongosecResult
from bongosec.core.bongosec_queue import BongosecAnalysisdQueue
from bongosec.rbac.decorators import expose_resources

MSG_HEADER = '1:API-Webhook:'


@expose_resources(actions=["event:ingest"], resources=["*:*:*"], post_proc_func=None)
def send_event_to_analysisd(events: list) -> BongosecResult:
    """Send events to analysisd through the socket.

    Parameters
    ----------
    events : list
        List of events to send.

    Returns
    -------
    BongosecResult
        Confirmation message.
    """
    result = AffectedItemsBongosecResult(
        all_msg="All events were forwarded to analisysd",
        some_msg="Some events were forwarded to analisysd",
        none_msg="No events were forwarded to analisysd"
    )

    with BongosecAnalysisdQueue(QUEUE_SOCKET) as queue:
        for event in events:
            try:
                queue.send_msg(msg_header=MSG_HEADER, msg=event)
                result.affected_items.append(event)
            except BongosecError as error:
                result.add_failed_item(event, error=error)

    result.total_affected_items = len(result.affected_items)
    return result
