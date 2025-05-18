/*
 * Bongosec inventory harvester
 * Copyright (C) 2025, BongoSec
 * March 20, 2025.
 *
 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

#ifndef _INVENTORY_HARDWARE_HARVESTER_HPP
#define _INVENTORY_HARDWARE_HARVESTER_HPP

#include "reflectiveJson.hpp"
#include "wcsClasses/agent.hpp"
#include "wcsClasses/hardware.hpp"
#include "wcsClasses/bongosec.hpp"

struct InventoryHardwareHarvester final
{
    struct Observer final
    {
        std::string_view serial_number;

        REFLECTABLE(MAKE_FIELD("serial_number", &Observer::serial_number));
    } observer;

    Agent agent;
    Hardware host;
    Bongosec bongosec;

    REFLECTABLE(MAKE_FIELD("host", &InventoryHardwareHarvester::host),
                MAKE_FIELD("agent", &InventoryHardwareHarvester::agent),
                MAKE_FIELD("observer", &InventoryHardwareHarvester::observer),
                MAKE_FIELD("bongosec", &InventoryHardwareHarvester::bongosec));
};

#endif // _INVENTORY_HARDWARE_HARVESTER_HPP
