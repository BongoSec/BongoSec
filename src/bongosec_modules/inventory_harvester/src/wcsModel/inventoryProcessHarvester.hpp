/*
 * Bongosec inventory harvester
 * Copyright (C) 2025, BongoSec
 * January 14, 2025.
 *
 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

#ifndef _INVENTORY_PROCESS_HARVESTER_HPP
#define _INVENTORY_PROCESS_HARVESTER_HPP

#include "reflectiveJson.hpp"
#include "wcsClasses/agent.hpp"
#include "wcsClasses/process.hpp"
#include "wcsClasses/bongosec.hpp"

struct InventoryProcessHarvester final
{
    Agent agent;
    Process process;
    Bongosec bongosec;

    REFLECTABLE(MAKE_FIELD("process", &InventoryProcessHarvester::process),
                MAKE_FIELD("agent", &InventoryProcessHarvester::agent),
                MAKE_FIELD("bongosec", &InventoryProcessHarvester::bongosec));
};

#endif // _INVENTORY_PROCESS_HARVESTER_HPP
