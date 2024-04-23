$file = "$(Get-Date -Format "yyyyMMdd_HHmmss")_android-emulators-output.txt"

if (Test-Path -Path "$env:TMP\$file" -PathType Leaf) {
	rm "$env:TMP\$file"
}
. "$env:ANDROID_HOME/emulator/emulator" -list-avds >> "$env:TMP\$file"
$emulators = Get-Content "$env:TMP\$file"
if (Test-Path -Path "$env:TMP\$file" -PathType Leaf) {
	rm "$env:TMP\$file"
}

$lines = $emulators -split "`r?`n"

echo "This is Your Android Devices that you can choose to start `n";

1..$lines.Length | foreach-object {
        if($lines[$_-1] -like '*INFO *') {
            return
        }
        Write-Output "$($_): $($lines[$_-1])"
    }

[ValidateScript({$_ -ge 1 -and $_ -le $lines.Length})]
[int]$number = Read-Host "`n`nPress the number to select a device";

if($?) {
    $opt = $lines[$number-1]
    clear
    Write-Host "OK, started Android emulator based on $opt`n"
    Start-Process -FilePath "$env:ANDROID_HOME/emulator/emulator" -ArgumentList "-avd $opt", "-dns-server 8.8.8.8", "-no-snapshot", "-wipe-data", "-logcat *:e", "-verbose"
}