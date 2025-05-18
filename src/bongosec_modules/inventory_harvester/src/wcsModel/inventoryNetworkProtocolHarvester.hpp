/*
 * Bongosec inventory harvester
 * Copyright (C) 2025, BongoSec
 * March 27, 2025.
 *
 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

#ifndef _INVENTORY_NETWORK_PROTOCOL_HARVESTER_HPP
#define _INVENTORY_NETWORK_PROTOCOL_HARVESTER_HPP

#include "reflectiveJson.hpp"
#include "wcsClasses/agent.hpp"
#include "wcsClasses/networkProtocol.hpp"
#include "wcsClasses/bongosec.hpp"

struct InventoryNetworkProtocolHarvester final
{
    Agent agent;
    Network network;
    Observer observer;
    Bongosec bongosec;

    REFLECTABLE(MAKE_FIELD("network", &InventoryNetworkProtocolHarvester::network),
                MAKE_FIELD("observer", &InventoryNetworkProtocolHarvester::observer),
                MAKE_FIELD("agent", &InventoryNetworkProtocolHarvester::agent),
                MAKE_FIELD("bongosec", &InventoryNetworkProtocolHarvester::bongosec));
};

#endif // _INVENTORY_NETWORK_PROTOCOL_HARVESTER_HPP
