export const GITHUB_REPO_URL = "https://github.com/Chouksey-Arnav/flowstate-dev";
export const GITHUB_API_URL = "https://api.github.com/repos/Chouksey-Arnav/flowstate-dev";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate-dev.vercel.app";

// Desktop shell builds are published as GitHub release assets by
// .github/workflows/desktop-release.yml. "latest/download/<name>" is a
// stable GitHub URL that always resolves to the newest release's asset.
export const DESKTOP_DOWNLOAD_MAC_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState.dmg`;
export const DESKTOP_DOWNLOAD_WINDOWS_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState-Setup.exe`;
export const DESKTOP_DOWNLOAD_LINUX_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState.AppImage`;
