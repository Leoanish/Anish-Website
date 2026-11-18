"""Render the illustrations for the Tools section: FieldRank, GeoSampler, Root Cause, LiDAR.

Each is drawn from scratch (no photos), sized 1600x1100, and keeps its key content in the
middle so the panel can crop the edges. Run:  python3 scripts/make_tool_images.py dist/assets/tools
"""
import math, random, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1600, 1100
FONT_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FONT_SEMI = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"


def font(size, bold=True):
    try:
        return ImageFont.truetype(FONT_BOLD if bold else FONT_SEMI, size)
    except OSError:
        return ImageFont.load_default()


def noise(rng, h, w, scale, octaves=4):
    out = np.zeros((h, w)); amp = 1.0; total = 0
    for o in range(octaves):
        s = max(2, int(scale / 2 ** o))
        small = rng.random((h // s + 2, w // s + 2))
        up = np.array(Image.fromarray((small * 255).astype(np.uint8)).resize((w + s, h + s), Image.BICUBIC))[:h, :w] / 255
        out += up * amp; total += amp; amp *= .5
    return out / total


# ---------------------------------------------------------------- satellite farmland
CROPS = {
    "vigorous": [(46, 92, 40), (58, 108, 46)],
    "good": [(76, 118, 52), (90, 128, 60)],
    "fair": [(120, 138, 70), (136, 146, 82)],
    "poor": [(156, 146, 96), (168, 152, 104)],
    "soil": [(150, 118, 86), (138, 106, 76)],
    "stubble": [(186, 168, 120), (174, 156, 110)],
}


def make_fields(rng, cols=5, rows=4, jitter=46, margin=-60):
    """A jittered grid of quadrilateral fields with a road network between them."""
    xs = np.linspace(margin, W - margin, cols + 1)
    ys = np.linspace(margin, H - margin, rows + 1)
    P = np.zeros((rows + 1, cols + 1, 2))
    for j in range(rows + 1):
        for i in range(cols + 1):
            jx = 0 if i in (0, cols) else rng.uniform(-jitter, jitter)
            jy = 0 if j in (0, rows) else rng.uniform(-jitter, jitter)
            P[j, i] = (xs[i] + jx + (j - rows / 2) * 14, ys[j] + jy)
    fields = []
    for j in range(rows):
        for i in range(cols):
            quad = [tuple(P[j, i]), tuple(P[j, i + 1]), tuple(P[j + 1, i + 1]), tuple(P[j + 1, i])]
            fields.append({"poly": quad, "i": i, "j": j})
    return fields


def shrink(poly, d):
    cx = sum(p[0] for p in poly) / len(poly); cy = sum(p[1] for p in poly) / len(poly)
    out = []
    for x, y in poly:
        vx, vy = x - cx, y - cy; L = math.hypot(vx, vy) or 1
        out.append((x - vx / L * d, y - vy / L * d))
    return out


def centroid(poly):
    return sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly)


def render_farmland(rng, fields, classes, row_angle=None):
    base_noise = noise(rng, H, W, 300)
    img = np.zeros((H, W, 3))
    img[:] = np.array([96, 104, 70])[None, None, :] * (0.85 + .3 * base_noise[..., None])   # hedges, verges
    canvas = Image.fromarray(img.clip(0, 255).astype(np.uint8))
    yy, xx = np.mgrid[0:H, 0:W]
    fine = noise(rng, H, W, 26, 3)
    patch = noise(rng, H, W, 140, 3)
    out = np.array(canvas).astype(float)
    for f, cls in zip(fields, classes):
        poly = shrink(f["poly"], 9)
        mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).polygon(poly, fill=255)
        m = np.array(mask) > 0
        c1, c2 = (np.array(c, float) for c in CROPS[cls])
        ang = row_angle if row_angle is not None else rng.choice([0, math.pi / 2]) + rng.uniform(-.25, .25)
        rows = 0.5 + 0.5 * np.sin((xx * math.cos(ang) + yy * math.sin(ang)) / 1.6)
        tone = c1 * (1 - patch[..., None]) + c2 * patch[..., None]
        tone = tone * (0.94 + 0.07 * rows[..., None]) * (0.9 + 0.18 * fine[..., None])
        out[m] = tone[m]
    for f, cls in zip(fields, classes):          # a few centre-pivot circles
        if f.get("pivot"):
            cx, cy = centroid(f["poly"]); r = f["pivot"]
            circ = (xx - cx) ** 2 + (yy - cy) ** 2 < r * r
            ang = np.arctan2(yy - cy, xx - cx)
            ring = 0.5 + 0.5 * np.sin(np.hypot(xx - cx, yy - cy) / 2.2)
            green = np.array([64, 116, 48], float) * (0.9 + .1 * ring[..., None]) * (0.86 + .22 * patch[..., None])
            wedge = (ang > .4) & (ang < 1.6)
            green[wedge] = np.array([150, 136, 92]) * (0.9 + .1 * ring[wedge][:, None])
            out[circ] = green[circ]
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    # tree clumps along a few edges
    edges = [(f["poly"][e], f["poly"][(e + 1) % 4]) for f in fields for e in range(4)]
    hedges = [edges[k] for k in rng.choice(len(edges), size=max(1, len(edges) // 5), replace=False)]
    for a, b in hedges:                      # tree lines along some field edges
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        for t in np.linspace(0, 1, max(2, int(L / 9))):
            if rng.random() < .25:
                continue
            x, y = a[0] + (b[0] - a[0]) * t + rng.normal(0, 2), a[1] + (b[1] - a[1]) * t + rng.normal(0, 2)
            r = rng.uniform(4, 8)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(30, 56, 30, 225))
            d.ellipse([x - r * .6 - 1, y - r * .6 - 1, x + r * .3, y + r * .3], fill=(56, 88, 48, 170))
    for _ in range(0):
        r = 0
        d.ellipse([x - r, y - r, x + r, y + r], fill=(34, 62, 34, 210))
        d.ellipse([x - r * .55 - 2, y - r * .55 - 2, x + r * .35, y + r * .35], fill=(58, 92, 50, 160))
    # a road
    pts = [(-20, H * .62), (W * .3, H * .58), (W * .62, H * .66), (W + 20, H * .6)]
    d.line(pts, fill=(196, 188, 170, 255), width=9, joint="curve")
    img = img.filter(ImageFilter.GaussianBlur(.6)).filter(ImageFilter.UnsharpMask(1.5, 70, 2))
    return img


def vignette(img, k=.22):
    a = np.array(img).astype(float); yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - k * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    return Image.fromarray((a * v[..., None]).clip(0, 255).astype(np.uint8))


# ---------------------------------------------------------------- FieldRank
def fieldrank(path):
    rng = np.random.default_rng(11); random.seed(11)
    fields = make_fields(rng, cols=7, rows=5, jitter=30, margin=-30)
    pal = ["good", "vigorous", "fair", "good", "poor", "soil", "stubble", "good", "fair", "vigorous"]
    classes = [pal[k] for k in rng.integers(0, len(pal), len(fields))]
    # pick the ranked fields close to the centre so the panel never crops them
    dist = sorted(range(len(fields)), key=lambda k: math.hypot(centroid(fields[k]["poly"])[0] - W / 2, (centroid(fields[k]["poly"])[1] - H / 2) * 1.35))
    mine = dist[0]
    ranked_ids = [k for k in dist[1:9] if k != mine][:5]
    for k, cls in zip(ranked_ids, ["vigorous", "vigorous", "good", "good", "good"]):
        classes[k] = cls
    classes[mine] = "fair"
    for k in (dist[11], dist[15]):                 # two centre pivots in the surroundings
        fields[k]["pivot"] = 92
    img = vignette(render_farmland(rng, fields, classes), .28)
    d = ImageDraw.Draw(img, "RGBA")
    rank_of = {k: r for r, k in enumerate(ranked_ids[:3], 1)}
    rank_of[mine] = 4
    for k, f in enumerate(fields):
        poly = shrink(f["poly"], 9)
        if k not in rank_of:
            d.polygon(poly, fill=(6, 20, 16, 95))
            d.line(poly + [poly[0]], fill=(255, 255, 255, 90), width=2)
    for k in rank_of:
        poly = shrink(fields[k]["poly"], 9)
        d.line(poly + [poly[0]], fill=(214, 255, 107, 255) if k == mine else (255, 255, 255, 240), width=5 if k == mine else 3)
    medal = {1: (247, 201, 72), 2: (220, 226, 232), 3: (222, 150, 92)}
    for k, rank in rank_of.items():
        cx, cy = centroid(fields[k]["poly"])
        if k == mine:
            label = "Your field  #4 of 12"
            f_ = font(27); tw = d.textlength(label, font=f_)
            d.rounded_rectangle([cx - tw / 2 - 20, cy - 27, cx + tw / 2 + 20, cy + 27], 27, fill=(7, 27, 24, 235), outline=(214, 255, 107, 255), width=3)
            d.text((cx, cy), label, font=f_, fill=(214, 255, 107, 255), anchor="mm")
            continue
        r = 36
        d.ellipse([cx - r + 3, cy - r + 6, cx + r + 3, cy + r + 6], fill=(0, 0, 0, 95))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=medal[rank] + (255,), outline=(7, 27, 24, 255), width=3)
        sfx = {1: "st", 2: "nd", 3: "rd"}[rank]
        d.text((cx - 6, cy + 2), str(rank), font=font(36), fill=(7, 27, 24, 255), anchor="mm")
        d.text((cx + 14, cy - 6), sfx, font=font(15), fill=(7, 27, 24, 255), anchor="mm")
    img.convert("RGB").save(path, "JPEG", quality=84, optimize=True, progressive=True)


# ---------------------------------------------------------------- GeoSampler
def geosampler(path):
    rng = np.random.default_rng(5); random.seed(5)
    fields = make_fields(rng, cols=5, rows=3, jitter=30, margin=-260)
    classes = ["fair", "good", "stubble", "good", "soil", "good", "good", "fair", "good", "vigorous", "fair", "good", "good", "soil", "fair"]
    img = vignette(render_farmland(rng, fields, classes, row_angle=.08), .2)
    target = min(range(len(fields)), key=lambda k: math.hypot(centroid(fields[k]["poly"])[0] - W / 2, (centroid(fields[k]["poly"])[1] - H / 2) * 1.2))
    poly = shrink(fields[target]["poly"], 9)
    # zones inside the target field from a smooth "NDVI" surface
    z = noise(rng, H, W, 240, 3)
    mask0 = Image.new("L", (W, H), 0); ImageDraw.Draw(mask0).polygon(poly, fill=255)
    q = np.quantile(z[np.array(mask0) > 0], [.33, .66])
    zone = np.digitize(z, q)
    zone_cols = np.array([[228, 90, 60], [240, 200, 70], [70, 170, 90]], float)
    mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).polygon(poly, fill=255); m = np.array(mask) > 0
    a = np.array(img).astype(float)
    a[m] = a[m] * .45 + zone_cols[zone[m]] * .55
    img = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    for k, f in enumerate(fields):
        if k != target:
            d.polygon(shrink(f["poly"], 9), fill=(6, 20, 16, 95))
    d.line(poly + [poly[0]], fill=(255, 255, 255, 255), width=5)
    # sample points spread across zones (simple stratified pick)
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    pts = []
    tries = 0
    while len(pts) < 14 and tries < 5000:
        tries += 1
        x, y = rng.uniform(min(xs), max(xs)), rng.uniform(min(ys), max(ys))
        if not m[int(y), int(x)] or not m[int(min(H - 1, y + 25)), int(x)] or not m[int(max(0, y - 25)), int(x)]:
            continue
        if any(math.hypot(x - px, y - py) < 95 for px, py in pts):
            continue
        pts.append((x, y))
    for n, (x, y) in enumerate(pts, 1):
        d.ellipse([x - 21, y - 21 + 4, x + 21, y + 21 + 4], fill=(0, 0, 0, 90))
        d.ellipse([x - 21, y - 21, x + 21, y + 21], fill=(255, 255, 255, 255), outline=(7, 27, 24, 255), width=3)
        d.text((x, y + 1), str(n), font=font(20), fill=(7, 27, 24, 255), anchor="mm")
    img.convert("RGB").save(path, "JPEG", quality=84, optimize=True, progressive=True)


