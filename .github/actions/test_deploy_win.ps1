# Copyright (C) 2015, Bongosec Inc.
#
# This program is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public
# License (version 2) as published by the FSF - Free Software
# Foundation.
$VERSION_JSON = (Get-Content VERSION.json) -join "`n"

if ($VERSION_JSON -match '"version":\s*"([^"]+)"') {
    $VERSION = $matches[1]

    try {
        [version]$VERSION_OBJ = $VERSION
        $MAJOR = $VERSION_OBJ.Major
        $MINOR = $VERSION_OBJ.Minor
    } catch {
        Write-Output "Invalid version format: $VERSION"
        exit 1
    }

    try {
        $SHA= git rev-parse --short $args[0]
    } catch {
        Write-Output "Failed to extract commit hash from git"
        exit 1
    }
} else {
    Write-Output "Failed to extract version from VERSION.json"
    exit 1
}

$TEST_ARRAY=@(
              @("BONGOSEC_MANAGER ", "1.1.1.1", "<address>", "</address>"),
              @("BONGOSEC_MANAGER_PORT ", "7777", "<port>", "</port>"),
              @("BONGOSEC_PROTOCOL ", "udp", "<protocol>", "</protocol>"),
              @("BONGOSEC_REGISTRATION_SERVER ", "2.2.2.2", "<manager_address>", "</manager_address>"),
              @("BONGOSEC_REGISTRATION_PORT ", "8888", "<port>", "</port>"),
              @("BONGOSEC_REGISTRATION_PASSWORD ", "password", "<password>", "</password>"),
              @("BONGOSEC_KEEP_ALIVE_INTERVAL ", "10", "<notify_time>", "</notify_time>"),
              @("BONGOSEC_TIME_RECONNECT ", "10", "<time-reconnect>", "</time-reconnect>"),
              @("BONGOSEC_REGISTRATION_CA ", "/var/ossec/etc/testsslmanager.cert", "<server_ca_path>", "</server_ca_path>"),
              @("BONGOSEC_REGISTRATION_CERTIFICATE ", "/var/ossec/etc/testsslmanager.cert", "<agent_certificate_path>", "</agent_certificate_path>"),
              @("BONGOSEC_REGISTRATION_KEY ", "/var/ossec/etc/testsslmanager.key", "<agent_key_path>", "</agent_key_path>"),
              @("BONGOSEC_AGENT_NAME ", "test-agent", "<agent_name>", "</agent_name>"),
              @("BONGOSEC_AGENT_GROUP ", "test-group", "<groups>", "</groups>"),
              @("ENROLLMENT_DELAY ", "10", "<delay_after_enrollment>", "</delay_after_enrollment>")
)

function install_bongosec($vars)
{

    Write-Output "Testing the following variables $vars"
    Start-Process  C:\Windows\System32\msiexec.exe -ArgumentList  "/i bongosec-agent-$VERSION-0.commit$SHA.msi /qn $vars" -wait

}

function remove_bongosec
{

    Start-Process  C:\Windows\System32\msiexec.exe -ArgumentList "/x bongosec-agent-$VERSION-commit$SHA.msi /qn" -wait

}

function test($vars)
{

  For ($i=0; $i -lt $TEST_ARRAY.Length; $i++) {
    if($vars.Contains($TEST_ARRAY[$i][0])) {
      if ( ($TEST_ARRAY[$i][0] -eq "BONGOSEC_MANAGER ") -OR ($TEST_ARRAY[$i][0] -eq "BONGOSEC_PROTOCOL ") ) {
        $LIST = $TEST_ARRAY[$i][1].split(",")
        For ($j=0; $j -lt $LIST.Length; $j++) {
          $SEL = Select-String -Path 'C:\Program Files (x86)\ossec-agent\ossec.conf' -Pattern "$($TEST_ARRAY[$i][2])$($LIST[$j])$($TEST_ARRAY[$i][3])"
          if($SEL -ne $null) {
            Write-Output "The variable $($TEST_ARRAY[$i][0]) is set correctly"
          }
          if($SEL -eq $null) {
            Write-Output "The variable $($TEST_ARRAY[$i][0]) is not set correctly"
            exit 1
          }
        }
      }
      ElseIf ( ($TEST_ARRAY[$i][0] -eq "BONGOSEC_REGISTRATION_PASSWORD ") ) {
        if (Test-Path 'C:\Program Files (x86)\ossec-agent\authd.pass'){
          $SEL = Select-String -Path 'C:\Program Files (x86)\ossec-agent\authd.pass' -Pattern "$($TEST_ARRAY[$i][1])"
          if($SEL -ne $null) {
            Write-Output "The variable $($TEST_ARRAY[$i][0]) is set correctly"
          }
          if($SEL -eq $null) {
            Write-Output "The variable $($TEST_ARRAY[$i][0]) is not set correctly"
            exit 1
          }
        }
        else
        {
          Write-Output "BONGOSEC_REGISTRATION_PASSWORD is not correct"
          exit 1
        }
      }
      Else {
        $SEL = Select-String -Path 'C:\Program Files (x86)\ossec-agent\ossec.conf' -Pattern "$($TEST_ARRAY[$i][2])$($TEST_ARRAY[$i][1])$($TEST_ARRAY[$i][3])"
        if($SEL -ne $null) {
          Write-Output "The variable $($TEST_ARRAY[$i][0]) is set correctly"
        }
        if($SEL -eq $null) {
          Write-Output "The variable $($TEST_ARRAY[$i][0]) is not set correctly"
          exit 1
        }
      }
    }
  }

}

