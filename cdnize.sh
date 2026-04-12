#!/usr/bin/env bash
set -euo pipefail

TARGET="dist/index.html"

CDN_LINK='<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">'

LOCAL_LINK='<link rel="stylesheet" type="text/css" href="../../node_modules/bootstrap/dist/css/bootstrap.css">'

if [[ ! -f "$TARGET" ]]; then
  echo "cdnize.sh: error: '$TARGET' not found. Run the build step first." >&2
  exit 1
fi

sed -i "s|${LOCAL_LINK}|${CDN_LINK}|" "$TARGET"
