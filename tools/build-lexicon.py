#!/usr/bin/env python3
"""Builds the word-prediction lexicon from two openly licensed sources.

  words + frequency order : hermitdave/FrequencyWords (OpenSubtitles 2018)
                            https://github.com/hermitdave/FrequencyWords
                            content licensed CC BY-SA 4.0
  German casing + gender  : gambolputty/german-nouns (from Wiktionary)
                            https://github.com/gambolputty/german-nouns
                            licensed CC BY-SA 4.0
  English validity filter : dwyl/english-words (Unlicense, public domain)
                            https://github.com/dwyl/english-words

Both sources are CC BY-SA 4.0, so the generated files carry that licence too;
see data/LICENSE-DATA.md. The app code stays MIT.

Why the German list needs a second source: the frequency lists are fully
lowercased, and suggesting "wasser" to someone rebuilding their German is
simply wrong. The noun list restores the capital and hands over the article
as a bonus.

Frequencies themselves are not shipped — the line order IS the rank, which
saves about a third of the file.

Depth is chosen from where each corpus stops being trustworthy. Sampling the
subtitle lists, German is still real vocabulary at rank 60,000 (kaffeekanne,
sportskanone, dementieren) while English has decayed into names and fragments
by rank 40,000 (flaco, eusebio, 'av, wantyou). So English past the trusted
head is kept only where a public-domain dictionary confirms the word exists,
and German is instead EXTENDED with Wiktionary nouns the subtitles never
contained — which is where words like Steckdose, Katheter and Synthesizer
come from.

Usage:  python3 tools/build-lexicon.py [--limit 20000]
"""
import argparse, csv, os, re, sys, urllib.request

FREQ = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/{0}/{0}_full.txt"
NOUNS = "https://raw.githubusercontent.com/gambolputty/german-nouns/main/german_nouns/nouns.csv"
ENDICT = "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
CACHE = os.path.join(os.path.dirname(__file__), ".cache")

WORD_RE = {
    "de": re.compile(r"^[a-zäöüß]{2,24}$"),
    "en": re.compile(r"^[a-z]{1,24}$"),
}
# Subtitle corpora carry transcription noise; these never help someone
# reaching for a word and only push real vocabulary out of the list.
JUNK = re.compile(r"(.)\1\1|^(uh|uhh|hm+|mm+|ah+|oh+|eh+|erm|ähm|äh+|hä+|öh+)$")

