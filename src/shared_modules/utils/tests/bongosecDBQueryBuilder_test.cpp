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

#include "bongosecDBQueryBuilder_test.hpp"
#include "bongosecDBQueryBuilder.hpp"
#include <string>

TEST_F(BongosecDBQueryBuilderTest, GlobalTest)
{
    std::string message = BongosecDBQueryBuilder::builder().global().selectAll().fromTable("agent").build();
    EXPECT_EQ(message, "global sql SELECT * FROM agent ");
}

TEST_F(BongosecDBQueryBuilderTest, AgentTest)
{
    std::string message = BongosecDBQueryBuilder::builder().agent("0").selectAll().fromTable("sys_programs").build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs ");
}

TEST_F(BongosecDBQueryBuilderTest, WhereTest)
{
    std::string message = BongosecDBQueryBuilder::builder()
                              .agent("0")
                              .selectAll()
                              .fromTable("sys_programs")
                              .whereColumn("name")
                              .equalsTo("bash")
                              .build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs WHERE name = 'bash' ");
}

TEST_F(BongosecDBQueryBuilderTest, WhereAndTest)
{
    std::string message = BongosecDBQueryBuilder::builder()
                              .agent("0")
                              .selectAll()
                              .fromTable("sys_programs")
                              .whereColumn("name")
                              .equalsTo("bash")
                              .andColumn("version")
                              .equalsTo("1")
                              .build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs WHERE name = 'bash' AND version = '1' ");
}

TEST_F(BongosecDBQueryBuilderTest, WhereOrTest)
{
    std::string message = BongosecDBQueryBuilder::builder()
                              .agent("0")
                              .selectAll()
                              .fromTable("sys_programs")
                              .whereColumn("name")
                              .equalsTo("bash")
                              .orColumn("version")
                              .equalsTo("1")
                              .build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs WHERE name = 'bash' OR version = '1' ");
}

TEST_F(BongosecDBQueryBuilderTest, WhereIsNullTest)
{
    std::string message = BongosecDBQueryBuilder::builder()
                              .agent("0")
                              .selectAll()
                              .fromTable("sys_programs")
                              .whereColumn("name")
                              .isNull()
                              .build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs WHERE name IS NULL ");
}

TEST_F(BongosecDBQueryBuilderTest, WhereIsNotNullTest)
{
    std::string message = BongosecDBQueryBuilder::builder()
                              .agent("0")
                              .selectAll()
                              .fromTable("sys_programs")
                              .whereColumn("name")
                              .isNotNull()
                              .build();
    EXPECT_EQ(message, "agent 0 sql SELECT * FROM sys_programs WHERE name IS NOT NULL ");
}

TEST_F(BongosecDBQueryBuilderTest, InvalidValue)
{
    EXPECT_THROW(BongosecDBQueryBuilder::builder()
                     .agent("0")
                     .selectAll()
                     .fromTable("sys_programs")
                     .whereColumn("name")
                     .equalsTo("bash'")
                     .build(),
                 std::runtime_error);
}

TEST_F(BongosecDBQueryBuilderTest, InvalidColumn)
{
    EXPECT_THROW(BongosecDBQueryBuilder::builder()
                     .agent("0")
                     .selectAll()
                     .fromTable("sys_programs")
                     .whereColumn("name'")
                     .equalsTo("bash")
                     .build(),
                 std::runtime_error);
}

TEST_F(BongosecDBQueryBuilderTest, InvalidTable)
{
    EXPECT_THROW(BongosecDBQueryBuilder::builder()
                     .agent("0")
                     .selectAll()
                     .fromTable("sys_programs'")
                     .whereColumn("name")
                     .equalsTo("bash")
                     .build(),
                 std::runtime_error);
}

TEST_F(BongosecDBQueryBuilderTest, GlobalGetCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().globalGetCommand("agent-info 1").build();
    EXPECT_EQ(message, "global get-agent-info 1 ");
}

TEST_F(BongosecDBQueryBuilderTest, GlobalFindCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().globalFindCommand("agent 1").build();
    EXPECT_EQ(message, "global find-agent 1 ");
}

TEST_F(BongosecDBQueryBuilderTest, GlobalSelectCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().globalSelectCommand("agent-name 1").build();
    EXPECT_EQ(message, "global select-agent-name 1 ");
}

TEST_F(BongosecDBQueryBuilderTest, AgentGetOsInfoCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().agentGetOsInfoCommand("1").build();
    EXPECT_EQ(message, "agent 1 osinfo get ");
}

TEST_F(BongosecDBQueryBuilderTest, AgentGetHotfixesCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().agentGetHotfixesCommand("1").build();
    EXPECT_EQ(message, "agent 1 hotfix get ");
}

TEST_F(BongosecDBQueryBuilderTest, AgentGetPackagesCommand)
{
    std::string message = BongosecDBQueryBuilder::builder().agentGetPackagesCommand("1").build();
    EXPECT_EQ(message, "agent 1 package get ");
}
