"""Turn generated stills into hero frame sequences.

Put the images for each hero in raw/frames/<site>/ (site = build | interiors | glass).
Any file names work; they are sorted naturally (1, 2, ... 10, 11), so name them in story order.

    python scripts/prepare-frames.py            # all sites
    python scripts/prepare-frames.py build      # one site

Writes assets/frames/<site>/01.webp ... NN.webp (1920 px wide) plus 01-m.webp ... (1280 px, for phones),
and prints the frame count. If it isn't 24, update data-frame-count on that page's .film-hero.
"""
import re, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITES = sys.argv[1:] or ["build", "interiors", "glass"]
natural = lambda p: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", p.name)]

for site in SITES:
    src = ROOT / "raw" / "frames" / site
    files = sorted([p for p in src.glob("*") if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}], key=natural)
    if not files:
        print(f"{site}: no images in {src}")
        continue
    out = ROOT / "assets" / "frames" / site
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.webp"):
        old.unlink()
    size = None
    for k, f in enumerate(files, 1):
        im = Image.open(f).convert("RGB")
        if size is None:
            size = im.size                      # every frame is matched to the first frame's framing
        elif im.size != size:
            im = im.resize(size, Image.LANCZOS)
        for width, suffix, q in ((1920, "", 82), (1280, "-m", 78)):
            w = min(width, im.width)
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(out / f"{k:02d}{suffix}.webp", "WEBP", quality=q, method=6)
    print(f"{site}: {len(files)} frames -> {out}  (data-frame-count should be {len(files)})")
