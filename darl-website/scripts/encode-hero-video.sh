#!/usr/bin/env bash
# Re-encodes the master hero film (source-media/hero-original.mp4) into the
# web renditions served from public/media. Requires ffmpeg with libx264,
# libvpx-vp9 and libwebp.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=source-media/hero-original.mp4
OUT=public/media
FFMPEG=${FFMPEG:-ffmpeg}

# Audio is dropped: the hero plays muted, so an audio track is dead weight.
$FFMPEG -y -i "$IN" -an -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/hero-720.mp4"
$FFMPEG -y -i "$IN" -an -vf scale=854:-2 -c:v libx264 -preset slow -crf 26 -profile:v main -pix_fmt yuv420p -movflags +faststart "$OUT/hero-480.mp4"
$FFMPEG -y -i "$IN" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 "$OUT/hero-720.webm"
$FFMPEG -y -i "$IN" -an -vf scale=854:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 "$OUT/hero-480.webm"

# Poster = first frame, so the swap from poster to video is seamless.
$FFMPEG -y -ss 0.2 -i "$IN" -frames:v 1 -c:v libwebp -quality 78 "$OUT/hero-poster.webp"
$FFMPEG -y -ss 0.2 -i "$IN" -frames:v 1 -q:v 4 "$OUT/hero-poster.jpg"
$FFMPEG -y -ss 0.2 -i "$IN" -frames:v 1 -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" -q:v 4 "$OUT/og-image.jpg"

# Stills used in the Infrastructure section.
$FFMPEG -y -ss 1.0 -i "$IN" -frames:v 1 -vf scale=960:-2 -c:v libwebp -quality 76 "$OUT/molecules.webp"
$FFMPEG -y -ss 2.6 -i "$IN" -frames:v 1 -vf scale=960:-2 -c:v libwebp -quality 76 "$OUT/pipes.webp"
