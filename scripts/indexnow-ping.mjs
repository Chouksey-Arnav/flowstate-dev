// Notifies IndexNow (Bing, and any other participating engine) of every URL
// in the sitemap right after a production build, so pages don't wait for a
// crawl to be picked up. Runs as "postbuild"; never fails the build.

import { readFile } from "node:fs/promises";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowstate-dev.vercel.app";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "8bc2e64af52e4ad88b9ef591a6a83731";
const SITEMAP_BODY_PATH = ".next/server/app/sitemap.xml.body";

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("[indexnow] Skipping ping (not a production build).");
    return;
  }

  let xml;
  try {
    xml = await readFile(SITEMAP_BODY_PATH, "utf8");
  } catch (err) {
    console.warn(`[indexnow] Could not read ${SITEMAP_BODY_PATH}, skipping ping.`, err.message);
    return;
  }

  const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urlList.length === 0) {
    console.warn("[indexnow] No URLs found in sitemap, skipping ping.");
    return;
  }

  const host = new URL(SITE_URL).host;
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`[indexnow] Submitted ${urlList.length} URLs, status ${res.status}.`);
  } catch (err) {
    console.warn("[indexnow] Ping failed, continuing anyway.", err.message);
  }
}

main();
