"""Keep the website's citation metrics and publication list in sync with Anish's Google Scholar profile.

Runs daily in GitHub Actions (see .github/workflows/pages.yml) and can be run by hand:
    python3 scripts/update_scholar.py

Sources, tried in order:
 1. Google Scholar through SerpApi, when the SERPAPI_KEY secret is set (Google blocks
    GitHub's servers from reading Scholar directly).
 2. Google Scholar directly (works from a home or campus network).
 3. OpenAlex, an open citation database, as a stand-in until 1 is set up. Only Anish's own
    papers are counted: his known DOIs plus new papers shared with his usual co-authors.

Writes dist/data/scholar.json (read by the website) and the metrics block in
dist/knowledge.md (read by the Ask Anish chat). If every source fails, nothing changes.
"""
import html, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

SCHOLAR_ID = "NixJyg0AAAAJ"
PROFILE = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en"
OPENALEX_AUTHOR = "A5019487038"
KNOWN_DOIS = {
    "10.1016/j.eja.2026.128090", "10.1016/j.compag.2025.111270", "10.3390/rs17091504",
    "10.1016/j.fcr.2025.109822", "10.26480/asm.01.2021.17.19", "10.26480/bda.01.2021.06.11",
}
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "data" / "scholar.json"
KNOWLEDGE = ROOT / "dist" / "knowledge.md"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"


def get(url, as_json=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=40) as r:
        body = r.read().decode("utf-8", "replace")
    return json.loads(body) if as_json else body


def h_index(counts):
    counts = sorted(counts, reverse=True)
    return sum(1 for i, c in enumerate(counts) if c >= i + 1)


def text(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def from_serpapi():
    key = os.environ.get("SERPAPI_KEY", "").strip()
    if not key:
        raise RuntimeError("SERPAPI_KEY not set")
    params = urllib.parse.urlencode({"engine": "google_scholar_author", "author_id": SCHOLAR_ID, "hl": "en", "num": 100, "api_key": key})
    data = get("https://serpapi.com/search.json?" + params, as_json=True)
    if data.get("error"):
        raise RuntimeError(data["error"])
    table = {}
    for row in (data.get("cited_by") or {}).get("table", []):
        for name, vals in row.items():
            since_key = next((k for k in vals if k.startswith("since")), None)
            table[name] = (vals.get("all", 0), vals.get(since_key, 0) if since_key else None, since_key.split("_")[-1] if since_key else None)
    pubs = [{
        "title": a.get("title", ""),
        "authors": a.get("authors", ""),
        "venue": a.get("publication", ""),
        "year": int(a["year"]) if str(a.get("year", "")).isdigit() else None,
        "cited_by": (a.get("cited_by") or {}).get("value") or 0,
        "link": a.get("link") or PROFILE,
    } for a in data.get("articles", [])]
    cit = table.get("citations", (sum(p["cited_by"] for p in pubs), None, None))
    return {
        "source": "Google Scholar",
        "citations": cit[0], "citations_recent": cit[1],
        "recent_since": int(cit[2]) if cit[2] and str(cit[2]).isdigit() else None,
        "h_index": table.get("h_index", (h_index([p["cited_by"] for p in pubs]),))[0],
        "i10_index": table.get("i10_index", (sum(1 for p in pubs if p["cited_by"] >= 10),))[0],
        "publications": pubs,
    }


def from_scholar_direct():
    page = get(PROFILE + "&cstart=0&pagesize=100")
    if "gsc_rsb_st" not in page:
        raise RuntimeError("profile page not returned (blocked)")
    table = re.search(r'<table id="gsc_rsb_st".*?</table>', page, re.S).group(0)
    stats = {}
    for row in re.findall(r"<tr>(.*?)</tr>", table, re.S):
        cells = [text(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S)]
        if len(cells) >= 3 and cells[0]:
            stats[cells[0].lower()] = (int(cells[1] or 0), int(cells[2] or 0))
    since = re.search(r"Since (\d{4})", table)
    pubs = []
    for row in re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, re.S):
        title = re.search(r'class="gsc_a_at"[^>]*>(.*?)</a>', row, re.S)
        if not title:
            continue
        href = re.search(r'href="(/citations\?view_op=view_citation[^"]+)"', row)
        grays = [text(g) for g in re.findall(r'<div class="gs_gray">(.*?)</div>', row, re.S)]
        cited = re.search(r'class="gsc_a_ac[^"]*"[^>]*>(\d*)<', row)
        year = re.search(r'class="gsc_a_h gsc_a_hc gs_ibl"[^>]*>(\d{4})<', row)
        pubs.append({
            "title": text(title.group(1)), "authors": grays[0] if grays else "", "venue": grays[1] if len(grays) > 1 else "",
            "year": int(year.group(1)) if year else None,
            "cited_by": int(cited.group(1)) if cited and cited.group(1) else 0,
            "link": "https://scholar.google.com" + html.unescape(href.group(1)) if href else PROFILE,
        })
    return {
        "source": "Google Scholar",
        "citations": stats["citations"][0], "citations_recent": stats["citations"][1],
        "recent_since": int(since.group(1)) if since else None,
        "h_index": stats.get("h-index", (0,))[0], "i10_index": stats.get("i10-index", (0,))[0],
        "publications": pubs,
    }


