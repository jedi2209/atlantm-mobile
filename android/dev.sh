#!/bin/bash

printf "This is Your Android Devices that you can choose to start \n";
emulators=`$(echo emulator -list-avds)`;
while read -r line; do lines+=("$line"); done <<< "$emulators"

printf "Which one of them you want to start?\r\n\r\n";

select opt in "${lines[@]}";
do
    case $opt in
        *) break;;
    esac
done

printf "OK, started Android emulator based on $opt \r\n";
exec $HOME/Library/Android/sdk/emulator/emulator -avd $opt -dns-server 8.8.8.8 -no-snapshot -wipe-data -logcat *:e -verbose
