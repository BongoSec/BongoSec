/*
 * Bongosec shared modules utils
 * Copyright (C) 2025, BongoSec
 * Nov 1, 2023.
 *
 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

#ifndef _BONGOSEC_DB_QUERY_BUILDER_TEST_HPP
#define _BONGOSEC_DB_QUERY_BUILDER_TEST_HPP

#include "gtest/gtest.h"

class BongosecDBQueryBuilderTest : public ::testing::Test
{
protected:
    BongosecDBQueryBuilderTest() = default;
    virtual ~BongosecDBQueryBuilderTest() = default;

    void SetUp() override {};
    void TearDown() override {};
};

#endif // _BONGOSEC_DB_QUERY_BUILDER_TEST_HPP
