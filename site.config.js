const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://asautoglass.co.nz"
).replace(/\/$/, "");

const siteName = "AS Autoglass";

function getPageUrl(path = "/") {
  if (!path || path === "/") return siteUrl;

  return `${siteUrl}/${String(path).replace(/^\/+|\/+$/g, "")}`;
}

module.exports = {
  getPageUrl,
  siteName,
  siteUrl,
};
