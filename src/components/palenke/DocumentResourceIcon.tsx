import { getDocumentTypeVisual } from "@/lib/document-type-display";

type DocumentResourceIconProps = {
  type: string;
  className?: string;
};

export function DocumentResourceIcon({ type, className = "" }: DocumentResourceIconProps) {
  const visual = getDocumentTypeVisual(type);

  if (visual.variant === "slides") {
    return (
      <div className={`relative w-10 h-[52px] transition-transform group-hover:scale-105 z-10 ${className}`}>
        <div className="absolute inset-0 rounded-lg border border-white/50 bg-gradient-to-b from-[#fff8ef] to-[#f0e4d4] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="absolute top-2 left-1.5 right-1.5 h-[7px] rounded-[2px] bg-[#d97706]/25" />
          <div className="absolute top-[18px] left-1.5 right-1.5 h-[7px] rounded-[2px] bg-[#d97706]/18" />
          <div className="absolute top-[28px] left-1.5 w-[14px] h-[7px] rounded-[2px] bg-[#d97706]/12" />
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-[#d97706] px-1 py-0.5 text-[7px] font-black leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            {visual.badge}
          </div>
        </div>
        <div className="absolute top-0 right-0 h-4 w-4 rounded-bl-lg border-b border-l border-white/40 bg-gradient-to-bl from-transparent via-[#fffaf5] to-[#f0e4d4] shadow-sm" />
      </div>
    );
  }

  return (
    <div className={`relative w-10 h-[52px] transition-transform group-hover:scale-105 z-10 ${className}`}>
      <div className="absolute inset-0 overflow-hidden rounded-lg border border-white/50 bg-gradient-to-b from-[#f8f5f2] to-[#e8dfd3] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="absolute top-4 left-2 h-[1.5px] w-5 rounded-full bg-black/10" />
        <div className="absolute top-[22px] left-2 h-[1.5px] w-4 rounded-full bg-black/10" />
        <div className="absolute top-[28px] left-2 h-[1.5px] w-[18px] rounded-full bg-black/10" />
        <div className="absolute top-[34px] left-2 h-[1.5px] w-3 rounded-full bg-black/10" />
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-[#d32f2f] px-1 py-0.5 text-[7px] font-black leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
          {visual.badge}
        </div>
      </div>
      <div className="absolute top-0 right-0 h-4 w-4 rounded-bl-lg border-b border-l border-white/40 bg-gradient-to-bl from-transparent via-[#fcfaf7] to-[#e8dfd3] shadow-sm" />
    </div>
  );
}
