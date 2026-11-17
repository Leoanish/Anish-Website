"""Render a top-down drone view of young crop plants on soil, then segment it
(Excess Green + Otsu, like the first step of a plant-pixel workflow) and show the
pixelated plant-only result on the right of a divider."""
import math, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

W, H = 1600, 1100
SS = 2                                  # supersampling for smooth leaf edges
rng = np.random.default_rng(7)
random.seed(7)

def noise(h, w, scale, octaves=4):
    out = np.zeros((h, w))
    amp, total = 1.0, 0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        small = rng.random((h // s + 2, w // s + 2))
        up = np.array(Image.fromarray((small * 255).astype(np.uint8)).resize((w + s, h + s), Image.BICUBIC))[:h, :w] / 255
        out += up * amp; total += amp; amp *= .5
    return out / total

# ---------- soil on raised beds
hS, wS = H * SS, W * SS
n1 = noise(hS, wS, 300); n2 = noise(hS, wS, 60); n3 = noise(hS, wS, 8, 2); n4 = rng.random((hS, wS))
xs = np.arange(wS)
ROW_SPACING = 0.235 * wS
rows_x = [int(0.13 * wS + i * ROW_SPACING) for i in range(5)]
bed = np.zeros(wS)
for rx in rows_x:
    bed += np.exp(-((xs - rx) / (0.07 * wS)) ** 2)
bed = np.clip(bed, 0, 1)
base = np.array([126, 94, 64], float)
soil = base[None, None, :] * (0.80 + 0.26 * n1[..., None]) * (0.92 + 0.14 * n2[..., None]) * (0.9 + 0.16 * n3[..., None]) * (0.95 + 0.08 * n4[..., None])
soil *= (0.86 + 0.20 * bed)[None, :, None]        # lighter, drier beds; darker furrows
img = Image.fromarray(np.clip(soil, 0, 255).astype(np.uint8))
d = ImageDraw.Draw(img, "RGBA")
for _ in range(9000):                               # fine grains and small clods
    x, y = random.uniform(0, wS), random.uniform(0, hS)
    r = random.choice([1, 1, 1.5, 2, 3, 4.5]) * SS
    t = random.choice([(170, 136, 100, 70), (88, 64, 44, 70), (150, 118, 84, 60)])
    d.ellipse([x - r, y - r * .75, x + r, y + r * .75], fill=t)
img = img.filter(ImageFilter.GaussianBlur(.8 * SS))

# ---------- plants: cotton-like seedlings with lobed leaves
def ellipse_pts(cx, cy, rx, ry, ang, n=40):
    ca, sa = math.cos(ang), math.sin(ang)
    return [(cx + rx * math.cos(t) * ca - ry * math.sin(t) * sa, cy + rx * math.cos(t) * sa + ry * math.sin(t) * ca)
            for t in np.linspace(0, 2 * math.pi, n)]

shadow = Image.new("L", (wS, hS), 0); sd = ImageDraw.Draw(shadow)
plants = Image.new("RGBA", (wS, hS), (0, 0, 0, 0)); pd = ImageDraw.Draw(plants)
greens = [(64, 118, 46), (76, 132, 52), (90, 146, 60), (56, 106, 42), (104, 156, 68)]
leaf_list = []
for rx in rows_x:
    y = random.uniform(-30, 50) * SS
    while y < hS + 80 * SS:
        size = random.uniform(84, 118) * SS
        cx = rx + random.uniform(-10, 10) * SS
        cy = y
        nleaf = random.randint(4, 6)
        base_ang = random.uniform(0, 2 * math.pi)
        for k in range(nleaf):
            ang = base_ang + k * 2 * math.pi / nleaf + random.uniform(-.3, .3)
            L = size * random.uniform(.55, .85)
            # leaf blade centre sits out along its petiole
            lx, ly = cx + math.cos(ang) * L * .55, cy + math.sin(ang) * L * .55
            leaf_list.append((L, lx, ly, ang, random.choice(greens), cx, cy))
        y += random.uniform(200, 250) * SS
for L, lx, ly, ang, g, cx, cy in leaf_list:
    for off in (-0.6, 0, 0.6):
        sd.polygon(ellipse_pts(lx + 8 * SS + math.cos(ang + off) * L * .18, ly + 10 * SS + math.sin(ang + off) * L * .18, L * .42, L * .24, ang + off), fill=160)
for L, lx, ly, ang, g, cx, cy in sorted(leaf_list, key=lambda v: v[0]):
    pd.line([(cx, cy), (lx, ly)], fill=tuple(int(c * .8) for c in g) + (255,), width=int(3 * SS))
    lobes = [(-0.62, .78), (0, 1.0), (0.62, .78)]
    for off, k in lobes:     # three lobes = a palmate cotton leaf
        ox, oy = lx + math.cos(ang + off) * L * .2 * k, ly + math.sin(ang + off) * L * .2 * k
        pd.polygon(ellipse_pts(ox, oy, L * .43 * k, L * .25 * k, ang + off), fill=g + (255,))
    lite = tuple(min(255, int(c * 1.16)) for c in g)
    for off, k in lobes:
        ox, oy = lx + math.cos(ang + off) * L * .24 * k, ly + math.sin(ang + off) * L * .24 * k
        pd.polygon(ellipse_pts(ox, oy, L * .26 * k, L * .13 * k, ang + off), fill=lite + (120,))
    for off, k in lobes:     # veins
        ex, ey = lx + math.cos(ang + off) * L * .58 * k, ly + math.sin(ang + off) * L * .58 * k
        pd.line([(lx, ly), (ex, ey)], fill=(176, 206, 132, 170), width=max(1, int(1.4 * SS)))
shadow = shadow.filter(ImageFilter.GaussianBlur(7 * SS))
dark = Image.new("RGB", (wS, hS), (44, 31, 20))
img = Image.composite(dark, img, shadow.point(lambda v: int(v * .5)))
# leaf texture
pa = np.array(plants).astype(float)
tex = noise(hS, wS, 18, 3)
pa[..., :3] *= (0.86 + 0.26 * tex[..., None])
plants = Image.fromarray(np.clip(pa, 0, 255).astype(np.uint8))
img = Image.alpha_composite(img.convert("RGBA"), plants).convert("RGB")
img = img.resize((W, H), Image.LANCZOS)
# drone-photo feel: slight vignette + sharpen
arr = np.array(img).astype(float)
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.22 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
arr *= vig[..., None]
photo = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(1.2, 60, 2))

# ---------- segmentation: Excess Green + Otsu
a = np.array(photo).astype(float); s = a.sum(2) + 1e-6
r, g, b = a[..., 0] / s, a[..., 1] / s, a[..., 2] / s
exg = 2 * g - r - b
hist, edges = np.histogram(exg, 256)
w0 = np.cumsum(hist); w1 = w0[-1] - w0
m = np.cumsum(hist * edges[:-1]); mt = m[-1]
between = (mt * w0 / w0[-1] - m) ** 2 / (w0 * w1 + 1e-9)
thr = edges[np.argmax(between)]
mask = exg > thr
cover = mask.mean() * 100

# ---------- compose
CELL = 18
split = int(W * 0.5)
out = np.array(photo).astype(float)
bg = np.array([14, 31, 27], float)
gy, gx = H // CELL + 1, W // CELL + 1
for j in range(gy):
    for i in range(gx):
        x0, y0 = i * CELL, j * CELL
        if x0 + CELL <= split: continue
        x1, y1 = min(W, x0 + CELL), min(H, y0 + CELL)
        xa = max(x0, split)
        frac = mask[y0:y1, x0:x1].mean()
        if frac >= 0.33:
            col = a[y0:y1, x0:x1][mask[y0:y1, x0:x1]].mean(0)
            col = col * 1.08 + np.array([4, 14, 0])
            out[y0:y1, xa:x1] = bg
            out[y0 + 1:y1 - 1, max(xa, x0 + 1):x1 - 1] = col
        else:
            out[y0:y1, xa:x1] = bg
            # faint grid on the empty soil cells
            out[y0, xa:x1] = bg + 12
            out[y0:y1, x0 if x0 >= split else xa] = bg + 12
outimg = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

# divider and labels
d = ImageDraw.Draw(outimg, "RGBA")
d.rectangle([split - 2, 0, split + 1, H], fill=(244, 242, 234, 255))
cy = H // 2
d.ellipse([split - 22, cy - 22, split + 22, cy + 22], fill=(244, 242, 234, 255))
d.polygon([(split - 12, cy), (split - 5, cy - 7), (split - 5, cy + 7)], fill=(7, 27, 24, 255))
d.polygon([(split + 12, cy), (split + 5, cy - 7), (split + 5, cy + 7)], fill=(7, 27, 24, 255))
# Labels are added by the web page (so they stay visible when the image is cropped).
dst = sys.argv[1] if len(sys.argv) > 1 else "/tmp/ppe.jpg"
outimg.save(dst, "JPEG", quality=84, optimize=True, progressive=True)
print("cover", round(cover, 1), "threshold", round(thr, 3))
