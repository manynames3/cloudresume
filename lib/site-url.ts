export const siteOrigin = "https://cloudresumev3.pages.dev";

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${siteOrigin}/`).toString();
}

export const personId = absoluteUrl("/#aiden-rhaa");
export const websiteId = absoluteUrl("/#website");
