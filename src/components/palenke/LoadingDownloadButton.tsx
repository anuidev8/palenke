"use client";

import { useState, type CSSProperties } from "react";
import { Download, Loader2 } from "lucide-react";

type LoadingDownloadButtonProps = {
  href: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export function LoadingDownloadButton({
  href,
  label = "Descargar documento",
  className,
  style,
}: LoadingDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <a
      href={href}
      className={className}
      style={style}
      aria-busy={isLoading}
      onClick={() => setIsLoading(true)}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {isLoading ? "Preparando descarga..." : label}
    </a>
  );
}
