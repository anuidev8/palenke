export type SocialProvider = "instagram" | "x" | "facebook" | "other";

export type SocialEmbedConfig = {
  provider: SocialProvider;
  providerLabel: string;
  sourceUrl: string;
  iframeUrl: string | null;
  height: number;
};

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.toString();
  } catch {
    return value;
  }
}

export function resolveSocialEmbed(urlValue: string): SocialEmbedConfig {
  const sourceUrl = normalizeUrl(urlValue);

  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    const pathname = parsed.pathname;

    if (host === "instagram.com" || host === "m.instagram.com") {
      const match = pathname.match(/^\/(p|reel)\/([^/?#]+)/i);
      if (match) {
        const type = match[1].toLowerCase();
        const id = match[2];
        return {
          provider: "instagram",
          providerLabel: "Instagram",
          sourceUrl,
          iframeUrl: `https://www.instagram.com/${type}/${id}/embed/`,
          height: 760,
        };
      }
    }

    if (host === "x.com" || host === "twitter.com") {
      const match = pathname.match(/^\/([^/]+)\/status\/(\d+)/i);
      if (match) {
        return {
          provider: "x",
          providerLabel: "X",
          sourceUrl,
          iframeUrl: null,
          height: 430,
        };
      }
    }

    if (host === "facebook.com" || host === "m.facebook.com") {
      return {
        provider: "facebook",
        providerLabel: "Facebook",
        sourceUrl,
        iframeUrl: null,
        height: 460,
      };
    }
  } catch {
    // Fall through to generic external link.
  }

  return {
    provider: "other",
    providerLabel: "enlace externo",
    sourceUrl,
    iframeUrl: null,
    height: 0,
  };
}
