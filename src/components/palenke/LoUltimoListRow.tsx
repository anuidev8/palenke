import { LoUltimoImage } from "@/components/palenke/LoUltimoImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InternalNewsItem } from "@/lib/content";

type LoUltimoListRowProps = {
  item: InternalNewsItem;
  href: string;
  compact?: boolean;
};

export function LoUltimoListRow({ item, href, compact = false }: LoUltimoListRowProps) {
  const dateLabel = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(
    new Date(item.publishedAt),
  );
  const isExternal = /^https?:\/\//i.test(href);
  const className = `group flex items-start gap-4 transition hover:bg-[#f8f5f2] ${
    compact ? "px-4 py-3.5 sm:px-5 sm:py-4" : "px-5 py-4"
  }`;
  const content = (
    <>
      {item.coverImageUrl ? (
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl border border-[#e8dfd3] bg-[#f0eae0] ${
            compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-16 w-16"
          }`}
        >
          <LoUltimoImage
            src={item.coverImageUrl}
            alt=""
            fill
            sizes={compact ? "64px" : "64px"}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl bg-[#fddede] text-xs font-bold text-[#d32f2f] ${
            compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-10 w-10"
          }`}
        >
          {item.category.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#7a756e]">
          {dateLabel} · <span className="font-semibold text-[#1a1a1a]">{item.category}</span>
        </p>
        <p
          className={`mt-1 font-medium leading-5 text-[#1a1a1a] ${
            compact ? "text-sm line-clamp-2" : "text-sm"
          }`}
        >
          {item.title}
        </p>
        {!compact ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#7a756e]">{item.summary}</p>
        ) : null}
        <p className="mt-0.5 text-xs text-[#7a756e]">{item.location ?? "Palenke / PCN"}</p>
      </div>

      <ArrowRight
        className="mt-1 h-4 w-4 shrink-0 text-[#7a756e] transition group-hover:translate-x-0.5 group-hover:text-[#2e7d32]"
        aria-hidden="true"
      />
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
