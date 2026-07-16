// electron-builder config as JS (rather than package.json's "build" field)
// so signing/notarization can be toggled based on whether Apple Developer
// credentials are present, instead of always attempting to sign and
// failing on machines/CI runs that don't have them.
//
// To get FlowState past macOS Gatekeeper without the "not opened, Apple
// could not verify" warning, add these 5 repo secrets (Settings -> Secrets
// and variables -> Actions), all sourced from a paid Apple Developer
// Program membership:
//   CSC_LINK                    base64-encoded .p12 export of a
//                                "Developer ID Application" certificate
//                                from Keychain Access
//   CSC_KEY_PASSWORD            the password you set when exporting the .p12
//   APPLE_ID                    the Apple ID email enrolled in the
//                                Developer Program
//   APPLE_APP_SPECIFIC_PASSWORD an app-specific password for that Apple ID
//                                (generate at appleid.apple.com)
//   APPLE_TEAM_ID                your 10-character Developer Team ID
// Once all 5 are set, the next desktop-release run signs and notarizes the
// .dmg automatically — no other changes needed. Without them, it builds
// exactly as it does today (unsigned).
const hasSigningIdentity = Boolean(process.env.CSC_LINK);

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: "dev.flowstate.desktop",
  productName: "FlowState",
  files: ["electron/main.js", "electron/preload.js", "package.json"],
  directories: {
    output: "release",
    buildResources: "electron/build",
  },
  mac: {
    category: "public.app-category.productivity",
    target: [
      {
        target: "dmg",
        arch: ["universal"],
      },
    ],
    artifactName: "FlowState.${ext}",
    // Only sign/notarize when a real certificate is available (see CSC_LINK
    // above) — otherwise explicitly build unsigned rather than letting
    // electron-builder try (and fail) to auto-discover a signing identity.
    identity: hasSigningIdentity ? undefined : null,
    hardenedRuntime: hasSigningIdentity,
    gatekeeperAssess: false,
  },
  win: {
    target: ["nsis"],
    artifactName: "FlowState-Setup.${ext}",
  },
  linux: {
    target: ["AppImage"],
    category: "Office",
    artifactName: "FlowState.${ext}",
  },
};
