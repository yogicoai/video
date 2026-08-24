import cv2, numpy as np, sys

def main(base_p, ai_p, out_p, cx, cy, r, feather=70):
    base = cv2.imread(base_p); ai = cv2.imread(ai_p)
    H, W = base.shape[:2]
    if ai.shape[:2] != (H, W):
        ai = cv2.resize(ai, (W, H), interpolation=cv2.INTER_LANCZOS4)
    g1 = cv2.cvtColor(base, cv2.COLOR_BGR2GRAY).astype(np.float32)
    g2 = cv2.cvtColor(ai, cv2.COLOR_BGR2GRAY).astype(np.float32)
    # global shift estimate on the central region (person/bag), Hanning window
    c = (slice(H // 4, 3 * H // 4), slice(W // 4, 3 * W // 4))
    win = cv2.createHanningWindow((c[1].stop - c[1].start, c[0].stop - c[0].start), cv2.CV_32F)
    (dx, dy), resp = cv2.phaseCorrelate(g1[c], g2[c], win)
    print(f'phaseCorrelate shift=({dx:.2f},{dy:.2f}) resp={resp:.3f}')
    if abs(dx) > 0.3 or abs(dy) > 0.3:
        M = np.float32([[1, 0, -dx], [0, 1, -dy]])
        ai = cv2.warpAffine(ai, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        g2 = cv2.cvtColor(ai, cv2.COLOR_BGR2GRAY).astype(np.float32)
    # corner mask
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    w = np.clip((r + feather - d) / feather, 0, 1).astype(np.float32)
    # diagnostics: diff outside the mask and in the boundary ring
    diff = np.abs(g1 - g2)
    outside = diff[w == 0].mean()
    ring = diff[(d > r) & (d < r + feather)].mean()
    inside = diff[d < r].mean()
    print(f'mean|diff| outside={outside:.2f} ring={ring:.2f} inside={inside:.2f}')
    out = base.astype(np.float32) * (1 - w[:, :, None]) + ai.astype(np.float32) * w[:, :, None]
    out = np.clip(out, 0, 255).astype(np.uint8)
    cv2.imwrite(out_p, out)
    # diag: base corner | ai corner | composite corner (2x)
    x0, y0 = max(0, cx - r - 80), max(0, cy - r - 80); x1, y1 = min(W, cx + r + 80), min(H, cy + r + 80)
    tiles = [im[y0:y1, x0:x1] for im in (base, ai, out)]
    tiles = [cv2.resize(t, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC) for t in tiles]
    cv2.imwrite(out_p.replace('.png', '_diag.png'), np.hstack(tiles))

if __name__ == '__main__':
    base_p, ai_p, out_p = sys.argv[1:4]
    cx, cy, r = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
    main(base_p, ai_p, out_p, cx, cy, r)
