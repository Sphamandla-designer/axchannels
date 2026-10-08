#!/usr/bin/env python3
"""Prefix root-absolute URLs for a GitHub Pages project site.

The site is written with root-absolute paths ("/assets/...", "/contact/"),
which is right for a custom domain served at "/". A project site is served
at "/<repo>/" instead, so "/assets/home.css" resolves to the user's root
site and 404s: the pages load with no CSS, JS or images.

Run against the published tree only, never the source:

    python3 prefix-paths.py /axchannels

It rewrites href/src/action/poster/srcset attributes in HTML, url(...) in
CSS and inline styles, and the paths in site.webmanifest. Protocol-relative
URLs ("//cdn...") and absolute URLs are left alone.
"""
import json
import pathlib
import re
import sys

prefix = sys.argv[1].rstrip("/")
if not prefix.startswith("/"):
    sys.exit("prefix must start with /")

root = pathlib.Path(".")
SKIP = {".git", ".github"}

def fix(path):
    """'/x' -> '/<repo>/x'; leaves '//host', already-prefixed and other URLs."""
    if path.startswith("/") and not path.startswith("//") \
            and path != prefix and not path.startswith(prefix + "/"):
        return prefix + path
    return path

ATTR = re.compile(r'''(\b(?:href|src|action|poster|data-src)\s*=\s*)(["'])(/[^"']*)\2''', re.I)
SRCSET = re.compile(r'''(\bsrcset\s*=\s*)(["'])([^"']*)\2''', re.I)
CSSURL = re.compile(r'''url\(\s*(["']?)(/[^"')]*)\1\s*\)''')

def rewrite_srcset(m):
    parts = []
    for item in m.group(3).split(","):
        bits = item.strip().split(None, 1)
        if bits:
            bits[0] = fix(bits[0])
        parts.append(" ".join(bits))
    return m.group(1) + m.group(2) + ", ".join(parts) + m.group(2)

changed = 0
for f in root.rglob("*"):
    if not f.is_file() or SKIP & set(f.parts):
        continue
    if f.suffix in (".html", ".css"):
        text = f.read_text(encoding="utf-8")
        new = ATTR.sub(lambda m: m.group(1) + m.group(2) + fix(m.group(3)) + m.group(2), text)
        new = SRCSET.sub(rewrite_srcset, new)
        new = CSSURL.sub(lambda m: "url(" + m.group(1) + fix(m.group(2)) + m.group(1) + ")", new)
    elif f.name == "site.webmanifest":
        data = json.loads(f.read_text(encoding="utf-8"))
        for k in ("start_url", "scope"):
            if k in data:
                data[k] = fix(data[k])
        for icon in data.get("icons", []):
            icon["src"] = fix(icon["src"])
        new = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        text = f.read_text(encoding="utf-8")
    else:
        continue
    if new != text:
        f.write_text(new, encoding="utf-8")
        changed += 1
        print("prefixed", f)

print(f"{changed} file(s) rewritten for {prefix}/")
