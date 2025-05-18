/*
 * Bongosec inventory harvester
 * Copyright (C) 2025, BongoSec
 * April 3, 2025.
 *
 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

#ifndef _BONGOSEC_WCS_MODEL_HPP
#define _BONGOSEC_WCS_MODEL_HPP

#include "reflectiveJson.hpp"
#include <string_view>

struct Bongosec final
{
    struct Cluster final
    {
        std::string_view name;
        std::string_view node;

        REFLECTABLE(MAKE_FIELD("name", &Cluster::name), MAKE_FIELD("node", &Cluster::node));
    };

    struct Schema final
    {
        const std::string_view version = "1.0";

        REFLECTABLE(MAKE_FIELD("version", &Schema::version));
    };

    Cluster cluster;
    Schema schema;

    REFLECTABLE(MAKE_FIELD("cluster", &Bongosec::cluster), MAKE_FIELD("schema", &Bongosec::schema));
};

#endif // _BONGOSEC_WCS_MODEL_HPP
