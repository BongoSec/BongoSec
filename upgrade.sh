#!/bin/bash

# validate OS, linux or macos
if [ "X$(uname)" = "XLinux" ] ; then
    # Get BongoSec installation path
    SCRIPT=$(readlink -f "$0")
    BONGOSEC_HOME=$(dirname $(dirname $(dirname "$SCRIPT")))
    cd "${BONGOSEC_HOME}"
    (sleep 5 && chmod +x ./var/upgrade/*.sh && ./var/upgrade/pkg_installer.sh && find ./var/upgrade/* -not -name upgrade_result -delete) >/dev/null 2>&1 &
else
    (sleep 5 && chmod +x ./var/upgrade/*.sh && ./var/upgrade/pkg_installer.sh && find ./var/upgrade/ -mindepth 1 -not -name upgrade_result -delete) >/dev/null 2>&1 &
fi