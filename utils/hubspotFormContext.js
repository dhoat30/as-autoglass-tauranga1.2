import { siteUrl } from "@/site.config";

function getTrustedPageUri(submittedPageUri, fallbackPath) {
  let pathname = fallbackPath;
  let search = "";

  try {
    const submittedUrl = new URL(submittedPageUri);
    pathname = submittedUrl.pathname || fallbackPath;
    search = submittedUrl.search;
  } catch {
    // Use the known route when the browser did not provide a valid absolute URL.
  }

  return new URL(`${pathname}${search}`, `${siteUrl}/`).toString();
}

function getVisitorIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor?.split(",")[0]?.trim() ||
    ""
  );
}

export function getHubSpotFormContext({
  request,
  submittedPageUri,
  fallbackPath,
  pageName,
}) {
  const hutk = request.cookies.get("hubspotutk")?.value;
  const ipAddress = getVisitorIp(request);

  return {
    pageName,
    pageUri: getTrustedPageUri(submittedPageUri, fallbackPath),
    ...(hutk ? { hutk } : {}),
    ...(ipAddress ? { ipAddress } : {}),
  };
}
