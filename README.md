# Wortfaden

A bilingual (German / English) practice and communication app for aphasia and
word-finding difficulty after a stroke or brain surgery.

It does two jobs:

1. **Practice** — a structured training programme for naming and everyday
   speech, built on established aphasia therapy methods.
2. **Communication** — an AAC board for the times speaking is not working at
   all, which in an acute ward is most of them.

**→ [datanoisetv.github.io/wortfaden](https://datanoisetv.github.io/wortfaden/)**

Runs in any modern browser, on a phone or a tablet, offline after the first
load. No server, no account, no data leaves the device.

On a phone, open the link and use **"Add to Home Screen"** (Safari: share
menu; Chrome: the three-dot menu). It then opens like an app and keeps
working without a network.

---

## What it is not

Not a medical device, not a diagnosis, not therapy, and not a replacement for
a speech and language therapist. It fills the time between appointments.

In Germany, once speech therapy is running, the **neolexon aphasia app** is a
reimbursable alternative: it is listed in the DiGA register (PZN 18017082),
paid for by statutory health insurance, and unlocked by the treating
therapist through a separate therapist app. Ask for it as soon as therapy is
in place. This app is what you use in the meantime, and alongside it.

---

## The evidence it is built on

Every design decision below traces to something, not to taste.

**Naming is the core deficit, so naming is the backbone.**
The practice ladder implements a *cueing hierarchy* — hints ordered from the
weakest to the strongest (function → sentence → first letter → the word
itself), so the help given is the least that works. Alongside it sits
*semantic feature analysis*: describing a thing before naming it activates the
word field around it.

**Recognition comes before production.**
An app that opens with "look at this picture and say the word" makes an open
demand with no resolution, which is the most discouraging thing a naming app
can do. Here every word starts as a three-way choice, and only climbs to free
naming once it has settled. Every single item ends with the word shown and
spoken, so nothing is left hanging.

**Personally relevant words matter more than any word list.**
*Big CACTUS* (Lancet Neurology 2019, n=278, the largest trial of self-managed
computerised therapy for aphasia) found a clinically meaningful gain in word
finding — 16.4% versus 1.1% in usual care — and the words trained were
personally chosen for each participant. It also found that the gains did
**not** transfer to conversation on their own. Hence: your own words are a
first-class feature, and every session ends on real everyday sentences.

**In the acute phase, dose is the limiting factor, not content.**
The *VERSE* trial of very early intensive aphasia therapy found that a large
share of participants could not tolerate the prescribed amount at all, and
that more intensity early did not produce better outcomes. So this app asks
mid-session whether the pace still fits and then actually shortens the rest,
slows the voice, and hands out help sooner. A break is one tap from anywhere.

**Aphasia is a language impairment, not an intellectual one.**
This is why the communication board is not a needs grid. It carries a sentence
builder, free writing with a letter grid, and phrases about agency — "please
talk to me, not about me", "give me time, the word is coming", "I understand
you, I just cannot find the words". A board that only offers *water / toilet /
pain* hands an adult a toddler's vocabulary.

**Hospital communication boards have a known shape.**
Responses first (establishing a reliable yes/no is step one in every hospital
communication protocol), then needs, symptoms and pain, feelings, and the care
team. The single biggest barrier reported for AAC in intensive care is that
the board is not to hand — so it is one tap from every screen.

Sources:
[Semantic Feature Analysis](https://tactustherapy.com/semantic-feature-analysis-sfa-anomia/) ·
[Cueing hierarchy](https://tactustherapy.com/cueing-hierarchy-word-finding-aphasia/) ·
[Big CACTUS (Lancet Neurology)](https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(19)30192-9/fulltext) ·
[VERSE trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC8267088/) ·
[Aphasia-friendly text formatting](https://www.aphasiapathway.com.au/flux-content/aarp/pdf/Aphasia-Friendly-Text-formatting.pdf) ·
[Melodic Intonation Therapy: rhythm and pitch](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4127945/) ·
[neolexon / DiGA](https://www.neolexon.de/)

---

## The training programme

Words are taught in a fixed order, front-loaded with what someone actually
needs to ask for in a hospital bed, then working outward into everyday life.
The programme has five stages. A stage widens the vocabulary in play and
unlocks one more kind of demand:

| Stage | Words in play | Adds |
|---|---|---|
| 1 | 8 | pick the word from three (recognition) |
| 2 | 20 | the word missing from a sentence |
| 3 | 32 | cued naming · describe-then-name · spelling |
| 4 | 44 | free naming |
| 5 | all 69 | syllables and first sounds |

A stage advances only when ~70% of the words in play have settled **and** the
person has not been signalling overload in the pace check-ins. It never goes
backwards: a hard day moves the pace, not the level.

Within a stage, each word climbs its own ladder based on its Leitner box, and
**never meets the same task twice in a row** if a neighbouring rung is open —
repeating a word in the same task teaches the task, not the word. Simulated
over 60 sessions, consecutive same-task repeats come out at 2–9%, and all
seven task types appear in a balanced mix.

Distractors get harder as a word settles: different-category options at first
(the picture alone tells them apart), same-category options later (which
forces a semantic decision).

---

## Exercises

| | |
|---|---|
| **Aufwärmen** | Counting, weekdays, colours. Serial speech is often preserved in aphasia, so it is a reliable way to start. |
| **Wort wählen** | Picture plus three words. Always winnable. |
| **Satz ergänzen** | The missing word in a high-cloze sentence — one of the strongest single cues there is. |
| **Benennen** | Free production, with a cue chain on request. |
| **Merkmale** | The SFA questions, presented as statements to read rather than a quiz. |
| **Schreibweise** | Which spelling is right, against homophone traps. Reading and writing are usually affected alongside speech. |
| **Klang und Silben** | Tap the syllables, find the first letter. |
| **Alltagssätze** | Real sentences, chunked, played piece by piece. |

---

## The communication board

Three ways to say something, in order of how much they let you say:

- **Schnell** — 95 tiles across nine categories: answers, needs, pain,
  feelings, closeness, the day, agency, questions, people. One tap.
- **Satz bauen** — 28 sentence starters and about 180 one-clause utterances,
  then **"Mehr sagen"** to chain another clause, and another, with no limit.
  Two taps per clause; roughly 200,000 two-clause combinations.
  Only connectors that stay grammatical under plain concatenation are offered:
  German gets *und / aber / oder / denn*, because *weil* and *obwohl* need the
  verb at the end and *dann / deshalb* need inversion — neither is something a
  flat join can produce, and shipping "weil ich kann nicht sprechen" would put
  broken German in the mouth of someone already fighting for words. A **new
  sentence** button covers everything else, so length stays unlimited.
  Anything the tiles cannot reach can be handed over to free writing mid-thought.
- **Schreiben** — free text with error-tolerant word prediction over a
  dictionary of 136,000 German and 70,000 English words, on a large on-screen
  keyboard that switches between QWERTZ, alphabetical, and numbers. Unlimited.

Whatever is spoken is also shown **full screen in the largest type that fits**,
because in a hospital room the audio is the unreliable channel — masks,
machines, distance, a phone lying on a blanket. A nurse reading it off the
screen from the foot of the bed is the fallback that always works.

### Word prediction

Typing the first letters is enough, and they do not have to be the right ones.

Two findings shape the matching. Substitution errors in aphasia are usually a
**single distinctive-feature change** — voicing above all (b/p, d/t, g/k, f/v,
s/z) — and **deletion of word-final segments** is among the most common error
types, which is what prefix matching already covers.

So rather than inventing a confusion table, German matching runs on the
**Kölner Phonetik**, the standard German phonetic algorithm, which collapses
exactly those groups (p/b → 1, d/t → 2, f/v/w → 3, g/k/q → 4, s/z/ß/c → 8) and
makes ä/e, ie/i and doubled letters stop mattering. English uses a
spelling-confusion fold instead, because English errors are orthographic more
than phonetic.

Candidates are scored on one scale rather than sorted into hard tiers. Tiers
alone were wrong: "glaz" is a literal prefix of "Glazial", so an exact-prefix
tier put a mineralogy term ahead of "Glas". The score trades spelling distance
against word frequency, so a common word one edit away beats a rare word that
merely starts with the same letters. Her own words and the practice vocabulary
are pushed to the front, and German nouns carry their article.

**It also knows what the sentence expects next.** Not a parser — two rules that
hold up in both languages. After a determiner a noun is coming, and in German
the article has already fixed its gender; after a subject pronoun a verb is
coming. Since German capitalises nouns, "is this a noun" is knowable without a
tagger:

| typed | suggestions |
|---|---|
| `ich möchte eine ta` | **die** Tablette · **die** Tasse · **die** Tasche · **die** Tante |
| `ich möchte den ta` | **der** Tag · **der** Tanz · **der** Tatort · **der** Täter |
| `ich ta` | tagen · tatsächlich · tanzen |

Measured on the real lists, 1.3 ms mean and 4.3 ms worst case per keystroke:

| typed | first suggestions |
|---|---|
| `dablette` | **die Tablette** · Tabletten · das Tablett |
| `kobf` | **der Kopf** · Köpfe · Kopfschmerzen |
| `schmertz` | **der Schmerz** · Schmerzen · schmerzt |
| `fenzter` | **Fenster** · Finsternis · finster |
| `glaz` | **das Glas** · die Klasse · Gläser |
| `tirsty` | **thirsty** |
| `medisin` | **medicine** · medicines · medicinal |
| `steckdoze` | **die Steckdose** · Steckdosen |
| `sinthesizer` | **der Synthesizer** |

### The keyboard

Three layouts behind one key: **QWERTZ/QWERTY** for anyone who has typed for
decades, **alphabetical** for anyone hunting letter by letter, and **numbers**.

The number keys carry dice pips as well as the digit. A quantity you can point
at works when the number word will not come — how many, which room, how long —
and numbers are among the words that go first.

### Follow-up chains

Two tiles carry follow-up chains, because they are the ones that otherwise
dead-end into questions the person cannot answer:

- **"Ich habe Schmerzen"** → where exactly → how strong (Faces Pain
  Scale-Revised, 0–2–4–6–8–10). The answer is written into the pain history,
  which can be shown on the ward round.
- **"Toilette"** → what exactly, including the things that are hardest to ask
  for and worst to be unable to ask for.

Set the visiting partner's name in Settings and the board says it: *"Ich möchte
Anna sehen"*, not *"Ich möchte dich sehen"*.

Everything said through the board is written to a **communication log** with a
timestamp. For someone who cannot speak, that log is the only record of what
they actually asked for during a day, which makes it worth showing on a ward
round — and worth keeping private. It lives behind the review PIN, never
leaves the device, and can be cleared in one tap.

---

## Voice

By default the app uses the operating system's speech synthesis. That is a
lottery: macOS enumerates novelty voices (Hysterical, Grandpa, Zarvox) right
next to the real ones, and iOS Safari is known to hide installed German voices
from `getVoices()` entirely. So:

- Novelty and robotic voices are **hard-excluded** from selection.
- Remaining voices are ranked — Premium/Enhanced/Neural builds first, then the
  known-good system voices per language.
- **Optionally**, the app can download a Piper neural voice
  (`de_DE-thorsten-medium`) and run it locally. Measured: 60.3 MB one-time
  download, ~650 ms per word, persists in the Origin Private File System
  across reloads with no re-download. The word is prefetched while the task is
  still being read, so a tap plays instantly.
- The written word is **always** on screen. Speech is an aid, never the only
  channel.

**On syllable playback:** orthographic syllables are not pronounceable
fragments. German TTS reads "Ta-blet-te" spoken apart as [taː][blɛt][teː] — the
final schwa becomes a full [eː] — which teaches a wrong pronunciation. IPA via
SSML `<phoneme>` would solve it, but the Web Speech API ignores SSML in both
Chrome and Safari. So the word is spoken whole and slowly while the syllables
light up in time; with the neural voice the timing comes from the real clip
duration rather than an estimate. Piece-by-piece playback is used only for
sentence chunks, where each piece is a whole word.

---

## Accessibility

Measured, not asserted:

- **Contrast**: every text pair ≥ 5.4:1, most ≥ 7:1, in both themes.
  Control borders ≥ 3:1 (WCAG 1.4.11). Verified with a contrast calculator
  over the palette, not by eye.
- **Targets**: everything tappable ≥ 44 px, most ≥ 60 px, verified by
  measuring rendered geometry across four viewports.
- **No horizontal scrolling** at 320 px, 390 px and 834 px, at every text size.
  Verified by asserting `scrollWidth <= clientWidth` on every screen.
- **One task per screen**, with the primary action pinned to the bottom edge so
  it is never scrolled away.
- Text scales to a 26 px root from inside the app. Strong-contrast mode.
  Reduced-motion mode, plus `prefers-reduced-motion`.
- Sans-serif, 1.6 line height, left aligned, no justification, no all-caps, no
  italics for content — per aphasia-friendly formatting guidance.
- Real buttons, visible focus rings, ARIA live regions, screen-reader labels
  on every control.
- No timers, no failure sounds, no score pressure. There is no wrong answer
  anywhere in the practice flow.

---

## Data and privacy

Everything is in `localStorage` on the device. There is no server, no account
and no transmission. Voice recordings in the phrase exercise stay in memory and
are discarded. The optional neural voice downloads a model from a CDN once;
after that it is local.

The **review area** (practice statistics, mastery levels, pain history, a
plain-text report for the therapist) sits behind a PIN. Be clear about what
that is: a **privacy screen, not security**. The data is unencrypted in
`localStorage` and anyone with the device and developer tools can read it. Its
job is to keep error rates and statistics out of the practising person's way —
seeing your own failure rate mid-recovery is discouraging and clinically
unhelpful. It is reachable from Settings by tapping the lock icon five times.

---

## Setting it up for someone

The last two questions in the setup are for whoever hands the phone over — a
nurse, a doctor, a partner:

**What should the app do?**

| | |
|---|---|
| **Beides** | Communication and practice. The default. |
| **Nur Verständigung** | No training at all. The board *is* the app: it opens straight into it, and there is nowhere else to go. Sometimes practising is simply too much, and that call belongs to the ward. |
| **Nur Üben** | Practice without the board. |

**Protect the settings?** If yes, a PIN is set and the gear then needs two
taps plus that PIN. This keeps configuration out of reach during practice
without hiding it from the people who need it. Same PIN as the review area.

Both are changeable later in Settings.

---

## Running it

No build step. It is plain HTML, CSS and ES5-compatible JavaScript.

```sh
# any static server
python3 -m http.server 8137
# then open http://127.0.0.1:8137/
```

Opening `index.html` directly from the filesystem works too, minus the service
worker (so no offline caching) and minus the neural voice.

It is also published from this repository to GitHub Pages at
<https://datanoisetv.github.io/wortfaden/>; pushing to `main` redeploys it.
The service worker serves the app's own files network-first with the cache as
the fallback, so a deploy takes effect on the next load rather than the one
after, while offline still works.
To host it elsewhere, serve the folder over HTTPS from any static host — all
paths are relative, so a subdirectory works fine.

### Layout

```
index.html              app shell
styles.css              the whole visual system
js/
  i18n.js               all UI strings, DE + EN (key parity is tested)
  data-words.js         69 words × 2 languages, each with the six SFA
                        features, a cloze sentence, syllables and a rhyme
  data-phrases.js       30 everyday sentences in rhythmic chunks + 7 series
  data-board.js         communication board: 95 tiles, compose grammar, chains
  data-encouragement.js encouragement lines (adult in tone, deliberately)
  predict.js            error-tolerant, grammar-aware word prediction
  store.js              local persistence, Leitner boxes, wellbeing log
  programme.js          the training programme: stages, ladder, variation
  spelling.js           plausible misspelling generator
  neural-voice.js       optional Piper voice (download, cache, synthesise)
  speech.js             speech dispatch: neural voice or system, with fallback
  ui.js                 DOM helpers, i18n lookup, settings application
  exercises.js          the exercise runners
  screens.js            onboarding, settings, my words, pain check-in
  board.js              the communication board screen
  review.js             the PIN-gated review area
  app.js                router, chrome, session engine
sw.js                   offline cache
data/
  lexicon-de.js         136,000 German words, capitalised, with gender
  lexicon-en.js         70,000 English words
  LICENSE-DATA.md       CC BY-SA 4.0 attribution for the two lists
tools/
  build-lexicon.py      regenerates the lexicons from their upstream sources
  check-css.py          guards the stylesheet against structural damage
```

### Licences

The application code is MIT. The two word lists in `data/` are **CC BY-SA
4.0**, because they are derived from [OpenSubtitles frequency
data](https://github.com/hermitdave/FrequencyWords) and, for German
capitalisation and gender, from
[german-nouns](https://github.com/gambolputty/german-nouns). Details and
attribution in `data/LICENSE-DATA.md`.

### Tests

There is no test framework; the checks are scripts that were run against the
real thing:

- i18n key parity between German and English (338 keys each).
- Word data integrity: unique ids, both languages complete, a cloze slot in
  every sentence, all six SFA features present.
- Phrase chunks reassemble exactly to the phrase.
- The curriculum covers every word exactly once.
- The misspelling generator over all 138 word/language pairs: no candidate
  identical to its target, no tripled letters, no real vocabulary words.
- A 60-session simulation of the programme for a strong and a struggling
  learner, checking stage progression, task mix, and same-task repeat rate.
- A headless-browser audit of every screen at 320/390/834 px, in light and
  dark, at normal and 26 px text, with strong contrast: horizontal overflow,
  unnamed controls, target sizes, duplicate ids.
- A six-session playthrough driven through the real DOM, asserting zero
  runtime errors.
- All 69 pictograms distinct, and the curriculum order covering every word
  exactly once.
- The communication board driven end to end: follow-up chains, partner-name
  substitution, the log, and back navigation stepping out one level at a time.
- Word prediction against deliberately misspelled input in both languages,
  with per-query timing (1.3 ms mean over 20k, 5.7 ms over 136k).
- Layout on five phone sizes down to 320x568, asserting that neither the page
  nor the task area scrolls where it should not.
- `tools/check-css.py`: brace balance and the presence of the global
  `box-sizing` rule. A single stray closing brace once dropped that rule and
  made every padded element 38 px too wide on a phone — nothing errored, and
  it was only visible as "the mobile view overflows".

---

## Known limits

- The pictures are emoji. They render large and are license-free and offline,
  but aphasia-friendly guidance prefers photographs. Personal words can carry
  a real photo, and that is the better path for anything that matters.
  Every pictogram was reviewed against its word and all 69 are distinct; where
  no good picture existed the word was changed rather than the picture fudged
  (Unicode has no refrigerator, so the entry is milk).
- The misspelling generator can occasionally produce a real German word that
  is not in the vocabulary (Schmerz → Scherz). The picture disambiguates, but
  it is not ideal.
- Speech recognition is deliberately absent. Automatic scoring of aphasic
  speech is unreliable, and being told by a machine that you said it wrong is
  worse than no feedback. Self-rating drives the spaced repetition instead.
- The neural voice needs one online session to install, and about 60 MB.
- The dictionary comes from a subtitle corpus, so it carries a few film names
  and transliterations in the long tail ("brody", "dexter"). Filtering removes
  the transcription noise but not every proper noun.
- The German lexicon is 1.8 MB uncompressed (about 550 KB over the wire) and
  takes roughly 200 ms to index on a laptop. It is loaded only when the
  writing view is opened, and cached from then on.
- Word class is only knowable for German nouns, via their capital. English has
  no part-of-speech data here, so the grammar rules are German-only.
