"""
generate-favicon.py — build a multi-resolution favicon.ico for an app.

Two modes:

1. **From a raster source** (preferred, when a brand PNG/JPG exists):
       python tools/scripts/generate-favicon.py nowiro --source apps/nowiro/public/assets/logos/nowiro-logo.png

   The script crops a square region around the symbol (auto-detects bounding
   box of the non-transparent pixels), centres it on a transparent canvas,
   and downsamples to 16/32/48 with Lanczos.

2. **From primitives** (fallback — used when no brand asset is available):
       python tools/scripts/generate-favicon.py nowiro

   Renders a stylised elephant + cherry using Pillow ImageDraw primitives.

Pure Pillow — works on Windows / macOS / Linux without Cairo / GTK runtime.

Idempotent — re-runs overwrite the .ico.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

# Sizes baked into the .ico container. 16/32/48 cover browser tabs (16),
# Windows taskbar (32) and desktop shortcuts (48).
SIZES = (16, 32, 48)

BLACK = (13, 13, 13, 255)
EAR_BLACK = (26, 26, 26, 255)
CHERRY_RED = (227, 6, 19, 255)
CHERRY_HIGHLIGHT = (255, 107, 107, 200)
EYE_WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


# ── Raster-source mode ────────────────────────────────────────────────────


def _find_symbol_right_edge(img: Image.Image, gap_threshold: int = 3) -> int:
    """Find the x-column right after the leftmost content block.

    Walks columns left→right and returns the column index right after the
    first gap of `gap_threshold` consecutive transparent columns. This is
    how we distinguish a brand symbol from the wordmark next to it in a
    horizontal logotype.
    """
    alpha = img.split()[-1]
    last_filled = -1
    empty_run = 0
    for x in range(img.width):
        has_content = any(alpha.getpixel((x, y)) > 0 for y in range(img.height))
        if has_content:
            if empty_run >= gap_threshold and last_filled >= 0:
                return last_filled + 1
            last_filled = x
            empty_run = 0
        else:
            if last_filled >= 0:
                empty_run += 1
    # No gap found → whole image is one block (already a symbol).
    return img.width


def crop_symbol(source: Image.Image) -> Image.Image:
    """Auto-crop to just the symbol portion of a brand asset.

    For a logotype like `nowiro-logo.png` (symbol on the left, wordmark on
    the right), we detect the first horizontal gap and crop everything left
    of it. For a square mark with no wordmark, we just trim transparent edges.
    """
    bbox = source.getbbox()
    if bbox is None:
        raise ValueError('Source image has no non-transparent pixels')

    cropped = source.crop(bbox)
    width, height = cropped.size

    # If the source is noticeably wider than tall, assume it's a wordmark+symbol
    # logotype and trim to just the symbol on the left.
    if width > height * 1.4:
        right_edge = _find_symbol_right_edge(cropped)
        cropped = cropped.crop((0, 0, right_edge, height))

    return cropped


def render_from_source(source_path: Path) -> Image.Image:
    """Load + auto-crop the brand asset into a square RGBA canvas."""
    img = Image.open(source_path).convert('RGBA')
    symbol = crop_symbol(img)

    # Centre on a transparent square canvas slightly larger than the symbol
    # so the .ico has uniform padding on every entry.
    side = max(symbol.size)
    canvas = Image.new('RGBA', (side, side), TRANSPARENT)
    x = (side - symbol.width) // 2
    y = (side - symbol.height) // 2
    canvas.paste(symbol, (x, y), symbol)
    return canvas


# ── Primitive-rendering mode (fallback) ──────────────────────────────────


def _scaled(value: float, size: int) -> int:
    return round(value * size / 64)


def _box(cx: float, cy: float, rx: float, ry: float, size: int) -> tuple[int, int, int, int]:
    return (
        _scaled(cx - rx, size),
        _scaled(cy - ry, size),
        _scaled(cx + rx, size),
        _scaled(cy + ry, size),
    )


def render_mark(size: int) -> Image.Image:
    """Draw the nowiro mark (elephant + cherry) at the given square pixel size."""
    img = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    body_points = [
        (8, 28), (20, 14), (38, 14), (50, 20), (54, 30), (54, 40),
        (50, 44), (48, 50), (44, 50), (44, 44), (36, 44), (36, 50),
        (32, 50), (32, 42), (24, 42), (24, 50), (20, 50), (20, 42),
        (16, 40), (10, 46), (6, 44), (8, 40), (12, 36), (10, 32),
    ]
    draw.polygon([(_scaled(x, size), _scaled(y, size)) for x, y in body_points], fill=BLACK)
    draw.ellipse(_box(36, 22, 6, 5, size), fill=EAR_BLACK)
    if size >= 24:
        draw.ellipse(_box(43, 22, 0.8, 0.8, size), fill=EYE_WHITE)
    if size >= 16:
        draw.line(
            [(_scaled(40, size), _scaled(6, size)), (_scaled(50, size), _scaled(3, size))],
            fill=BLACK,
            width=max(1, size // 24),
        )
    draw.ellipse(_box(40, 10, 5, 5, size), fill=CHERRY_RED)
    if size >= 32:
        draw.ellipse(_box(38, 8, 1.5, 1, size), fill=CHERRY_HIGHLIGHT)
    return img


# ── Packer ───────────────────────────────────────────────────────────────


def build_favicon(ico_path: Path, source_path: Path | None) -> None:
    """Render the mark at each `SIZES` entry and pack into a multi-res .ico."""
    if source_path is not None:
        master = render_from_source(source_path)
        images = [master.resize((s, s), Image.LANCZOS) for s in SIZES]
        mode = f'from-source ({source_path.name})'
    else:
        images = [render_mark(s) for s in SIZES]
        mode = 'from-primitives'

    primary = images[-1]
    primary.save(
        ico_path,
        format='ICO',
        sizes=[(s, s) for s in SIZES],
        append_images=images[:-1],
    )
    print(f'OK [{mode}]: {ico_path} ({ico_path.stat().st_size} bytes, sizes={SIZES})')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('app_name', nargs='?', default='nowiro', help='app folder under apps/ (default: nowiro)')
    parser.add_argument('--source', type=Path, default=None, help='raster brand asset to crop + downsample')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    ico_path = repo_root / 'apps' / args.app_name / 'public' / 'favicon.ico'

    if not ico_path.parent.exists():
        print(f'ERR: public dir not found: {ico_path.parent}', file=sys.stderr)
        return 1

    source = args.source
    if source is not None:
        if not source.is_absolute():
            source = (repo_root / source).resolve()
        if not source.exists():
            print(f'ERR: source not found: {source}', file=sys.stderr)
            return 1

    build_favicon(ico_path, source)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
