#!/usr/bin/env python3
"""Regenerates the favicon set from tools/source/ic_launcher_clickt.png (needs Pillow)."""
from PIL import Image, ImageChops
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
sq.resize((32, 32), Image.LANCZOS).save(os.path.join(brand, 'favicon-32.png'), optimize=True)
sq.resize((180, 180), Image.LANCZOS).save(os.path.join(brand, 'apple-touch-icon.png'), optimize=True)
sq.resize((512, 512), Image.LANCZOS).save(os.path.join(brand, 'icon-512.png'), optimize=True)
sq.resize((256, 256), Image.LANCZOS).save(os.path.join(root, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('icons written')
