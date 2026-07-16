export const GITHUB_REPO_URL = "https://github.com/Chouksey-Arnav/flowstate-dev";
export const GITHUB_API_URL = "https://api.github.com/repos/Chouksey-Arnav/flowstate-dev";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate-dev.vercel.app";

// Desktop shell builds are published as GitHub release assets by
// .github/workflows/desktop-release.yml. "latest/download/<name>" always
// resolves to the newest release's asset, but it's a redirect
// (latest/download -> tagged release -> signed asset URL), so it's only
// used for direct asset downloads, never as a marketing CTA href.
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

// Non-redirecting destination for "see all releases" links — "releases/latest"
// itself 302s to the tagged release, so this points at the bare releases
// index instead, which resolves without a 3XX hop.
export const DESKTOP_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
