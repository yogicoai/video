"""finalize.py — copy workflow finals to cand_* names and build a labelled contact sheet.
usage: python finalize.py finals.json
finals.json = [{"cut_id":..., "file":"cand_lounger_...", "final_path":"...png", "verdict":"pass|fail", "label":"..."}]
"""
import cv2, numpy as np, json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
items = json.load(open(sys.argv[1], encoding='utf-8'))
final_dir = os.path.join(HERE, 'final'); os.makedirs(final_dir, exist_ok=True)
tiles = []
for it in items:
    src = it['final_path']
    if not os.path.exists(src):
        print('MISSING', it['cut_id'], src); continue
    dst = os.path.join(final_dir, it['file'] + '.png')
    shutil.copyfile(src, dst)
    im = cv2.imread(dst)
    if im is None:
        print('UNREADABLE', dst); continue
    print(it['cut_id'], im.shape, '->', dst)
    t = cv2.resize(im, (600, 600), interpolation=cv2.INTER_AREA)
    bar = np.full((44, 600, 3), 255, np.uint8)
    col = (0, 140, 0) if it.get('verdict') == 'pass' else (0, 0, 200)
    cv2.putText(bar, f"{it['cut_id']} [{it.get('verdict','?')}]", (8, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, col, 2)
    tiles.append(np.vstack([bar, t]))
cols = 4
rows = []
for i in range(0, len(tiles), cols):
    row = tiles[i:i + cols]
    while len(row) < cols:
        row.append(np.full_like(tiles[0], 255))
    rows.append(np.hstack(row))
sheet = np.vstack(rows)
cv2.imwrite(os.path.join(HERE, 'contact_sheet.png'), sheet)
print('sheet:', os.path.join(HERE, 'contact_sheet.png'), sheet.shape)
