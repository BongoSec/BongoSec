#!/bin/bash

# Looking up for the execution directory
cd `dirname $0`

# Set the base directory
BASE_DIR="$(pwd)"

Use()
{
  echo " USE: ./gen_ossec.sh conf install_type distribution version [installation_path]"
  echo "   - install_type: manager, agent, local"
  echo "   - distribution: rhel, debian, ubuntu, ..."
  echo "   - version: 6, 7, 16.04, ..."
  echo "   - installation_path (optional): changes the default path '/var/ossec' "
}

# Read script values
if [ "$1" = "conf" ] && [ "$#" -ge "4" ]; then

  # Source the required files with correct paths
  . "${BASE_DIR}/src/init/shared.sh"
  . "${BASE_DIR}/src/init/inst-functions.sh"

  INSTYPE=$(echo $2 | tr '[:upper:]' '[:lower:]')
  if [ "$INSTYPE" = "manager" ]; then
      INSTYPE="server"
  fi
  DIST_NAME=$(echo $3 | tr '[:upper:]' '[:lower:]')
  if [ $(echo $4 | grep "\.") ]; then
    DIST_VER=$(echo $4 | cut -d\. -f1)
    DIST_SUBVER=$(echo $4 | cut -d\. -f2)
  else
    DIST_VER="$4"
    DIST_SUBVER="0"
  fi
  if [ "$#" = "5" ]; then
    INSTALLDIR="$5"
  else
    INSTALLDIR="/var/ossec"
  fi

  # Default values definition
  SERVER_IP="MANAGER_IP"
  NEWCONFIG="${BASE_DIR}/ossec.conf.temp"
  SYSCHECK="yes"
  ROOTCHECK="yes"
  SYSCOLLECTOR="yes"
  SECURITY_CONFIGURATION_ASSESSMENT="yes"
  ACTIVERESPONSE="yes"
  AUTHD="yes"
  SSL_CERT="yes"
  RLOG="no" # syslog
  SLOG="yes" # remote

  # Create a temporary directory for the configuration
  TEMP_DIR="${BASE_DIR}/tmp"
  mkdir -p "${TEMP_DIR}"
  NEWCONFIG="${TEMP_DIR}/ossec.conf.temp"

  if [ -r "$NEWCONFIG" ]; then
      rm "$NEWCONFIG"
  fi

  if [ "$INSTYPE" = "server" ]; then
    WriteManager "no_localfiles"
  elif [ "$INSTYPE" = "agent" ]; then
    WriteAgent "no_localfiles"
  elif [ "$INSTYPE" = "local" ]; then
    WriteLocal "no_localfiles"
  else
    Use
    exit 1
  fi

  cat "$NEWCONFIG"
  rm "$NEWCONFIG"
  rmdir "${TEMP_DIR}"

  exit 0
else
  echo ""
  echo "Bongonet Configuration Generator"
  echo ""
  Use
  echo ""
  exit 1
fi