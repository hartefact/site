#!/usr/bin/env python3
"""
Remove solid black backgrounds from funnel_logo.png and name_logo.png.
Outputs transparent PNGs to public/logo/.
Requires: pip install Pillow
"""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Please install Pillow: pip install Pillow")
    raise

# Paths
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "components"
OUT = ROOT / "public" / "logo"
FILES = ["funnel_logo.png", "name_logo.png"]

# Pixels with all channels below this are made transparent (removes black bg)
BLACK_THRESHOLD = 35


def remove_black_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        if r <= BLACK_THRESHOLD and g <= BLACK_THRESHOLD and b <= BLACK_THRESHOLD:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        src_path = SRC / name
        if not src_path.exists():
            print(f"Skip (not found): {src_path}")
            continue
        img = Image.open(src_path)
        out_img = remove_black_background(img)
        out_path = OUT / name
        out_img.save(out_path, "PNG")
        print(f"Saved: {out_path}")


if __name__ == "__main__":
    main()
