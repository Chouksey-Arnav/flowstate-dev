#!/usr/bin/env bash
# FlowState site blocker — default template.
#
# This is a generic starting point. For a version pre-filled with the exact
# domains and schedule you configured in the app, go to Settings > Site & app
# blocker and click "Download blocker script" — it generates this same file
# with your blocklist baked in.
#
# Blocks the domains below at the OS level (every browser and app on this
# machine) by redirecting them to localhost in /etc/hosts. Requires sudo
# because /etc/hosts is root-owned. Works on macOS and Linux.
#
# Usage:
#   sudo ./flowstate-block.sh on       # start blocking
#   sudo ./flowstate-block.sh off      # stop blocking
#   ./flowstate-block.sh status        # check current state

set -euo pipefail

HOSTS_FILE="/etc/hosts"
MARKER_START="# >>> flowstate-block >>>"
MARKER_END="# <<< flowstate-block <<<"

DOMAINS=(
  "youtube.com"
  "www.youtube.com"
)

flush_dns() {
  if command -v dscacheutil >/dev/null 2>&1; then
    dscacheutil -flushcache 2>/dev/null || true
    killall -HUP mDNSResponder 2>/dev/null || true
  elif command -v systemd-resolve >/dev/null 2>&1; then
    systemd-resolve --flush-caches 2>/dev/null || true
  elif command -v resolvectl >/dev/null 2>&1; then
    resolvectl flush-caches 2>/dev/null || true
  fi
}

block_on() {
  if grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    echo "Already blocking. Run '$0 off' first to change the list."
    exit 0
  fi
  {
    echo "$MARKER_START"
    for d in "${DOMAINS[@]}"; do
      echo "127.0.0.1 $d"
      echo "::1 $d"
    done
    echo "$MARKER_END"
  } >> "$HOSTS_FILE"
  flush_dns
  echo "Blocking ${#DOMAINS[@]} domain(s): ${DOMAINS[*]}"
}

block_off() {
  if ! grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    echo "Not currently blocking."
    exit 0
  fi
  sed -i.flowstate.bak "/$MARKER_START/,/$MARKER_END/d" "$HOSTS_FILE"
  rm -f "$HOSTS_FILE.flowstate.bak"
  flush_dns
  echo "Blocking removed."
}

block_status() {
  if grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    echo "Blocking is ON:"
    sed -n "/$MARKER_START/,/$MARKER_END/p" "$HOSTS_FILE"
  else
    echo "Blocking is OFF."
  fi
}

case "${1:-}" in
  on) block_on ;;
  off) block_off ;;
  status) block_status ;;
  *)
    echo "Usage: sudo $0 {on|off|status}"
    exit 1
    ;;
esac
