#!/usr/bin/env bash
set -euo pipefail
mkdir -p android-test-evidence
APK=android/app/build/outputs/apk/debug/app-debug.apk
adb logcat -c
adb install -r "$APK" | tee android-test-evidence/install.txt
adb shell am start -W -n com.petcare.companion/.MainActivity | tee android-test-evidence/launch.txt
system_ui_recoveries=0
# Let WebView finish its first launch; this is an installation/startup smoke test.
for attempt in $(seq 1 20); do
  adb shell uiautomator dump /sdcard/pet-care-ui.xml >/dev/null 2>&1 || true
  adb pull /sdcard/pet-care-ui.xml android-test-evidence/ui.xml >/dev/null 2>&1 || true
  # Only recover the emulator launcher's observed ANR; never dismiss an app ANR.
  if grep -q "Quickstep isn't responding" android-test-evidence/ui.xml 2>/dev/null; then
    echo 'Recovering emulator Quickstep launcher ANR (not Pet Care).'
    adb shell am force-stop com.android.launcher3
    adb shell am start -W -n com.petcare.companion/.MainActivity >/dev/null
  fi
  # Android 36 can show a System UI ANR over a healthy app immediately after
  # a cold emulator boot. Select that dialog's observed Wait control at most
  # twice; never dismiss an ANR belonging to Pet Care or skip its assertions.
  if grep -q "System UI isn't responding" android-test-evidence/ui.xml 2>/dev/null && [ "$system_ui_recoveries" -lt 2 ]; then
    read -r wait_x wait_y < <(python3 - <<'PY'
import re, xml.etree.ElementTree as ET
for node in ET.parse('android-test-evidence/ui.xml').iter('node'):
    if node.get('resource-id') == 'android:id/aerr_wait':
        values = list(map(int, re.findall(r'\d+', node.get('bounds', ''))))
        if len(values) == 4:
            print((values[0]+values[2])//2, (values[1]+values[3])//2)
            break
PY
    )
    if [[ "${wait_x:-}" =~ ^[0-9]+$ && "${wait_y:-}" =~ ^[0-9]+$ ]]; then
      echo 'Waiting for the observed emulator System UI ANR (not Pet Care).'
      adb shell input tap "$wait_x" "$wait_y"
      system_ui_recoveries=$((system_ui_recoveries+1))
      continue
    fi
  fi
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
if grep -q 'ALLOW_BACKUP' android-test-evidence/package.txt; then
  echo 'Automatic Android backup must be disabled for private app data'; exit 1
fi
echo 'PASS: test APK installed, process running and Pet Care World visible on Android 36 emulator.'
echo 'This does not verify Play Protect, release signing, physical device behavior or reminder delivery.'

# Connect to the debuggable WebView of this test APK, not a desktop browser.
adb shell pm grant com.petcare.companion android.permission.POST_NOTIFICATIONS
adb shell appops set com.petcare.companion SCHEDULE_EXACT_ALARM allow
node tools/test-android-webview.mjs | tee android-test-evidence/webview-tests.txt

node tools/test-android-reboot.mjs | tee android-test-evidence/reboot-tests.txt
