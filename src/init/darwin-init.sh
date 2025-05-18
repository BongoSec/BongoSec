#!/bin/sh

# Darwin init script.
# by Lorenzo Costanzia di Costigliole <mummie@tin.it>
# Modified by Bongosec, Inc. <info@bongosec.github.io>.
# Copyright (C) 2025, BongoSec
# This program is free software; you can redistribute it and/or modify it under the terms of GPLv2

INSTALLATION_PATH=${1}
SERVICE=/Library/LaunchDaemons/com.bongosec.agent.plist
STARTUP=/Library/StartupItems/BONGOSEC/StartupParameters.plist
LAUNCHER_SCRIPT=/Library/StartupItems/BONGOSEC/Bongosec-launcher
STARTUP_SCRIPT=/Library/StartupItems/BONGOSEC/BONGOSEC

launchctl unload /Library/LaunchDaemons/com.bongosec.agent.plist 2> /dev/null
mkdir -p /Library/StartupItems/BONGOSEC
chown root:wheel /Library/StartupItems/BONGOSEC
rm -f $STARTUP $STARTUP_SCRIPT $SERVICE
echo > $LAUNCHER_SCRIPT
chown root:wheel $LAUNCHER_SCRIPT
chmod u=rxw-,g=rx-,o=r-- $LAUNCHER_SCRIPT

echo '<?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 <plist version="1.0">
     <dict>
         <key>Label</key>
         <string>com.bongosec.agent</string>
         <key>ProgramArguments</key>
         <array>
             <string>'$LAUNCHER_SCRIPT'</string>
         </array>
         <key>RunAtLoad</key>
         <true/>
     </dict>
 </plist>' > $SERVICE

chown root:wheel $SERVICE
chmod u=rw-,go=r-- $SERVICE

echo '
#!/bin/sh
. /etc/rc.common

StartService ()
{
        '${INSTALLATION_PATH}'/bin/bongosec-control start
}
StopService ()
{
        '${INSTALLATION_PATH}'/bin/bongosec-control stop
}
RestartService ()
{
        '${INSTALLATION_PATH}'/bin/bongosec-control restart
}
RunService "$1"
' > $STARTUP_SCRIPT

chown root:wheel $STARTUP_SCRIPT
chmod u=rwx,go=r-x $STARTUP_SCRIPT

echo '
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://
www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
       <key>Description</key>
       <string>BONGOSEC Security agent</string>
       <key>Messages</key>
       <dict>
               <key>start</key>
               <string>Starting Bongosec agent</string>
               <key>stop</key>
               <string>Stopping Bongosec agent</string>
       </dict>
       <key>Provides</key>
       <array>
               <string>BONGOSEC</string>
       </array>
       <key>Requires</key>
       <array>
               <string>IPFilter</string>
       </array>
</dict>
</plist>
' > $STARTUP

chown root:wheel $STARTUP
chmod u=rw-,go=r-- $STARTUP

echo '#!/bin/sh

capture_sigterm() {
    '${INSTALLATION_PATH}'/bin/bongosec-control stop
    exit $?
}

if ! '${INSTALLATION_PATH}'/bin/bongosec-control start; then
    '${INSTALLATION_PATH}'/bin/bongosec-control stop
fi

while : ; do
    trap capture_sigterm SIGTERM
    sleep 3
done
' > $LAUNCHER_SCRIPT
