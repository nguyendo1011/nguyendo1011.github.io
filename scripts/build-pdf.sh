#!/bin/sh
# Render cv/cv.html -> public/cv.pdf with headless Chrome (no npm deps).
set -e
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
cd "$(dirname "$0")/.."
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/public/cv.pdf" "file://$PWD/cv/cv.html" 2>/dev/null
echo "built public/cv.pdf"
