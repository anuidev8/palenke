#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/docs/final-formats/evidences/screenshots"
PORT="${PORT:-3012}"
BASE_URL="http://127.0.0.1:${PORT}"
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LOG_FILE="/tmp/palenke-final-screenshots-dev.log"

if [[ ! -x "$CHROME_BIN" ]]; then
  echo "Chrome binary not found at: $CHROME_BIN" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

SERVER_PID=""
cleanup() {
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

cd "$ROOT_DIR"
PORT="$PORT" npm run dev >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..60}; do
  if curl -sf "$BASE_URL/" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! curl -sf "$BASE_URL/" >/dev/null 2>&1; then
  echo "Dev server did not become ready. See $LOG_FILE" >&2
  exit 1
fi

capture() {
  local path="$1"
  local file="$2"
  local width="${3:-1440}"
  local height="${4:-2200}"

  "$CHROME_BIN" \
    --headless=new \
    --no-sandbox \
    --disable-gpu \
    --disable-dev-shm-usage \
    --hide-scrollbars \
    --window-size="${width},${height}" \
    --screenshot="$OUTPUT_DIR/$file" \
    "${BASE_URL}${path}"
}

capture "/" "01-home-plataforma.png" 1440 2200
capture "/biblioteca" "02-biblioteca-buscador.png" 1440 2400
capture "/mujeres-juventudes-ninez" "03-mjn.png" 1440 2400
capture "/estadisticas" "04-estadisticas-powerbi.png" 1440 2400
capture "/geoportal?role=internal" "05-geoportal-acceso.png" 1440 2400
capture "/gobierno-propio" "06-gobierno-propio-accs.png" 1440 2400
capture "/incidencia" "07-incidencia.png" 1440 2400
capture "/login" "08-login-roles.png" 1440 1800
capture "/admin/dashboards?role=admin" "09-admin-dashboards.png" 1440 2400
capture "/admin/accs?role=admin" "10-admin-accs.png" 1440 2200

echo "Screenshots saved in $OUTPUT_DIR"
