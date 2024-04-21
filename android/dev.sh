#!/bin/bash

printf "This is Your Android Devices that you can choose to start \n";
if [[ "$OSTYPE" == "darwin"* ]]; then
    emulators=`$(echo emulator -list-avds)`;
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    . "$env:ANDROID_HOME/emulator/emulator.exe" -list-avds
fi

while read -r line; do lines+=("$line"); done <<< "$emulators"

printf "Which one of them you want to start?\r\n\r\n";

select opt in "${lines[@]}";
do
    case $opt in
        *) break;;
    esac
done

printf "OK, started Android emulator based on $opt \r\n";

if [[ "$OSTYPE" == "darwin"* ]]; then
exec $ANDROID_HOME/emulator/emulator -avd $opt -dns-server 8.8.8.8 -no-snapshot -wipe-data -logcat *:e -verbose
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
. "$env:ANDROID_HOME/emulator/emulator" -avd $opt -dns-server 8.8.8.8 -no-snapshot -wipe-data -logcat *:e -verbose
fi