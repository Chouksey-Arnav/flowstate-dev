export const GITHUB_REPO_URL = "https://github.com/Chouksey-Arnav/flowstate-dev";
export const GITHUB_API_URL = "https://api.github.com/repos/Chouksey-Arnav/flowstate-dev";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate-dev.vercel.app";

// Desktop shell builds are published as GitHub release assets by
// .github/workflows/desktop-release.yml. "latest/download/<name>" always
// resolves to the newest release's asset, but it's a redirect (latest/download
// -> tagged release -> signed asset URL) rather than a direct link, so it's
// only used for direct asset downloads, never as a marketing CTA href.
export const DESKTOP_DOWNLOAD_MAC_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState.dmg`;
export const DESKTOP_DOWNLOAD_WINDOWS_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState-Setup.exe`;
export const DESKTOP_DOWNLOAD_LINUX_URL = `${GITHUB_REPO_URL}/releases/latest/download/FlowState.AppImage`;

// Non-redirecting destination for "download the desktop app" links — lets
// visitors pick their OS and always resolves without a 3XX hop.
export const DESKTOP_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
