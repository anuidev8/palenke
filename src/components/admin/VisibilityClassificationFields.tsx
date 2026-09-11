"use client";

import { useState } from "react";
import type { Visibility } from "@/lib/mock-data";
import {
  CLASSIFICATION_BY_VISIBILITY,
  defaultBucketForVisibility,
  type DocumentStorageBucket,
} from "@/lib/security/classification";

const VISIBILITY_OPTIONS: Visibility[] = ["public", "internal", "sensitive"];

type Props = {
  defaultVisibility?: Visibility;
  /** Initial bucket; if omitted, follows classification. */
  defaultBucket?: DocumentStorageBucket | "";
  allowEmptyBucket?: boolean;
};

export function VisibilityClassificationFields({
  defaultVisibility = "internal",
  defaultBucket,
  allowEmptyBucket = true,
}: Props) {
  const [visibility, setVisibility] = useState<Visibility>(defaultVisibility);
  const [useLocalPublicPath, setUseLocalPublicPath] = useState(defaultBucket === "");

  const profile = CLASSIFICATION_BY_VISIBILITY[visibility];
  const expectedBucket = defaultBucketForVisibility(visibility);
  const bucketValue: DocumentStorageBucket | "" = useLocalPublicPath ? "" : expectedBucket;

  return (
    <>
      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-[color:var(--forest)]">Clasificación / visibilidad</span>
        <select
          name="visibility"
          required
          value={visibility}
          onChange={(event) => {
            setVisibility(event.target.value as Visibility);
            setUseLocalPublicPath(false);
          }}
          className="input-shell"
        >
          {VISIBILITY_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {CLASSIFICATION_BY_VISIBILITY[value].label}
            </option>
          ))}
        </select>
        <span className="text-xs text-[color:var(--muted)]">{profile.description}</span>
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-[color:var(--forest)]">Bucket (según clasificación)</span>
        <select
          name="storage_bucket"
          value={bucketValue}
          onChange={(event) => {
            setUseLocalPublicPath(event.target.value === "");
          }}
          className="input-shell"
        >
          <option value={expectedBucket}>{expectedBucket}</option>
          {allowEmptyBucket ? (
            <option value="">(sin bucket para ruta pública local)</option>
          ) : null}
        </select>
        <span className="text-xs text-[color:var(--muted)]">
          Controles: {profile.controls.join(" · ")}. Signed URL:{" "}
          {Math.round(profile.signedUrlTtlSeconds / 60)} min.
        </span>
      </label>
    </>
  );
}
