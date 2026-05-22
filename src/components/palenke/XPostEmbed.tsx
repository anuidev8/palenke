"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

function toCanonicalTwitterStatusUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const match = parsed.pathname.match(/^\/([^/]+)\/status\/(\d+)/i);
    if (!match) return rawUrl;
    const username = match[1];
    const statusId = match[2];
    return `https://twitter.com/${username}/status/${statusId}`;
  } catch {
    return rawUrl;
  }
}

type XPostEmbedProps = {
  url: string;
  title: string;
  description?: string;
  height?: number;
};

export function XPostEmbed({ url, title, description, height = 430 }: XPostEmbedProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canonicalUrl = useMemo(() => toCanonicalTwitterStatusUrl(url), [url]);
  const [isRendered, setIsRendered] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  function isWidgetRendered(root: HTMLDivElement) {
    return Boolean(root.querySelector("iframe, .twitter-tweet-rendered, twitter-widget"));
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.innerHTML = `<blockquote class="twitter-tweet" data-dnt="true" data-conversation="none"><a href="${canonicalUrl}">Post</a></blockquote>`;

    const loadWidgets = () => {
      window.twttr?.widgets?.load(root);
    };

    if (window.twttr?.widgets) {
      loadWidgets();
      return;
    }

    const existingScript = document.getElementById("x-widgets-script") as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", loadWidgets);
      return () => existingScript.removeEventListener("load", loadWidgets);
    }

    const script = document.createElement("script");
    script.id = "x-widgets-script";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.addEventListener("load", loadWidgets);
    document.body.appendChild(script);
    const checkInterval = window.setInterval(() => {
      if (isWidgetRendered(root)) {
        setIsRendered(true);
        setHasFailed(false);
        window.clearInterval(checkInterval);
      }
    }, 250);
    const failTimer = window.setTimeout(() => {
      if (!isWidgetRendered(root)) {
        setHasFailed(true);
      }
      window.clearInterval(checkInterval);
    }, 5000);

    return () => {
      script.removeEventListener("load", loadWidgets);
      window.clearInterval(checkInterval);
      window.clearTimeout(failTimer);
    };
  }, [canonicalUrl]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const checkInterval = window.setInterval(() => {
      if (isWidgetRendered(root)) {
        setIsRendered(true);
        setHasFailed(false);
        window.clearInterval(checkInterval);
      }
    }, 250);
    const failTimer = window.setTimeout(() => {
      if (!isWidgetRendered(root)) {
        setHasFailed(true);
      }
      window.clearInterval(checkInterval);
    }, 5000);

    return () => {
      window.clearInterval(checkInterval);
      window.clearTimeout(failTimer);
    };
  }, [canonicalUrl]);

  return (
    <section className="rounded-2xl border border-[#e8dfd3] bg-white p-2 sm:p-3">
      {hasFailed ? (
        <div className="rounded-xl border border-[#e8dfd3] bg-[#f8f5f2] px-4 py-4">
          <p className="text-base font-semibold leading-snug text-[#1a1a1a]">{title}</p>
          {description ? <p className="mt-2 text-sm leading-6 text-[#4a4540]">{description}</p> : null}
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] transition hover:text-[#1b5e20]"
          >
            Abrir publicación original →
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e8dfd3] bg-[#f8f5f2] p-2">
          <div
            ref={rootRef}
            className="w-full overflow-auto"
            style={{ maxHeight: `${height}px` }}
            aria-label="X post embed"
          />
          {!isRendered ? (
            <p className="px-3 pb-1 pt-2 text-xs text-[#7a756e]">Cargando publicación de X…</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
