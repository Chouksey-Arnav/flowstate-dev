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
DEBUG="${DEBUG:-0}"

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

strip_block() {
  if grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    sed -i.flowstate.bak "/$MARKER_START/,/$MARKER_END/d" "$HOSTS_FILE" || { echo "Error: Failed to edit $HOSTS_FILE" >&2; exit 1; }
    rm -f "$HOSTS_FILE.flowstate.bak"
  fi
}

block_on() {
  if [ ! -f "$HOSTS_FILE" ]; then
    echo "Error: $HOSTS_FILE not found. Are you on macOS or Linux?" >&2
    exit 1
  fi

  if [ ! -w "$HOSTS_FILE" ]; then
    echo "Error: Cannot write to $HOSTS_FILE. Did you use 'sudo'?" >&2
    exit 1
  fi

  # Re-running 'on' always syncs to the DOMAINS baked into this script —
  # it never silently no-ops just because a block was already present, so
  # re-downloading after changing your blocklist in the app "just works."
  local was_blocking=0
  if grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    was_blocking=1
  fi
  strip_block

  if [ "$DEBUG" = "1" ]; then
    echo "[DEBUG] Adding $(( ${#DOMAINS[@]} * 2 )) lines to $HOSTS_FILE"
  fi

  {
    echo "$MARKER_START"
    for d in "${DOMAINS[@]}"; do
      echo "127.0.0.1 $d"
      echo "::1 $d"
    done
    echo "$MARKER_END"
  } >> "$HOSTS_FILE" || { echo "Error: Failed to write to $HOSTS_FILE" >&2; exit 1; }

  flush_dns
  if [ "$was_blocking" = "1" ]; then
    echo "✓ Blocklist updated. Now blocking ${#DOMAINS[@]} domain(s): ${DOMAINS[*]}"
  else
    echo "✓ Blocking ${#DOMAINS[@]} domain(s): ${DOMAINS[*]}"
  fi
}

block_off() {
  if ! grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    echo "Not currently blocking."
    exit 0
  fi

  if [ ! -w "$HOSTS_FILE" ]; then
    echo "Error: Cannot write to $HOSTS_FILE. Did you use 'sudo'?" >&2
    exit 1
  fi

  if [ "$DEBUG" = "1" ]; then
    echo "[DEBUG] Removing flowstate block from $HOSTS_FILE"
  fi

  strip_block
  flush_dns
  echo "✓ Blocking removed."
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
  on)
    if [ "$EUID" -ne 0 ]; then
      echo "Error: 'on' requires sudo. Run: sudo $0 on" >&2
      exit 1
    fi
    block_on
    ;;
  off)
    if [ "$EUID" -ne 0 ]; then
      echo "Error: 'off' requires sudo. Run: sudo $0 off" >&2
      exit 1
    fi
    block_off
    ;;
  status)
    block_status
    ;;
  *)
    echo "Usage: sudo $0 {on|off|status}"
    echo "  on     - start blocking (requires sudo)"
    echo "  off    - stop blocking (requires sudo)"
    echo "  status - show current block status (no sudo needed)"
    exit 1
    ;;
esac
