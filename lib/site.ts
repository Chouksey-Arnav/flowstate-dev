export const GITHUB_REPO_URL = "https://github.com/Chouksey-Arnav/flowstate-dev";
export const GITHUB_API_URL = "https://api.github.com/repos/Chouksey-Arnav/flowstate-dev";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate-dev.vercel.app";

// Desktop shell builds are published as GitHub release assets by
// .github/workflows/desktop-release.yml. "latest/download/<name>" is a
// stable GitHub URL that always resolves to the newest release's asset.
export const DESKTOP_RELEASES_URL = `${GITHUB_REPO_URL}/releases/latest`;

export type DesktopPlatform = "mac" | "windows" | "linux";

export const DESKTOP_DOWNLOADS: Record<
  DesktopPlatform,
  { label: string; fileLabel: string; url: string }
> = {
  mac: {
    label: "Mac",
    fileLabel: ".dmg",
    url: `${GITHUB_REPO_URL}/releases/latest/download/FlowState.dmg`,
  },
  windows: {
    label: "Windows",
    fileLabel: ".exe",
    url: `${GITHUB_REPO_URL}/releases/latest/download/FlowState-Setup.exe`,
  },
  linux: {
    label: "Linux",
    fileLabel: ".AppImage",
    url: `${GITHUB_REPO_URL}/releases/latest/download/FlowState.AppImage`,
  },
};
