import type { DesktopPlatform } from "@/lib/site";

export interface DesktopInstallInstructions {
  title: string;
  intro: string;
  /** Exact, copy-pastable terminal command, when there is one. */
  command?: string;
  steps: string[];
}

/**
 * Single source of truth for "how do I actually open this after downloading
 * it" — shown in the install-help dialog on the landing page and mirrored on
 * the /docs page, so the copy never drifts between the two.
 */
export const DESKTOP_INSTALL_INSTRUCTIONS: Record<DesktopPlatform, DesktopInstallInstructions> = {
  mac: {
    title: "Opening FlowState on macOS",
    intro:
      "macOS blocks apps that aren't signed by a paid Apple Developer account the first time you open them — that's what \"Apple could not verify FlowState\" means. Run this once and it opens normally from then on.",
    command: "xattr -cr /Applications/FlowState.app",
    steps: [
      "Drag FlowState from the mounted disk image into your Applications folder, if you haven't already.",
      'Open Terminal — Spotlight search (⌘Space) → type "Terminal" → Enter.',
      "Paste the command below and press Enter. No password or sudo needed.",
      "Open FlowState from Applications again — it launches with no warning from now on.",
    ],
  },
  windows: {
    title: "Opening FlowState on Windows",
    intro:
      'Windows SmartScreen blocks installers that aren\'t code-signed on first run — "Windows protected your PC" is expected for an app without a paid signing certificate.',
    command: 'Unblock-File "$HOME\\Downloads\\FlowState-Setup.exe"',
    steps: [
      'Simplest: run FlowState-Setup.exe as normal. When SmartScreen appears, click "More info", then "Run anyway".',
      "Or, to avoid the prompt entirely: open PowerShell and run the command below before launching the installer — it removes the downloaded-from-the-internet flag Windows checks.",
    ],
  },
  linux: {
    title: "Opening FlowState on Linux",
    intro:
      "AppImages aren't marked executable by default after downloading — this is a normal Linux permission, not a security block, and one command fixes it for good.",
    command: "chmod +x ~/Downloads/FlowState.AppImage && ~/Downloads/FlowState.AppImage",
    steps: [
      "Open a terminal in the folder you downloaded it to (usually ~/Downloads).",
      "Run the command below — it makes the file executable and launches it in one step.",
      "After that, double-clicking FlowState.AppImage works directly, no terminal needed.",
    ],
  },
};
