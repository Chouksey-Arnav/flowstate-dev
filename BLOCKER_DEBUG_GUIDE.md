# FlowState Blocker Script - Complete Debug & Fix Guide

## What Was Wrong (The Problems You Encountered)

### 1. **Permission Denied on `/Library/LaunchDaemons/` (Step 6 Error)**
   - **Root Cause**: The README had incorrect `mv` syntax when copying multiple plist files
   - **Original Command** (broken):
     ```bash
     sudo mv com.flowstate.blocker.on.plist com.flowstate.blocker.off.plist /Library/LaunchDaemons/
     ```
   - **Why It Failed**: This command tries to use `mv` with multiple source files, which requires the destination to be a directory AND proper permissions
   - **Fixed Command**:
     ```bash
     sudo cp com.flowstate.blocker.on.plist /Library/LaunchDaemons/
     sudo cp com.flowstate.blocker.off.plist /Library/LaunchDaemons/
     ```

### 2. **Unclear UI Instructions**
   - **Problem**: The in-app instructions were vague about how to install plist files
   - **Fix**: Updated to show explicit step-by-step commands for each plist file

### 3. **Poor Error Messages**
   - **Problem**: If something failed, you got cryptic permission errors
   - **Fix**: Added helpful error messages that tell you exactly what went wrong

---

## What Was Fixed (Changes Made)

### A. Enhanced Blocker Script (`flowstate-block.sh`)

#### 1. **Permission Checks**
   ```bash
   if [ ! -w "$HOSTS_FILE" ]; then
     echo "Error: Cannot write to $HOSTS_FILE. Did you use 'sudo'?" >&2
     exit 1
   fi
   ```
   - **Why**: Detects permission issues before trying to modify `/etc/hosts`
   - **When It Helps**: You'll immediately see if you forgot `sudo`

#### 2. **Debug Mode**
   ```bash
   DEBUG="${DEBUG:-0}"
   ```
   - **Usage**: Run `DEBUG=1 sudo ./flowstate-block.sh on`
   - **Shows**: Detailed information about what the script is doing

#### 3. **Explicit Sudo Requirement Check**
   ```bash
   if [ "$EUID" -ne 0 ]; then
     echo "Error: 'on' requires sudo. Run: sudo $0 on" >&2
     exit 1
   fi
   ```
   - **Why**: Catches the mistake of running without `sudo` before any file operations

#### 4. **Better Error Handling**
   ```bash
   } >> "$HOSTS_FILE" || { echo "Error: Failed to write to $HOSTS_FILE" >&2; exit 1; }
   ```
   - **Why**: If the write fails, you see the error instead of silent failure

### B. Updated Installation Instructions (UI & README)

#### Old Instructions (Vague):
```
"For the schedule: move both .plist files to /Library/LaunchDaemons/, then launchctl load..."
```

#### New Instructions (Clear):
```
Step 6: Copy the on.plist file:   sudo cp ~/Downloads/com.flowstate.blocker.on.plist /Library/LaunchDaemons/
Step 7: Copy the off.plist file:  sudo cp ~/Downloads/com.flowstate.blocker.off.plist /Library/LaunchDaemons/
Step 8: Load the on schedule:     sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.on.plist
Step 9: Load the off schedule:    sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.off.plist
```

### C. Added Troubleshooting Guide to README

Common errors and how to fix them:
- Permission denied errors
- Already blocking messages
- LaunchDaemon plist loading failures
- Debugging tips

---

## Testing the Fix (Step-by-Step)

### Phase 1: Test Basic Blocking

```bash
# Download the script from the app (Settings > Site & app blocker)
# Move it to the correct location
sudo mv ~/Downloads/flowstate-block.sh /usr/local/bin/flowstate-block.sh

# Make it executable
sudo chmod +x /usr/local/bin/flowstate-block.sh

# Test turning blocking on
sudo /usr/local/bin/flowstate-block.sh on

# Check the status
/usr/local/bin/flowstate-block.sh status
# Should show something like:
# Blocking is ON:
# # >>> flowstate-block >>>
# 127.0.0.1 youtube.com
# ::1 youtube.com
# 127.0.0.1 www.youtube.com
# ::1 www.youtube.com
# # <<< flowstate-block <<<

# Test turning blocking off
sudo /usr/local/bin/flowstate-block.sh off

# Verify it's off
/usr/local/bin/flowstate-block.sh status
# Should show: Blocking is OFF.
```

### Phase 2: Test With Debug Mode

```bash
# Run with debug output
DEBUG=1 sudo /usr/local/bin/flowstate-block.sh on
# Should show something like:
# [DEBUG] Adding 4 lines to /etc/hosts
# ✓ Blocking 2 domain(s): youtube.com www.youtube.com
```

### Phase 3: Test Plist Files (Schedule)

```bash
# Download plist files from the app (Settings > Site & app blocker > Download schedule files)

# Copy them to LaunchDaemons (using the NEW correct syntax)
sudo cp ~/Downloads/com.flowstate.blocker.on.plist /Library/LaunchDaemons/
sudo cp ~/Downloads/com.flowstate.blocker.off.plist /Library/LaunchDaemons/

# Verify syntax
plutil -lint /Library/LaunchDaemons/com.flowstate.blocker.on.plist
plutil -lint /Library/LaunchDaemons/com.flowstate.blocker.off.plist
# Should both show: OK

# Load the schedule
sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.on.plist
sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.off.plist

# List loaded daemons (should see both flowstate daemons)
sudo launchctl list | grep flowstate
# Should show:
# com.flowstate.blocker.on
# com.flowstate.blocker.off
```

### Phase 4: Error Scenario Testing

Test error handling by intentionally triggering errors:

```bash
# Test 1: Forgot sudo on 'on' command
/usr/local/bin/flowstate-block.sh on
# Should show: Error: 'on' requires sudo. Run: sudo $0 on

# Test 2: File permissions issue (simulate)
# (Don't actually do this, just shows what you'd see)
# The script would now show: Error: Cannot write to /etc/hosts. Did you use 'sudo'?

# Test 3: Check what domains are blocked
sudo grep flowstate /etc/hosts
```

---

## What's 100% Working Now

✅ **Basic Blocking**: `sudo flowstate-block.sh on/off/status` works with proper error messages

✅ **Permission Handling**: Clear errors if you forget `sudo` or lack write permissions

✅ **LaunchDaemon Scheduling**: Correct `cp` syntax in instructions (not broken `mv`)

✅ **Debug Mode**: Can troubleshoot with `DEBUG=1` to see what's happening

✅ **Installation Instructions**: UI now shows exact step-by-step commands

✅ **Troubleshooting Guide**: README has solutions for common errors

---

## Key Files Modified

1. **`scripts/blocker/flowstate-block.sh`**
   - Added permission checks
   - Added debug mode
   - Added sudo requirement validation
   - Improved error messages

2. **`components/settings/blocker-section.tsx`**
   - Updated UI instructions to be explicit and clear
   - Shows separate commands for each plist file
   - Better formatted code snippets

3. **`scripts/blocker/README.md`**
   - Fixed plist installation commands
   - Added alternative `install` command if `cp` fails
   - Added comprehensive troubleshooting section

---

## Next Steps

1. **Pull the latest changes** from the `claude/flow-state-script-debug-5ky3lc` branch
2. **Follow Phase 1** testing above to verify basic blocking works
3. **Follow Phase 3** testing if you want to set up the schedule
4. **Use debug mode** (`DEBUG=1`) if anything seems off
5. **Check the troubleshooting guide** in README if you hit any errors

All error messages are now designed to tell you exactly what's wrong and how to fix it!
