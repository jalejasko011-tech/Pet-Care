#!/usr/bin/env bash
set -euo pipefail
mkdir -p android-test-evidence
APK=android/app/build/outputs/apk/debug/app-debug.apk
adb logcat -c
adb install -r "$APK" | tee android-test-evidence/install.txt
adb shell am start -W -n com.petcare.companion/.MainActivity | tee android-test-evidence/launch.txt
# Let WebView finish its first launch; this is an installation/startup smoke test.
for attempt in $(seq 1 20); do
  adb shell uiautomator dump /sdcard/pet-care-ui.xml >/dev/null 2>&1 || true
  adb pull /sdcard/pet-care-ui.xml android-test-evidence/ui.xml >/dev/null 2>&1 || true
  if grep -q 'Pet Care World' android-test-evidence/ui.xml 2>/dev/null; then break; fi
  sleep 2
done
adb shell pidof com.petcare.companion > android-test-evidence/pid.txt
adb logcat -d > android-test-evidence/logcat.txt
adb shell dumpsys package com.petcare.companion > android-test-evidence/package.txt
adb exec-out screencap -p > android-test-evidence/launch.png
grep -q 'Pet Care World' android-test-evidence/ui.xml
if grep -A 5 'FATAL EXCEPTION' android-test-evidence/logcat.txt | grep -q 'com.petcare.companion'; then
  echo 'Android app crashed'; exit 1
fi
if grep -E 'android.permission.(READ_SMS|RECEIVE_SMS|READ_CONTACTS|READ_CALL_LOG|QUERY_ALL_PACKAGES|REQUEST_INSTALL_PACKAGES)' android-test-evidence/package.txt; then
  echo 'Unexpected sensitive permission'; exit 1
fi
echo 'PASS: test APK installed, process running and Pet Care World visible on Android 35 emulator.'
echo 'This does not verify Play Protect, release signing, physical device behavior or reminder delivery.'

# Connect to the debuggable WebView of this test APK, not a desktop browser.
adb shell pm grant com.petcare.companion android.permission.POST_NOTIFICATIONS
PID=$(tr -d '\r\n' < android-test-evidence/pid.txt)
adb forward tcp:9222 localabstract:webview_devtools_remote_$PID
node tools/test-android-webview.mjs | tee android-test-evidence/webview-tests.txt
