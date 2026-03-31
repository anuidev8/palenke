#!/usr/bin/env bash
# Apply base-documents migration + docs-public bucket (see 003 / 004) and upload PDFs.
#
# Prerequisites:
#   - supabase login
#   - supabase link --project-ref <your-project-ref>
#   - Optional: set BASE_DOCS_DIR to a folder containing:
#       reglamentos/base.pdf planes-uso/base.pdf etnodesarrollo/base.pdf conservacion/base.pdf
#     If unset, uploads public/docs/normativa/Ley_70_de_1993.pdf to each path as a stand-in (replace in Storage with real base docs).
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! supabase projects list >/dev/null 2>&1; then
  echo "Run: supabase login" >&2
  exit 1
fi

if ! supabase db push --linked --yes; then
  echo "Ensure the project is linked: supabase link --project-ref <ref>" >&2
  exit 1
fi

if [[ -n "${BASE_DOCS_DIR:-}" ]]; then
  for rel in \
    reglamentos/base.pdf \
    planes-uso/base.pdf \
    etnodesarrollo/base.pdf \
    conservacion/base.pdf; do
    src="$BASE_DOCS_DIR/$rel"
    if [[ ! -f "$src" ]]; then
      echo "Missing file: $src (set BASE_DOCS_DIR to the folder that contains these paths)" >&2
      exit 1
    fi
    supabase storage cp --experimental "$src" "ss:///docs-public/$rel" --linked
  done
else
  PLACEHOLDER_PDF="$ROOT/public/docs/normativa/Ley_70_de_1993.pdf"
  if [[ ! -f "$PLACEHOLDER_PDF" ]]; then
    echo "No BASE_DOCS_DIR set and placeholder missing: $PLACEHOLDER_PDF" >&2
    exit 1
  fi
  echo "Using placeholder PDF (Ley 70) for all four paths; set BASE_DOCS_DIR with real base.pdf files to override."
  for rel in \
    reglamentos/base.pdf \
    planes-uso/base.pdf \
    etnodesarrollo/base.pdf \
    conservacion/base.pdf; do
    supabase storage cp --experimental "$PLACEHOLDER_PDF" "ss:///docs-public/$rel" --linked
  done
fi

echo "Done. Verify with: supabase storage ls --experimental ss:///docs-public --linked -r"
