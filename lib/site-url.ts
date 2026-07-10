import { headers } from "next/headers";

const fallbackHost = "portfolio.test";

function firstHeaderValue(value: string | null): string | undefined {
  return value?.split(",")[0]?.trim() || undefined;
}

function safeHost(value: string | undefined): string {
  return value && /^[a-z0-9.-]+(?::\d+)?$/i.test(value) ? value : fallbackHost;
}

export async function requestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host = safeHost(
    firstHeaderValue(requestHeaders.get("x-forwarded-host")) ??
      firstHeaderValue(requestHeaders.get("host")),
  );
  const protocol = firstHeaderValue(requestHeaders.get("x-forwarded-proto"));
  return `${protocol === "http" ? "http" : "https"}://${host}`;
}

export function absoluteUrl(origin: string, pathname: string): string {
  return new URL(pathname, `${origin}/`).toString();
}

export function personId(origin: string): string {
  return absoluteUrl(origin, "/#aiden-rhaa");
}

export function websiteId(origin: string): string {
  return absoluteUrl(origin, "/#website");
}