# Wiktionary lists nominalised function words as nouns ("das Ich", "das Ja",
# "die Sie"), so a naive lookup capitalises pronouns and auxiliaries and turns
# "das ist" into "das Ist". Closed-class words never take the capital here.
NEVER_CAPITALISE = set("""
ich du er sie es wir ihr mich dich sich uns euch mir dir ihm ihn ihnen
mein dein sein unser euer meine deine seine ihre unsere eure meinem deinem
seinem ihrem meinen deinen seinen ihren meiner deiner seiner ihrer
der die das den dem des ein eine einen einem einer eines kein keine keinen
keinem keiner keines dieser diese dieses diesen diesem jener jene jenes
welcher welche welches manche mancher alles alle allen aller allem
bin bist ist sind seid war warst waren wart gewesen sei seien wäre wären
habe hast hat haben habt hatte hattest hatten hattet gehabt hätte hätten
werde wirst wird werden werdet wurde wurdest wurden wurdet worden würde würden
kann kannst könnt können konnte konnten könnte könnten gekonnt
muss musst müssen müsst musste mussten müsste müssten
darf darfst dürfen dürft durfte durften dürfte dürften
soll sollst sollen sollt sollte sollten mag magst mögen möchte möchten möchtest
will willst wollen wollt wollte wollten
und oder aber denn sondern doch also weil dass ob wenn als wie da damit
ohne über unter auf an in bei mit nach vor zu zum zur im am ans aufs
aus für gegen um durch bis seit von vom hinter neben zwischen trotz während
wegen statt außer gegenüber entlang innerhalb ausserhalb außerhalb
nicht nie niemals noch nur schon sehr mehr weniger wieder immer oft manchmal
selten hier dort da dann jetzt heute gestern morgen bald gleich fast etwa
ja nein doch bitte danke ok okay gut schlecht sicher vielleicht wohl eben
halt mal so auch sogar eigentlich wirklich natürlich leider hoffentlich
was wer wen wem wessen wo woher wohin wann warum wieso weshalb wodurch
man jemand niemand etwas nichts jeder jede jedes jeden jedem
eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf
erste erster erstes zweite zweiter dritte dritter viele vieles viel
hoch tief nah weit alt neu jung gross groß klein lang kurz
komm komme kommst kommt kommen kam kamen gekommen geh gehe gehst geht gehen
schau schaue schaust schaut sag sage sagst sagt sagen gesagt
mach mache machst macht machen gemacht lass lasse lässt lasst lassen
gefallen verlassen bekommen vergessen versprechen verstehen gehören

weiss weiß hab tun sehen wissen ab gerade reden selbst lange ach hören denke
warte bleiben rein glauben fragen warten sprechen fahren töten sterben
arbeiten suchen spielen anders erzählen tu stellen trinken kriegen ehrlich
frei früh retten pass lieben schaffen scheiss scheiß lernen laufen versuche
heiraten super total halte laut hart tragen fühlen lachen führen schauen
lesen geschehen fliegen perfekt fallen rufe folgen bitten hole liegen fangen
fort werd süss süß tanzen ansehen sowieso normal lauf erwarten sauer näher
aussehen links erreichen kriege bleibe singen stecken wohnen hau schützen
überleben feiern nahe melden leisten drehen schließen schliessen to rest rum
zahlen antworten miteinander schätze los leid schuld recht wert
""".split())

# The reviewed set above was produced by listing every capitalised entry in the
# top 1500 and reading it: these are the ones where the verb or adjective
# reading is the ordinary one in speech, even though Wiktionary also lists a
# nominalised noun ("das Wissen", "das Warten").


def fetch(url, name):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        sys.stderr.write("downloading %s\n" % url)
        urllib.request.urlretrieve(url, path)
    return path


def german_nouns():
    """lowercase form -> (properly cased form, gender letter)."""
    out = {}
    path = fetch(NOUNS, "nouns.csv")
    with open(path, newline="", encoding="utf-8") as fh:
        rd = csv.DictReader(fh)
        for row in rd:
            lemma = (row.get("lemma") or "").strip()
            if not lemma or not lemma[:1].isupper():
                continue          # only nouns; affixes and lowercase entries out
            if not re.match(r"^[A-ZÄÖÜ][a-zäöüßA-ZÄÖÜ-]{1,23}$", lemma):
                continue
            if lemma.isupper():
                continue          # acronym rows turn "ab" into "AB"
            gen = ""
            for key in ("genus", "genus 1", "genus 2"):
                v = (row.get(key) or "").strip()
                if v in ("m", "f", "n"):
                    gen = v
                    break
            forms = [(lemma, True)]
            for key in ("nominativ plural", "nominativ plural 1"):
                v = (row.get(key) or "").strip()
                if v and re.match(r"^[A-ZÄÖÜ][a-zäöüßA-ZÄÖÜ-]{1,23}$", v):
                    forms.append((v, False))
            for f, is_lemma in forms:
                lo = f.lower()
                # first writer wins: lemmas are read before their own plurals,
                # and earlier lemmas are the more basic words
                if lo not in out:
                    out[lo] = (f, gen if is_lemma else "", is_lemma)
    return out


def english_dictionary():
    """A public-domain word list, used only to confirm that a word exists."""
    path = fetch(ENDICT, "words_alpha.txt")
    with open(path, encoding="utf-8") as fh:
        return set(w.strip() for w in fh if w.strip())


