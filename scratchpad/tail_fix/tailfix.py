import cv2, numpy as np, sys, os

def bag_mask(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (85, 50, 30), (130, 255, 255))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    m = (lab == big).astype(np.uint8) * 255
    # add the very dark rim pixels (underside edge) that touch the blue mask
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark = (gray < 110).astype(np.uint8) * 255
    ring = cv2.dilate(m, np.ones((9, 9), np.uint8))
    m = cv2.bitwise_or(m, cv2.bitwise_and(dark, ring))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    return m

def run(path, out, r=120, roi=(0, 1024, 900, 2048), fill_in=70, fill_out=120,
        rim_px=8, rim_dark=0.90, dbg=True):
    img = cv2.imread(path)
    H, W = img.shape[:2]
    bag = bag_mask(img)
    x0, y0, x1, y1 = roi
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    opened = cv2.morphologyEx(bag, cv2.MORPH_OPEN, k)
    removed = cv2.bitwise_and(bag, cv2.bitwise_not(opened))
    roi_m = np.zeros_like(bag); roi_m[y0:y1, x0:x1] = 255
    removed = cv2.bitwise_and(removed, roi_m)
    n, lab, stats, cents = cv2.connectedComponentsWithStats(removed)
    if n <= 1:
        print('nothing removed'); return
    by, bx = np.where(bag[H // 2:, :] > 0); by = by + H // 2
    i = int(np.argmin(bx)); tip = (bx[i], by[i])
    d = [np.hypot(cents[j][0] - tip[0], cents[j][1] - tip[1]) for j in range(1, n)]
    lab_tip = lab[tip[1], tip[0]]
    big = lab_tip if lab_tip > 0 else 1 + int(np.argmin(d))
    removed = (lab == big).astype(np.uint8) * 255
    # smooth the removed region edges a bit (avoid jaggy slivers)
    removed = cv2.morphologyEx(removed, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    ys, xs = np.where(removed > 0)
    print(f'{os.path.basename(path)} r={r} tip={tip} removed area={len(xs)} bbox x[{xs.min()},{xs.max()}] y[{ys.min()},{ys.max()}]')
    newbag = cv2.bitwise_and(bag, cv2.bitwise_not(removed))
    # smooth the new contour near the cut (remove staircase), leave the rest untouched
    dist_rm0 = cv2.distanceTransform(cv2.bitwise_not(removed), cv2.DIST_L2, 5)
    sm = (cv2.GaussianBlur(newbag, (0, 0), 5) > 127).astype(np.uint8) * 255
    zone = (dist_rm0 < 70)
    newbag = np.where(zone, sm, newbag).astype(np.uint8)
    removed = cv2.bitwise_or(removed, cv2.bitwise_and(bag, cv2.bitwise_not(newbag)))
    ys, xs = np.where(removed > 0)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    bglike = ((hsv[:, :, 1] < 40) & (gray > 150)).astype(np.uint8) * 255

    dist_rm = cv2.distanceTransform(cv2.bitwise_not(removed), cv2.DIST_L2, 5)
    # work window
    wx0, wy0 = max(0, xs.min() - 350), max(0, ys.min() - 350)
    wx1, wy1 = min(W, xs.max() + 450), min(H, ys.max() + 350)
    sl = (slice(wy0, wy1), slice(wx0, wx1))

    # ---- background estimate by normalized convolution from clean background ----
    bag_d = cv2.dilate(bag, np.ones((21, 21), np.uint8))
    src = ((bglike > 0) & (bag_d == 0) & (dist_rm >= fill_out + 10)).astype(np.float32)
    srcw = src[sl]; imw = img[sl].astype(np.float32)
    num = cv2.GaussianBlur(imw * srcw[:, :, None], (0, 0), 45)
    den = cv2.GaussianBlur(srcw, (0, 0), 45)
    est = num / np.maximum(den, 1e-4)[:, :, None]
    # where den is too small, fall back to row-wise left sample
    bad = den < 0.02
    if bad.any():
        for yy_ in np.unique(np.where(bad)[0]):
            row_ok = np.where(den[yy_] >= 0.05)[0]
            if len(row_ok):
                est[yy_, bad[yy_]] = est[yy_, row_ok[0]]
    fill = img.astype(np.float32); fill[sl] = est

    # ---- shadow model fitted from undisturbed columns right of the tail ----
    cols = np.arange(xs.max() + 80, min(W, xs.max() + 420), 3)
    dys = np.arange(12, 160, 4); prof = []; yb_list = []
    g2 = cv2.GaussianBlur(img, (0, 0), 2).mean(axis=2)
    for cx in cols:
        col = np.where(newbag[:, cx] > 0)[0]
        if len(col) == 0: continue
        yb = col.max()
        if yb + 170 >= H: continue
        base = g2[yb + 150:yb + 170, cx].mean()
        prof.append([g2[yb + dy, cx] / base for dy in dys]); yb_list.append(yb)
    if prof:
        dark = np.clip(1 - np.median(np.array(prof), axis=0), 0, 1)
        A = np.stack([np.exp(-dys / 18.0), np.exp(-dys / 90.0)], axis=1)
        (a1, a2), *_ = np.linalg.lstsq(A, dark, rcond=None)
        a1, a2 = float(np.clip(a1, 0, 0.2)), float(np.clip(a2, 0, 0.06))
        y_floor = int(np.median(yb_list))
    else:
        a1, a2, y_floor = 0.08, 0.025, int(ys.max())
    print(f'  shadow fit: a1={a1:.3f} (s=18) a2={a2:.3f} (s=90) y_floor={y_floor}')
    dist_nb = cv2.distanceTransform(cv2.bitwise_not(newbag), cv2.DIST_L2, 5)
    yy = np.arange(H)[:, None].astype(np.float32)
    wy = np.clip((yy - (y_floor - 70)) / 70.0, 0, 1)
    shade = (a1 * np.exp(-dist_nb / 18.0) + a2 * np.exp(-dist_nb / 90.0)) * wy
    shade = cv2.GaussianBlur(shade.astype(np.float32), (0, 0), 6)
    fill = fill * (1 - shade[:, :, None])

    # ---- blend: replace only the background 'owned' by the old tail (closer to removed than to newbag) ----
    m_ = 25.0
    Fw = np.clip((dist_nb - dist_rm + m_) / (2 * m_), 0, 1).astype(np.float32)
    Fw = Fw * np.clip((fill_out + 60 - dist_rm) / 40.0, 0, 1).astype(np.float32)  # hard outer limit
    Fw = np.maximum(Fw, (removed > 0).astype(np.float32))
    Fw = cv2.GaussianBlur(Fw, (0, 0), 3)
    Fw = np.maximum(Fw, (cv2.dilate(removed, np.ones((9, 9), np.uint8)) > 0).astype(np.float32))
    alpha_bag = cv2.GaussianBlur(newbag, (0, 0), 1.2).astype(np.float32) / 255.0
    Fw = Fw * (1 - alpha_bag)
    res = img.astype(np.float32) * (1 - Fw[:, :, None]) + fill * Fw[:, :, None]

    # ---- mild rim darkening along the new edge only ----
    dist_in = cv2.distanceTransform(newbag, cv2.DIST_L2, 5)
    near = np.clip((40 - dist_rm) / 20.0, 0, 1).astype(np.float32)
    rim = np.clip(1 - dist_in / rim_px, 0, 1).astype(np.float32) * near * (newbag > 0)
    rim = cv2.GaussianBlur(rim, (0, 0), 1.5)
    res = res * (1 - rim[:, :, None] * (1 - rim_dark))

    res = np.clip(res, 0, 255).astype(np.uint8)
    cv2.imwrite(out, res)
    if dbg:
        bx0, by0 = max(0, xs.min() - 250), max(0, ys.min() - 250)
        bx1, by1 = min(W, xs.max() + 450), min(H, ys.max() + 200)
        a_ = img[by0:by1, bx0:bx1]; b_ = res[by0:by1, bx0:bx1]
        ov = img.copy(); ov[removed > 0] = (0, 0, 255)
        ov[(Fw > 0.5) & (removed == 0)] = (0, 255, 255)
        c_ = cv2.addWeighted(img, 0.6, ov, 0.4, 0)[by0:by1, bx0:bx1]
        cv2.imwrite(out.replace('.png', '_cmp.png'), np.hstack([a_, c_, b_]))

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    r = int(sys.argv[3]) if len(sys.argv) > 3 else 120
    run(src, dst, r=r)
