# FlowState site blocker

[![Status](https://img.shields.io/badge/Status-Production-success)](https://flowstate.app)

FlowState is a web app running in production (deployed via Coolify on a VPS). It runs in your browser, which by design has no access to your operating system's network settings. It can't reach out and block a site on your computer for you. What it *can* do is generate a real, local blocker script for you to install once.

## Recommended: generate your personal script from the app

Go to **Settings → Site & app blocker**. Add the domains you want blocked
(YouTube is on by default), optionally set a work-hours schedule, then click
**Download blocker script**. That downloads a copy of `flowstate-block.sh`
pre-filled with your exact domain list.

## This folder

`flowstate-block.sh` here is the same script with a generic default
(`youtube.com`) baked in, checked into the repo so it's usable without
running the app at all. Edit the `DOMAINS` array directly if you'd rather
manage it by hand.

## Install (macOS / Linux)

```bash
sudo mv flowstate-block.sh /usr/local/bin/flowstate-block.sh
sudo chmod +x /usr/local/bin/flowstate-block.sh

# Turn blocking on
sudo flowstate-block.sh on

# Turn blocking off
sudo flowstate-block.sh off

# Check current state
flowstate-block.sh status
```

The script edits `/etc/hosts`, redirecting each blocked domain to
`127.0.0.1`/`::1`. That blocks it for every browser and app on the machine,
not just one tab — and it's trivially reversible with `off`.

## Optional: auto-block on a schedule (macOS)

If you enable a schedule in Settings, the app also gives you two
`launchd` plist files (`com.flowstate.blocker.on.plist` /
`...off.plist`) that run the script automatically at your chosen
start/end times on the days you pick.

```bash
# Make sure flowstate-block.sh is in place first (step 1-2 above)
sudo cp com.flowstate.blocker.on.plist /Library/LaunchDaemons/
sudo cp com.flowstate.blocker.off.plist /Library/LaunchDaemons/
sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.on.plist
sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.off.plist
```

**Common issue: Permission denied when copying plists?**

If you see `sudo: cp: command not found` or a permission error, try:
```bash
sudo install -m 644 com.flowstate.blocker.on.plist /Library/LaunchDaemons/
sudo install -m 644 com.flowstate.blocker.off.plist /Library/LaunchDaemons/
```

To stop the schedule later:

```bash
sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.on.plist
sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.off.plist
```

## Troubleshooting

**"zsh: permission denied: /Library/LaunchDaemons/"**
- Make sure you're using `sudo cp` (not just `cp`) to copy the plist files
- Check that both plist files exist: `ls ~/Downloads/com.flowstate.blocker.*.plist`
- Verify `/Library/LaunchDaemons/` is writable: `sudo ls -ld /Library/LaunchDaemons/` should show `rwx` for owner

**Changed your domain list after already turning blocking on?**
- Re-run `sudo flowstate-block.sh on` with the freshly updated script in place — it automatically replaces the old
  blocklist with the new one, no need to run `off` first.

**"Cannot write to /etc/hosts. Did you use 'sudo'?"**
- Always prefix with `sudo`: `sudo /usr/local/bin/flowstate-block.sh on`

**"launchctl load failed"**
- Verify the plist file syntax: `plutil -lint /Library/LaunchDaemons/com.flowstate.blocker.on.plist`
- Check the script path in the plist points to `/usr/local/bin/flowstate-block.sh`
- Ensure the script is executable: `sudo chmod +x /usr/local/bin/flowstate-block.sh`

**Changed the schedule but the old times are still running?**
- `launchctl load` on an already-loaded label is a no-op, so overwriting the plist file alone does nothing. Unload
  the old job first, then load the new file:
  ```bash
  sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.on.plist
  sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.off.plist
  # copy the freshly downloaded plists over, then:
  sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.on.plist
  sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.off.plist
  ```

**Debugging mode**
- Run with debug output: `DEBUG=1 sudo /usr/local/bin/flowstate-block.sh on`

## Honesty about limits

- This blocks at the DNS/hosts level. It's strong against casual
  re-opening of a site, not against someone determined to edit
  `/etc/hosts` back — same as every other lightweight blocker. If you want
  something you truly can't bypass mid-urge, pair this with a dedicated tool
  like Cold Turkey (Windows/macOS) or Freedom, which support locked
  sessions.
- It blocks by domain, so it won't catch a site reachable by IP address or
  through a VPN/proxy that bypasses your local DNS.
- Always keep a backup of `/etc/hosts` before editing it by hand; this
  script only ever touches the block between its own markers.
