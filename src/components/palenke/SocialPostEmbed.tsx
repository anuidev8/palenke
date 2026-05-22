"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveSocialEmbed } from "@/lib/social-embed";

type SocialPostEmbedProps = {
  url: string;
  title: string;
  description?: string;
  inline?: boolean;
};

function SocialFallback({
  title,
  description,
  href,
}: {
  title: string;
  description?: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border border-[#e8dfd3] bg-[#f8f5f2] px-4 py-4">
      <p className="text-base font-semibold leading-snug text-[#1a1a1a]">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-[#4a4540]">{description}</p> : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
      >
        Abrir publicación original →
      </a>
    </div>
  );
}

export function SocialPostEmbed({ url, title, description, inline = false }: SocialPostEmbedProps) {
  const embed = useMemo(() => resolveSocialEmbed(url), [url]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeTimedOut, setIframeTimedOut] = useState(false);

  useEffect(() => {
    if (!inline || !embed.iframeUrl) return;
    const timer = window.setTimeout(() => setIframeTimedOut(true), 5000);
    return () => window.clearTimeout(timer);
  }, [inline, embed.iframeUrl, embed.sourceUrl]);

  const shouldShowInlineFallback = !embed.iframeUrl || (!iframeLoaded && iframeTimedOut);
  const inlineHeight =
    embed.provider === "instagram"
      ? 520
      : embed.provider === "facebook"
        ? 460
        : embed.provider === "x"
          ? 430
          : 420;

  if (inline) {
    return (
      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-2 sm:p-3">
        {shouldShowInlineFallback ? (
          <SocialFallback title={title} description={description} href={embed.sourceUrl} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e8dfd3] bg-[#f8f5f2]">
            <iframe
              title={`${title} (${embed.providerLabel})`}
              src={embed.iframeUrl ?? undefined}
              className="w-full"
              style={{ height: `${inlineHeight}px`, border: "0" }}
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeTimedOut(true)}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-[28px] border border-[#e8dfd3] bg-white p-5 sm:p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a756e]">
        Publicación en {embed.providerLabel}
      </p>

      {embed.iframeUrl ? (
        <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-[#f8f5f2]">
          <iframe
            title={`${title} (${embed.providerLabel})`}
            src={embed.iframeUrl ?? undefined}
            className="w-full"
            style={{ height: `${embed.height}px`, border: "0" }}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="rounded-xl border border-[#e8dfd3] bg-[#f8f5f2] px-4 py-3 text-sm text-[#4a4540]">
          Este enlace no admite embed automático. Puedes abrir la publicación original.
        </p>
      )}

      <a
        href={embed.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
      >
        Abrir publicación original →
      </a>
    </section>
  );
}
