#!/bin/bash

# Copyright (C) 2015, Bongosec Inc.
#
# This program is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public
# License (version 2) as published by the FSF - Free Software
# Foundation.

# Global variables
VERSION="v$(grep '"version"' VERSION.json | sed -E 's/.*"version": *"([^"]+)".*/\1/')"
MAJOR=$(echo "${VERSION}" | cut -dv -f2 | cut -d. -f1)
MINOR=$(echo "${VERSION}" | cut -d. -f2)
SHA="$(git rev-parse --short=7 "$1")"

BONGOSEC_MACOS_AGENT_DEPLOYMENT_VARS="/tmp/bongosec_envs"
conf_path="/Library/Ossec/etc/ossec.conf"

VARS=( "BONGOSEC_MANAGER" "BONGOSEC_MANAGER_PORT" "BONGOSEC_PROTOCOL" "BONGOSEC_REGISTRATION_SERVER" "BONGOSEC_REGISTRATION_PORT" "BONGOSEC_REGISTRATION_PASSWORD" "BONGOSEC_KEEP_ALIVE_INTERVAL" "BONGOSEC_TIME_RECONNECT" "BONGOSEC_REGISTRATION_CA" "BONGOSEC_REGISTRATION_CERTIFICATE" "BONGOSEC_REGISTRATION_KEY" "BONGOSEC_AGENT_NAME" "BONGOSEC_AGENT_GROUP" "ENROLLMENT_DELAY" )
VALUES=( "1.1.1.1" "7777" "udp" "2.2.2.2" "8888" "password" "10" "10" "/Library/Ossec/etc/testsslmanager.cert" "/Library/Ossec/etc/testsslmanager.cert" "/Library/Ossec/etc/testsslmanager.key" "test-agent" "test-group" "10" )
TAGS1=( "<address>" "<port>" "<protocol>" "<manager_address>" "<port>" "<password>" "<notify_time>" "<time-reconnect>" "<server_ca_path>" "<agent_certificate_path>" "<agent_key_path>" "<agent_name>" "<groups>" "<delay_after_enrollment>" )
TAGS2=( "</address>" "</port>" "</protocol>" "</manager_address>" "</port>" "</password>" "</notify_time>" "</time-reconnect>" "</server_ca_path>" "</agent_certificate_path>" "</agent_key_path>" "</agent_name>" "</groups>" "</delay_after_enrollment>" )
BONGOSEC_REGISTRATION_PASSWORD_PATH="/Library/Ossec/etc/authd.pass"

function install_bongosec(){

  echo "Testing the following variables $1"

  eval "echo \"$1\" > ${BONGOSEC_MACOS_AGENT_DEPLOYMENT_VARS} && installer -pkg bongosec-agent-${VERSION}-0.commit${SHA}.pkg -target / > /dev/null 2>&1"

}

function remove_bongosec () {

  /bin/rm -r /Library/Ossec > /dev/null 2>&1
  /bin/launchctl unload /Library/LaunchDaemons/com.bongosec.agent.plist > /dev/null 2>&1
  /bin/rm -f /Library/LaunchDaemons/com.bongosec.agent.plist > /dev/null 2>&1
  /bin/rm -rf /Library/StartupItems/BONGOSEC > /dev/null 2>&1
  /usr/bin/dscl . -delete "/Users/bongosec" > /dev/null 2>&1
  /usr/bin/dscl . -delete "/Groups/bongosec" > /dev/null 2>&1
  /usr/sbin/pkgutil --forget com.bongosec.pkg.bongosec-agent > /dev/null 2>&1

}

function test() {

  for i in "${!VARS[@]}"; do
    if ( echo "${@}" | grep -q -w "${VARS[i]}" ); then
      if [ "${VARS[i]}" == "BONGOSEC_MANAGER" ] || [ "${VARS[i]}" == "BONGOSEC_PROTOCOL" ]; then
        LIST=( "${VALUES[i]//,/ }" )
        for j in "${!LIST[@]}"; do
          if ( grep -q "${TAGS1[i]}${LIST[j]}${TAGS2[i]}" "${conf_path}" ); then
            echo "The variable ${VARS[i]} is set correctly"
          else
            echo "The variable ${VARS[i]} is not set correctly"
            exit 1
          fi
        done
      elif [ "${VARS[i]}" == "BONGOSEC_REGISTRATION_PASSWORD" ]; then
        if ( grep -q "${VALUES[i]}" "${BONGOSEC_REGISTRATION_PASSWORD_PATH}" ); then
          echo "The variable ${VARS[i]} is set correctly"
        else
          echo "The variable ${VARS[i]} is not set correctly"
          exit 1
        fi
      else
        if ( grep -q "${TAGS1[i]}${VALUES[i]}${TAGS2[i]}" "${conf_path}" ); then
          echo "The variable ${VARS[i]} is set correctly"
        else
          echo "The variable ${VARS[i]} is not set correctly"
          exit 1
        fi
      fi
    fi
  done

}

echo "Download package https://s3.us-west-1.amazonaws.com/packages-dev.bongosec.com/warehouse/pullrequests/${MAJOR}.${MINOR}/macos/bongosec-agent-${VERSION}-0.commit${SHA}.pkg"
wget "https://s3.us-west-1.amazonaws.com/packages-dev.bongosec.com/warehouse/pullrequests/${MAJOR}.${MINOR}/macos/bongosec-agent-${VERSION}-0.commit${SHA}.pkg" > /dev/null 2>&1

install_bongosec "BONGOSEC_MANAGER='1.1.1.1' && BONGOSEC_MANAGER_PORT='7777' && BONGOSEC_PROTOCOL='udp' && BONGOSEC_REGISTRATION_SERVER='2.2.2.2' && BONGOSEC_REGISTRATION_PORT='8888' && BONGOSEC_REGISTRATION_PASSWORD='password' && BONGOSEC_KEEP_ALIVE_INTERVAL='10' && BONGOSEC_TIME_RECONNECT='10' && BONGOSEC_REGISTRATION_CA='/Library/Ossec/etc/testsslmanager.cert' && BONGOSEC_REGISTRATION_CERTIFICATE='/Library/Ossec/etc/testsslmanager.cert' && BONGOSEC_REGISTRATION_KEY='/Library/Ossec/etc/testsslmanager.key' && BONGOSEC_AGENT_NAME='test-agent' && BONGOSEC_AGENT_GROUP='test-group' && ENROLLMENT_DELAY='10'"
test "BONGOSEC_MANAGER BONGOSEC_MANAGER_PORT BONGOSEC_PROTOCOL BONGOSEC_REGISTRATION_SERVER BONGOSEC_REGISTRATION_PORT BONGOSEC_REGISTRATION_PASSWORD BONGOSEC_KEEP_ALIVE_INTERVAL BONGOSEC_TIME_RECONNECT BONGOSEC_REGISTRATION_CA BONGOSEC_REGISTRATION_CERTIFICATE BONGOSEC_REGISTRATION_KEY BONGOSEC_AGENT_NAME BONGOSEC_AGENT_GROUP ENROLLMENT_DELAY"
remove_bongosec

install_bongosec "BONGOSEC_MANAGER='1.1.1.1'"
test "BONGOSEC_MANAGER"
remove_bongosec

install_bongosec "BONGOSEC_MANAGER_PORT='7777'"
test "BONGOSEC_MANAGER_PORT"
remove_bongosec

install_bongosec "BONGOSEC_PROTOCOL='udp'"
test "BONGOSEC_PROTOCOL"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_SERVER='2.2.2.2'"
test "BONGOSEC_REGISTRATION_SERVER"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_PORT='8888'"
test "BONGOSEC_REGISTRATION_PORT"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_PASSWORD='password'"
test "BONGOSEC_REGISTRATION_PASSWORD"
remove_bongosec

install_bongosec "BONGOSEC_KEEP_ALIVE_INTERVAL='10'"
test "BONGOSEC_KEEP_ALIVE_INTERVAL"
remove_bongosec

install_bongosec "BONGOSEC_TIME_RECONNECT='10'"
test "BONGOSEC_TIME_RECONNECT"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_CA='/Library/Ossec/etc/testsslmanager.cert'"
test "BONGOSEC_REGISTRATION_CA"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_CERTIFICATE='/Library/Ossec/etc/testsslmanager.cert'"
test "BONGOSEC_REGISTRATION_CERTIFICATE"
remove_bongosec

install_bongosec "BONGOSEC_REGISTRATION_KEY='/Library/Ossec/etc/testsslmanager.key'"
test "BONGOSEC_REGISTRATION_KEY"
remove_bongosec

install_bongosec "BONGOSEC_AGENT_NAME='test-agent'"
test "BONGOSEC_AGENT_NAME"
remove_bongosec

install_bongosec "BONGOSEC_AGENT_GROUP='test-group'"
test "BONGOSEC_AGENT_GROUP"
remove_bongosec

install_bongosec "ENROLLMENT_DELAY='10'"
test "ENROLLMENT_DELAY"
remove_bongosec
