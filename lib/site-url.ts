export const siteOrigin =
  "https://aiden-rhaa-cloud-platform.lush-mars-9564.chatgpt.site";

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${siteOrigin}/`).toString();
}

export const personId = absoluteUrl("/#aiden-rhaa");
export const websiteId = absoluteUrl("/#website");
