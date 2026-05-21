export const MEDIATECA_UBUNTU_STORAGE_BUCKET = "mediateca-ubuntu";

/** Public object URL for items in the mediateca-ubuntu bucket. */
export function mediatecaUbuntuPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/${MEDIATECA_UBUNTU_STORAGE_BUCKET}/${encodedPath}`;
}
