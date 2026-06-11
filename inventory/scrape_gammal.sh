#!/bin/bash
# Throttled scraper for gammal.livdue.com (server rate-limits via Varnish -> retry on 429)
BASE="http://gammal.livdue.com"
OUT="/Users/vemunddue/Code/livdue/inventory/gammal"
CATS="AKRYL/akryl BRONSE/bronse FOTO/foto GRESS/gress MALERI/maleri OBJEKT/objekt PORTRETT/portrett ROM/rom STEIN/stein TEGNINGER/tegninger"

fetch() {
  local url=$1 out=$2 try=0 code
  while [ $try -lt 6 ]; do
    code=$(curl -s -w '%{http_code}' -o "$out" "$url")
    if [ "$code" = "200" ]; then return 0; fi
    try=$((try+1)); sleep $((try*4))
  done
  echo "FAILED $code $url" >> "$OUT/failed.log"
  rm -f "$out"
  return 1
}

for c in $CATS; do
  dir=$(dirname "$c"); name=$(basename "$c")
  mkdir -p "$OUT/$dir/pages" "$OUT/$dir/images"
  idx="$OUT/$dir/$name.html"
  if [ ! -s "$idx" ] || grep -q "Too Many Requests" "$idx"; then
    fetch "$BASE/$c.html" "$idx"; sleep 1
  fi
  works=$(grep -oE "${name}_thumbs\.pages/[^\"]+\.html" "$idx" | sed 's|.*/||; s|\.html$||' | awk '!seen[$0]++')
  for w in $works; do
    page="$OUT/$dir/pages/$w.html"
    if [ ! -s "$page" ]; then
      fetch "$BASE/$dir/${name}_thumbs.pages/$w.html" "$page" || continue
      sleep 0.7
    fi
    img=$(grep -oE "${name}_images[^\"']*/$w\.[a-zA-Z]+" "$page" | head -1)
    if [ -n "$img" ]; then
      imgfile="$OUT/$dir/images/$(basename "$img")"
      if [ ! -s "$imgfile" ]; then
        fetch "$BASE/$dir/$img" "$imgfile"
        sleep 0.7
      fi
    fi
  done
  echo "done $c: $(echo "$works" | wc -w | tr -d ' ') works"
done

# Text pages: CV, commissions, upcoming (no + en)
mkdir -p "$OUT/CV" "$OUT/COMMISSIONS" "$OUT/UPCOMING"
for p in CV/cv-no CV/cv-en COMMISSIONS/com-no COMMISSIONS/com-en UPCOMING/upcoming-no; do
  f="$OUT/$p.html"
  if [ ! -s "$f" ] || grep -q "Too Many Requests" "$f"; then
    fetch "$BASE/$p.html" "$f"; sleep 1
  fi
done
echo ALLDONE
