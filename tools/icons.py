#!/usr/bin/env python3
"""Regenerates the favicon set from tools/source/ic_launcher_clickt.png (needs Pillow)."""
from PIL import Image, ImageChops, ImageDraw
import os
root = os.path.join(os.path.dirname(__file__), '..')
src = Image.open(os.path.join(os.path.dirname(__file__), 'source/ic_launcher_clickt.png')).convert('RGBA')
white = Image.new('RGBA', src.size, (255, 255, 255, 255))
white.alpha_composite(src)
flat = white.convert('RGB')
bbox = ImageChops.difference(flat, Image.new('RGB', flat.size, (255, 255, 255))).point(lambda v: 255 if v > 24 else 0).getbbox()
pad = int(max(bbox[2] - bbox[0], bbox[3] - bbox[1]) * 0.16)
side = max(bbox[2] - bbox[0], bbox[3] - bbox[1]) + pad * 2
cx, cy = (bbox[0] + bbox[2]) // 2, (bbox[1] + bbox[3]) // 2
sq = Image.new('RGB', (side, side), (255, 255, 255))
sq.paste(flat.crop(bbox), ((side - (bbox[2] - bbox[0])) // 2, (side - (bbox[3] - bbox[1])) // 2))
brand = os.path.join(root, 'assets/img/brand')

def rounded(size, radius=0.22):
    """The icon at `size` px with curved corners (transparent outside), drawn at 4x and
    scaled down so the curve stays smooth even at 16 px."""
    big = size * 4
    mask = Image.new('L', (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * radius), fill=255)
    icon = sq.resize((size, size), Image.LANCZOS).convert('RGBA')
    icon.putalpha(mask.resize((size, size), Image.LANCZOS))
    return icon

# Browser tab and PWA icons: curved corners.
rounded(32).save(os.path.join(brand, 'favicon-32.png'), optimize=True)
rounded(512).save(os.path.join(brand, 'icon-512.png'), optimize=True)
ico = [rounded(n) for n in (16, 32, 48, 64)]
ico[-1].save(os.path.join(root, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)], append_images=ico[:-1])
# Apple touch icon stays a full square: iOS rounds it itself, and transparent
# corners would show as black on the home screen.
sq.resize((180, 180), Image.LANCZOS).save(os.path.join(brand, 'apple-touch-icon.png'), optimize=True)
print('icons written')
