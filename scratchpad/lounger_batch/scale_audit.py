"""scale_audit.py — bag-vs-face size ratio check.
usage: python scale_audit.py <color_key> <image.png> [...]
color_key: pastelblue | freshmint | olive
Prints bag bbox (px), face bbox (px), ratios bagH/faceH and bagW/faceW.
Expectation (real Lounger 60h x 65w cm; adult face ~17cm tall, 12y child ~15.5cm, 6-7y child ~14cm):
  bagH/faceH  adult ~3.5  |  KB(150cm) ~3.9  |  KA(120cm) ~4.3   (camera tilt changes absolute numbers; compare cuts)
"""
import cv2, numpy as np, sys, os

HSV_RANGE = {
    'pastelblue': ((90, 25, 120), (115, 140, 255)),
    'freshmint':  ((75, 25, 120), (100, 140, 255)),
    'olive':      ((28, 90, 60),  (50, 255, 230)),
}

def bag_bbox(img, key):
    lo, hi = HSV_RANGE[key]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, lo, hi)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if n <= 1: return None, m
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    x, y, w, h, a = stats[big]
    return (int(x), int(y), int(w), int(h), int(a)), (lab == big).astype(np.uint8) * 255

def face_bbox(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    casc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = casc.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(80, 80))
    if len(faces) == 0:
        casc2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
        faces = casc2.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(80, 80))
    if len(faces) == 0: return None
    # take the largest
    f = max(faces, key=lambda r: r[2] * r[3])
    return tuple(int(v) for v in f)

def main():
    key = sys.argv[1]
    for p in sys.argv[2:]:
        img = cv2.imread(p)
        if img is None: print(p, 'unreadable'); continue
        bb, mask = bag_bbox(img, key)
        fb = face_bbox(img)
        name = os.path.basename(p)
        if bb is None or fb is None:
            print(f'{name}: bag={bb} face={fb} (detection failed)'); continue
        bx, by, bw, bh, ba = bb; fx, fy, fw, fh = fb
        print(f'{name}: bag w={bw} h={bh} area={ba} | face w={fw} h={fh} @({fx},{fy}) | bagH/faceH={bh/fh:.2f} bagW/faceW={bw/fw:.2f}')
        # debug overlay
        dbg = img.copy()
        cv2.rectangle(dbg, (bx, by), (bx + bw, by + bh), (0, 0, 255), 6)
        cv2.rectangle(dbg, (fx, fy), (fx + fw, fy + fh), (0, 255, 0), 6)
        cv2.imwrite(os.path.splitext(p)[0] + '_audit.jpg', cv2.resize(dbg, (800, 800), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 80])

if __name__ == '__main__':
    main()
