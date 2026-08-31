#!/usr/bin/env python3
"""Guard against structural damage in styles.css.

A single stray closing brace once terminated the cascade early, which silently
dropped `* { box-sizing: border-box }` and made every padded element 38 px too
wide on a phone. Nothing errored, nothing looked obviously wrong in a desktop
window, and it took a long time to find. This check makes that failure loud.

    python3 tools/check-css.py
"""
import re, sys, os

path = os.path.join(os.path.dirname(__file__), "..", "styles.css")
src = open(path, encoding="utf-8").read()
stripped = re.sub(r"/\*.*?\*/", "", src, flags=re.S)

depth, first_negative = 0, None
for n, line in enumerate(stripped.split("\n"), 1):
    depth += line.count("{") - line.count("}")
    if depth < 0 and first_negative is None:
        first_negative = n

problems = []
if first_negative:
    problems.append("stray closing brace at or before line %d" % first_negative)
if depth != 0:
    problems.append("unbalanced braces: final depth %d" % depth)

# The one rule everything else assumes.
if not re.search(r"^\s*\*\s*\{[^}]*box-sizing\s*:\s*border-box", stripped, re.M):
    problems.append("the global `* { box-sizing: border-box }` rule is missing")

if problems:
    for p in problems:
        sys.stderr.write("styles.css: %s\n" % p)
    sys.exit(1)
print("styles.css: %d rules, braces balanced" % stripped.count("{"))
