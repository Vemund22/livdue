#!/bin/bash
BASE="http://gammal.livdue.com"
OUT="/Users/vemunddue/Code/livdue/inventory/gammal"
fetch() {
  local url=$1 out=$2 try=0 code
  while [ $try -lt 6 ]; do
    code=$(curl -s -w '%{http_code}' -o "$out" "$url")
    if [ "$code" = "200" ]; then return 0; fi
    try=$((try+1)); sleep $((try*4))
  done
  echo "FAILED $code $url" >> "$OUT/failed.log"; rm -f "$out"; return 1
}
for n in 1 2 3 4 5; do
  dir="FOTO/FOTO$n"; name="foto$n"
  mkdir -p "$OUT/$dir/pages" "$OUT/$dir/images"
  idx="$OUT/$dir/$name.html"
  [ -s "$idx" ] || { fetch "$BASE/$dir/$name.html" "$idx"; sleep 1; }
  works=$(grep -oE "${name}_thumbs\.pages/[^\"]+\.html" "$idx" | sed 's|.*/||; s|\.html$||' | awk '!seen[$0]++')
  for w in $works; do
    page="$OUT/$dir/pages/$w.html"
    [ -s "$page" ] || { fetch "$BASE/$dir/${name}_thumbs.pages/$w.html" "$page" || continue; sleep 0.7; }
    img=$(grep -oE "${name}_images[^\"']*/$w\.[a-zA-Z]+" "$page" | head -1)
    if [ -n "$img" ]; then
      imgfile="$OUT/$dir/images/$(basename "$img")"
      [ -s "$imgfile" ] || { fetch "$BASE/$dir/$img" "$imgfile"; sleep 0.7; }
    fi
  done
  echo "done $dir: $(echo "$works" | wc -w | tr -d ' ') works"
done
echo ALLDONE