# ---------------------------------------------------------------- Root Cause
def rootcause(path):
    rng = np.random.default_rng(21); random.seed(21)
    fields = make_fields(rng, cols=5, rows=3, jitter=34, margin=-260)
    classes = ["good", "fair", "good", "vigorous", "good", "good", "fair", "good", "stubble", "good", "vigorous", "fair", "good", "fair", "soil"]
    img = vignette(render_farmland(rng, fields, classes, row_angle=1.57), .2)
    target = min(range(len(fields)), key=lambda k: math.hypot(centroid(fields[k]["poly"])[0] - W / 2, (centroid(fields[k]["poly"])[1] - H / 2) * 1.2))
    poly = shrink(fields[target]["poly"], 9)
    mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).polygon(poly, fill=255); m = np.array(mask) > 0
    z = noise(rng, H, W, 260, 3)
    edges = np.quantile(z[m], [.2, .4, .6, .8])
    rates = [120, 140, 160, 180, 200]
    ramp = np.array([[250, 236, 160], [244, 196, 92], [226, 140, 56], [196, 84, 40], [140, 44, 34]], float)
    a = np.array(img).astype(float)
    cell = 44
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    for y0 in range(int(min(ys)), int(max(ys)), cell):
        for x0 in range(int(min(xs)), int(max(xs)), cell):
            sub = m[y0:y0 + cell, x0:x0 + cell]
            if sub.size == 0 or sub.mean() < .3:
                continue
            k = int(np.digitize(z[min(H - 1, y0 + cell // 2), min(W - 1, x0 + cell // 2)], edges))
            region = a[y0:y0 + cell, x0:x0 + cell]
            region[sub] = region[sub] * .25 + ramp[k] * .75
            a[y0:y0 + cell, x0:x0 + cell] = region
    img = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    for k, f in enumerate(fields):
        if k != target:
            d.polygon(shrink(f["poly"], 9), fill=(6, 20, 16, 95))
    # grid lines over the prescription
    for y0 in range(int(min(ys)), int(max(ys)), cell):
        for x0 in range(int(min(xs)), int(max(xs)), cell):
            if m[min(H - 1, y0 + cell // 2), min(W - 1, x0 + cell // 2)]:
                d.rectangle([x0, y0, x0 + cell, y0 + cell], outline=(255, 255, 255, 60), width=1)
    d.line(poly + [poly[0]], fill=(255, 255, 255, 255), width=5)
    # map pin
    cx, cy = centroid(poly); cy -= 30
    d.ellipse([cx - 16, cy + 62, cx + 16, cy + 72], fill=(0, 0, 0, 110))
    d.polygon([(cx - 26, cy - 8), (cx + 26, cy - 8), (cx, cy + 66)], fill=(7, 27, 24, 255))
    d.ellipse([cx - 32, cy - 64, cx + 32, cy], fill=(7, 27, 24, 255))
    d.ellipse([cx - 13, cy - 45, cx + 13, cy - 19], fill=(214, 255, 107, 255))
    # rate legend, kept inside the centre band
    lx, ly = W / 2 - 300, H - 230
    d.rounded_rectangle([lx, ly, lx + 600, ly + 104], 20, fill=(7, 27, 24, 225))
    d.text((lx + 24, ly + 20), "Nitrogen rate, lb N/acre", font=font(22, False), fill=(244, 242, 234, 255))
    for k, r in enumerate(rates):
        x = lx + 24 + k * 112
        d.rectangle([x, ly + 56, x + 100, ly + 82], fill=tuple(int(c) for c in ramp[k]) + (255,))
        d.text((x + 50, ly + 69), str(r), font=font(18), fill=(7, 27, 24, 255) if k < 3 else (255, 255, 255, 255), anchor="mm")
    img.convert("RGB").save(path, "JPEG", quality=84, optimize=True, progressive=True)


# ---------------------------------------------------------------- LiDAR point cloud
def lidar(path):
    rng = np.random.default_rng(3)
    pts = []
    # ground
    n = 90000
    gx = rng.uniform(-8, 8, n); gy = rng.uniform(0, 26, n)
    gz = .15 * np.sin(gx / 2.5) + .1 * np.sin(gy / 3.1) + rng.normal(0, .015, n)
    pts.append(np.c_[gx, gy, gz, np.zeros(n)])
    # cotton rows (0.97 m apart) with bushy plants
    for row in np.arange(-7.5, 8, .97):
        for y in np.arange(0, 26, .16):
            h = .95 + .25 * math.sin(y / 2.2 + row) + rng.normal(0, .06)
            k = 70
            r = rng.uniform(0, .38, k) * np.sqrt(rng.uniform(0, 1, k))
            th = rng.uniform(0, 2 * math.pi, k)
            z = rng.uniform(.05, 1, k) ** .55 * h
            width = .38 * np.sin(np.clip(z / h, 0, 1) * math.pi) ** .6
            x = row + np.cos(th) * width * rng.uniform(.4, 1, k)
            yy = y + np.sin(th) * width * rng.uniform(.4, 1, k) * .6
            base = .15 * np.sin(row / 2.5) + .1 * np.sin(y / 3.1)
            pts.append(np.c_[x, yy, z + base, z / 1.2])
    P = np.vstack(pts)
    # camera
    cam = np.array([0, -6.5, 6.2]); look = np.array([0, 9, 0])
    fwd = look - cam; fwd /= np.linalg.norm(fwd)
    right = np.cross(fwd, [0, 0, 1]); right /= np.linalg.norm(right)
    up = np.cross(right, fwd)
    rel = P[:, :3] - cam
    zc = rel @ fwd; xc = rel @ right; yc = rel @ up
    keep = zc > .5
    f = 1150
    sx = W / 2 + f * xc[keep] / zc[keep]; sy = H * .46 - f * yc[keep] / zc[keep]
    hgt = P[keep, 3]; depth = zc[keep]
    order = np.argsort(-depth)
    sx, sy, hgt, depth = sx[order], sy[order], hgt[order], depth[order]
    stops = np.array([[52, 58, 120], [36, 130, 170], [60, 190, 120], [214, 238, 90], [250, 170, 60]], float)
    t = np.clip(hgt, 0, 1) * (len(stops) - 1)
    i0 = np.floor(t).astype(int).clip(0, len(stops) - 2); fr = (t - i0)[:, None]
    col = stops[i0] * (1 - fr) + stops[i0 + 1] * fr
    ground = hgt == 0
    col[ground] = np.array([92, 74, 58]) * (0.8 + 0.4 * rng.random((ground.sum(), 1)))
    fade = np.clip(1.25 - depth / 30, .35, 1)[:, None]
    col = col * fade
    img = np.zeros((H, W, 3)); img[:] = (6, 18, 16)
    size = np.clip(3.4 - depth / 9, 1, 3).astype(int)
    ok = (sx >= 0) & (sx < W - 3) & (sy >= 0) & (sy < H - 3)
    for s in (1, 2, 3):
        sel = ok & (size == s)
        xi = sx[sel].astype(int); yi = sy[sel].astype(int); c = col[sel]
        for dx in range(s):
            for dy in range(s):
                img[yi + dy, xi + dx] = c
    out = Image.fromarray(img.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.35))
    d = ImageDraw.Draw(out, "RGBA")
    # height scale bar
    lx, ly = W / 2 - 250, H - 120
    for k in range(200):
        t = k / 199 * (len(stops) - 1); i = min(int(t), len(stops) - 2); fr_ = t - i
        c = stops[i] * (1 - fr_) + stops[i + 1] * fr_
        d.line([(lx + k * 2.5, ly), (lx + k * 2.5, ly + 16)], fill=tuple(int(v) for v in c) + (255,), width=3)
    d.text((lx - 16, ly + 8), "0 m", font=font(20, False), fill=(220, 228, 222, 255), anchor="rm")
    d.text((lx + 516, ly + 8), "1.2 m canopy height", font=font(20, False), fill=(220, 228, 222, 255), anchor="lm")
    out.save(path, "JPEG", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "dist/assets/tools")
    out.mkdir(parents=True, exist_ok=True)
    which = sys.argv[2:] or ["fieldrank", "geosampler", "rootcause", "lidar"]
    for name in which:
        globals()[name](out / f"{name}.jpg")
        print("wrote", out / f"{name}.jpg")
