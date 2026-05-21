import Image, { type ImageProps } from "next/image";

const LO_ULTIMO_ASSET_PREFIX = "/assets/lo-ultimo/";

/**
 * Lo último assets are already small JPEGs (~300–500px). Next/Image defaults
 * (quality 75 + resize) add blur when upscaling. Serve them unoptimized.
 */
export function LoUltimoImage({ src, quality, unoptimized, ...props }: ImageProps) {
  const isLoUltimoAsset =
    typeof src === "string" && src.startsWith(LO_ULTIMO_ASSET_PREFIX);

  return (
    <Image
      {...props}
      src={src}
      unoptimized={unoptimized ?? (isLoUltimoAsset ? true : undefined)}
      quality={isLoUltimoAsset ? undefined : (quality ?? 90)}
    />
  );
}