Write-Output "Download package: https://s3.us-west-1.amazonaws.com/packages-dev.bongosec.com/warehouse/pullrequests/$MAJOR.$MINOR/windows/bongosec-agent-$VERSION-0.commit$SHA.msi"
Invoke-WebRequest -Uri "https://s3.us-west-1.amazonaws.com/packages-dev.bongosec.com/warehouse/pullrequests/$MAJOR.$MINOR/windows/bongosec-agent-$VERSION-0.commit$SHA.msi" -OutFile "bongosec-agent-$VERSION-0.commit$SHA.msi"

install_bongosec "BONGOSEC_MANAGER=1.1.1.1 BONGOSEC_MANAGER_PORT=7777 BONGOSEC_PROTOCOL=udp BONGOSEC_REGISTRATION_SERVER=2.2.2.2 BONGOSEC_REGISTRATION_PORT=8888 BONGOSEC_REGISTRATION_PASSWORD=password BONGOSEC_KEEP_ALIVE_INTERVAL=10 BONGOSEC_TIME_RECONNECT=10 BONGOSEC_REGISTRATION_CA=/var/ossec/etc/testsslmanager.cert BONGOSEC_REGISTRATION_CERTIFICATE=/var/ossec/etc/testsslmanager.cert BONGOSEC_REGISTRATION_KEY=/var/ossec/etc/testsslmanager.key BONGOSEC_AGENT_NAME=test-agent BONGOSEC_AGENT_GROUP=test-group ENROLLMENT_DELAY=10"
test "BONGOSEC_MANAGER BONGOSEC_MANAGER_PORT BONGOSEC_PROTOCOL BONGOSEC_REGISTRATION_SERVER BONGOSEC_REGISTRATION_PORT BONGOSEC_REGISTRATION_PASSWORD BONGOSEC_KEEP_ALIVE_INTERVAL BONGOSEC_TIME_RECONNECT BONGOSEC_REGISTRATION_CA BONGOSEC_REGISTRATION_CERTIFICATE BONGOSEC_REGISTRATION_KEY BONGOSEC_AGENT_NAME BONGOSEC_AGENT_GROUP ENROLLMENT_DELAY "
remove_bongosec

install_bongosec "BONGOSEC_MANAGER=1.1.1.1"
test "BONGOSEC_MANAGER "
remove_bongosec

install_bongosec "BONGOSEC_MANAGER_PORT=7777"
test "BONGOSEC_MANAGER_PORT "
remove_bongosec

install_bongosec "BONGOSEC_PROTOCOL=udp"
test "BONGOSEC_PROTOCOL "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_SERVER=2.2.2.2"
test "BONGOSEC_REGISTRATION_SERVER "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_PORT=8888"
test "BONGOSEC_REGISTRATION_PORT "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_PASSWORD=password"
test "BONGOSEC_REGISTRATION_PASSWORD "
remove_bongosec

install_bongosec "BONGOSEC_KEEP_ALIVE_INTERVAL=10"
test "BONGOSEC_KEEP_ALIVE_INTERVAL "
remove_bongosec

install_bongosec "BONGOSEC_TIME_RECONNECT=10"
test "BONGOSEC_TIME_RECONNECT "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_CA=/var/ossec/etc/testsslmanager.cert"
test "BONGOSEC_REGISTRATION_CA "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_CERTIFICATE=/var/ossec/etc/testsslmanager.cert"
test "BONGOSEC_REGISTRATION_CERTIFICATE "
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_KEY=/var/ossec/etc/testsslmanager.key"
test "BONGOSEC_REGISTRATION_KEY "
remove_bongosec

install_bongosec "BONGOSEC_AGENT_NAME=test-agent"
test "BONGOSEC_AGENT_NAME "
remove_bongosec

install_bongosec "BONGOSEC_AGENT_GROUP=test-group"
test "BONGOSEC_AGENT_GROUP "
remove_bongosec

install_bongosec "ENROLLMENT_DELAY=10"
test "ENROLLMENT_DELAY "
remove_bongosec