# How deep each corpus stays trustworthy on its own, and how deep it is worth
# looking at all once a dictionary is vouching for the words. Sampled from the
# lists themselves: German is still real vocabulary at rank 60,000
# (kaffeekanne, sportskanone, dementieren) while English has decayed into
# names and fragments by 40,000 (flaco, eusebio, 'av, wantyou).
TRUSTED = {"de": 60000, "en": 30000}
SCANNED = {"de": 60000, "en": 150000}


def build(lang, limit, nouns=None, endict=None):
    path = fetch(FREQ.format(lang), "%s_full.txt" % lang)
    rx = WORD_RE[lang]
    lines, seen = [], set()
    rank = 0
    with open(path, encoding="utf-8") as fh:
        for raw in fh:
            rank += 1
            if rank > SCANNED[lang] or len(lines) >= limit:
                break
            word = raw.split(" ")[0].strip()
            if not word or not rx.match(word) or JUNK.search(word):
                continue
            if lang == "en" and len(word) == 1 and word not in ("a", "i"):
                continue
            # Past the trusted head, keep only what a dictionary confirms.
            if rank > TRUSTED[lang] and endict is not None and word not in endict:
                continue
            display, gen = word, ""
            if nouns and word in nouns and word not in NEVER_CAPITALISE:
                display, gen = nouns[word][0], nouns[word][1]
            key = display.lower()
            if key in seen:
                continue
            seen.add(key)
            lines.append(display + ("|" + gen if gen else ""))

    # German gains the curated Wiktionary nouns the subtitles never carried —
    # Steckdose, Katheter, Synthesizer. They are ordered by length, because a
    # shorter noun is the likelier everyday word and there is no frequency to
    # go on this far out.
    if lang == "de" and nouns and len(lines) < limit:
        extra = []
        for lo in nouns:
            form, gen, is_lemma = nouns[lo]
            # Lemmas only: a prefix search reaches "Steckdosen" from
            # "Steckdose" anyway, and dropping the plurals halves the file.
            if not is_lemma or lo in seen or len(lo) < 3 or len(lo) > 22:
                continue
            if not re.match(r"^[a-zäöüß]+$", lo):
                continue
            extra.append((len(lo), lo, form, gen))
        extra.sort()
        for _, lo, form, gen in extra:
            if len(lines) >= limit:
                break
            seen.add(lo)
            lines.append(form + ("|" + gen if gen else ""))
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=90000)
    args = ap.parse_args()

    nouns = german_nouns()
    sys.stderr.write("german noun forms: %d\n" % len(nouns))
    endict = english_dictionary()
    sys.stderr.write("english dictionary: %d\n" % len(endict))

    root = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(root, exist_ok=True)
    for lang in ("de", "en"):
        lines = build(lang, args.limit,
                      nouns if lang == "de" else None,
                      endict if lang == "en" else None)
        body = "\\n".join(lines)
        out = ("/* Generated by tools/build-lexicon.py — do not edit by hand.\n"
               " * Word list derived from OpenSubtitles frequency data and (for German)\n"
               " * Wiktionary noun data. Both CC BY-SA 4.0 — see data/LICENSE-DATA.md.\n"
               " * Order is frequency rank. \"|m\", \"|f\", \"|n\" mark noun gender. */\n"
               "window.LEXICON = window.LEXICON || {};\n"
               "window.LEXICON.%s = \"%s\";\n") % (lang, body)
        p = os.path.join(root, "lexicon-%s.js" % lang)
        with open(p, "w", encoding="utf-8") as fh:
            fh.write(out)
        caps = sum(1 for l in lines if l[:1].isupper())
        sys.stderr.write("%s: %d words, %d capitalised, %.0f KB\n"
                         % (lang, len(lines), caps, os.path.getsize(p) / 1024))


if __name__ == "__main__":
    main()
