# -*- coding: utf-8 -*-
import json, io, os

path = r'C:\Users\Yogibo Design\Desktop\youtube\scratchpad\prods.json'
d = json.load(open(path, encoding='utf-8'))
prods = d.get('products', [])

kws = ['맥스','슬림','미디','미니','드롭','팟','라운저','피라미드','더블','서포트','냅','럭스','허기보']
seen = set()
rows = []
for p in prods:
    nm = p.get('name') or ''
    base = nm.split(' ')[0]
    sp = p.get('spec') or {}
    key = (base, sp.get('h'))
    if any(nm.startswith(k) for k in kws) and key not in seen and sp.get('h'):
        seen.add(key)
        rows.append((base, sp, p.get('scalePrompt') or ''))

rows.sort(key=lambda r: -float(r[1].get('h') or 0))
out = io.open(r'C:\Users\Yogibo Design\Desktop\youtube\scratchpad\size_map.txt', 'w', encoding='utf-8')
for base, sp, scp in rows:
    out.write(f"{base}\th={sp.get('h')}cm  w={sp.get('w')}  d={sp.get('d')}  kg={sp.get('weight')}\n")
    if scp:
        out.write(f"    scalePrompt: {scp}\n")
out.close()
print('done', len(rows))