def from_openalex():
    select = "title,publication_year,cited_by_count,doi,primary_location,authorships"
    works = get(f"https://api.openalex.org/works?filter=author.id:{OPENALEX_AUTHOR}&per-page=100&select={select}", as_json=True)["results"]
    doi = lambda w: (w.get("doi") or "").replace("https://doi.org/", "").lower()
    known = [w for w in works if doi(w) in KNOWN_DOIS]
    if len(known) < 4:
        raise RuntimeError("OpenAlex returned too few known papers")
    me = f"https://openalex.org/{OPENALEX_AUTHOR}"
    coauthors = {a["author"]["id"] for w in known for a in w["authorships"]} - {me}
    mine = [w for w in works if doi(w) in KNOWN_DOIS or any(a["author"]["id"] in coauthors for a in w["authorships"])]
    pubs = [{
        "title": re.sub(r"\s+", " ", w.get("title") or "").strip(),
        "authors": ", ".join(a["author"]["display_name"] for a in w["authorships"]),
        "venue": ((w.get("primary_location") or {}).get("source") or {}).get("display_name") or "",
        "year": w.get("publication_year"),
        "cited_by": w.get("cited_by_count") or 0,
        "link": w.get("doi") or "",
    } for w in mine]
    counts = [p["cited_by"] for p in pubs]
    return {
        "source": "OpenAlex",
        "citations": sum(counts), "citations_recent": None, "recent_since": None,
        "h_index": h_index(counts), "i10_index": sum(1 for c in counts if c >= 10),
        "publications": pubs,
    }


CONFERENCE = re.compile(r"CANVAS|Annual Meeting|Conference|Symposium|Congress|Workshop", re.I)
NOT_JOURNAL = re.compile(r"Preprint|SSRN|arXiv|bioRxiv|Research ?Square|thesis|dissertation", re.I)


def classify(pub):
    venue = pub.get("venue") or ""
    if CONFERENCE.search(venue):
        return "presentation"
    if venue and not NOT_JOURNAL.search(venue) and re.search(r"\d", venue):
        return "journal"
    return "other"


def role(pub):
    first = (pub.get("authors") or "").split(",")[0].strip().lower()
    return "lead" if first.endswith("bhattarai") and first.startswith("a") else "co-author"


def update_knowledge(data):
    if not KNOWLEDGE.exists():
        return
    since = f" (since {data['recent_since']}: {data['citations_recent']})" if data.get("recent_since") else ""
    lines = [
        "<!-- scholar:start -->",
        f"## Citation metrics (from {data['source']}, updated {data['updated']})",
        f"- Total citations: {data['citations']}{since}; h-index {data['h_index']}; i10-index {data['i10_index']}.",
        f"- On the profile: {data['journal_count']} journal articles, {data['presentation_count']} conference presentations, {data['publication_count']} items in total. Google Scholar profile: {PROFILE}",
        f"- Role: lead (first) author on {data['lead_journal']} journal articles and {data['lead_presentation']} conference presentations; co-author on {data['journal_count'] - data['lead_journal']} journal articles and {data['presentation_count'] - data['lead_presentation']} presentations.",
        "- Citations per publication:",
    ]
    lines += [f"  - [{p['type']}, {'lead author' if p['role'] == 'lead' else 'co-author'}] {p['title']} ({p['venue'] or 'no venue listed'}, {p['year'] or 'n.d.'}; authors: {p['authors']}): cited {p['cited_by']} times" for p in data["publications"]]
    lines.append("<!-- scholar:end -->")
    block = "\n".join(lines)
    k = KNOWLEDGE.read_text(encoding="utf-8")
    if "<!-- scholar:start -->" in k:
        k = re.sub(r"<!-- scholar:start -->.*?<!-- scholar:end -->", lambda _: block, k, flags=re.S)
    else:
        k = k.replace("## Awards and honors", block + "\n\n## Awards and honors", 1)
    KNOWLEDGE.write_text(k, encoding="utf-8")


def main():
    data, errors = None, []
    for name, source in (("SerpApi", from_serpapi), ("Google Scholar", from_scholar_direct), ("OpenAlex", from_openalex)):
        try:
            data = source()
            if not data["publications"]:
                raise RuntimeError("no publications returned")
            break
        except Exception as error:
            errors.append(f"{name}: {error}")
            data = None
            time.sleep(1)
    for e in errors:
        print("skipped", e)
    if not data:
        print("No source reachable; keeping the last saved values.")
        return 0
    data["publications"].sort(key=lambda p: (-(p["year"] or 0), p["title"].lower()))
    for p in data["publications"]:
        p["type"] = classify(p)
        p["role"] = role(p)
    data["publication_count"] = len(data["publications"])
    data["journal_count"] = sum(p["type"] == "journal" for p in data["publications"])
    data["presentation_count"] = sum(p["type"] == "presentation" for p in data["publications"])
    data["lead_journal"] = sum(p["type"] == "journal" and p["role"] == "lead" for p in data["publications"])
    data["lead_presentation"] = sum(p["type"] == "presentation" and p["role"] == "lead" for p in data["publications"])
    data["profile_url"] = PROFILE
    old = json.loads(OUT.read_text()) if OUT.exists() else {}
    if old.get("source") == "Google Scholar" and data["source"] != "Google Scholar":
        print(f"Google Scholar unreachable; keeping the Scholar values from {old.get('updated')} instead of switching to {data['source']}.")
        return 0
    if {k: v for k, v in old.items() if k != "updated"} == data:
        print(f"{data['source']}: unchanged.")
        return 0
    data["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    update_knowledge(data)
    print(f"{data['source']}: {data['citations']} citations, h-index {data['h_index']}, {data['publication_count']} publications.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
