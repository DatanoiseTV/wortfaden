/* Word prediction with error-tolerant matching.
 *
 * The point is to reach a word from a wrong or partial spelling, because that
 * is the situation this app exists for. Two findings shape the matching:
 *
 *  - Substitution errors in aphasia are usually a SINGLE distinctive-feature
 *    change — voicing above all (b/p, d/t, g/k, f/v, s/z) — and homorganic
 *    pairs that share a place of articulation.
 *  - Deletion of word-final segments and syllables is one of the most common
 *    error types, which is exactly what prefix matching already handles.
 *
 * So rather than inventing a confusion table, German matching runs on the
 * Kölner Phonetik (Cologne phonetics), a standard German phonetic algorithm
 * that collapses precisely those groups: p/b -> 1, d/t -> 2, f/v/w -> 3,
 * g/k/q -> 4, s/z/ß/c -> 8. Vowels collapse to nothing, so ä/e, ie/i and
 * doubled letters stop mattering too. English uses a spelling-confusion fold
 * instead, because English errors are orthographic more than phonetic.
 *
 * Results come back in tiers — exact prefix, then phonetic, then one typo —
 * and are ranked inside each tier by word frequency, with the person's own
 * words pushed to the front.
 */
(function () {
  var LEX = {};        // lang -> { words, gender, norm, pho, ready }
  var loading = {};

  /* ---------- normalisation ---------- */
  function fold(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
      .replace(/[^a-z]/g, '');
  }

  /* ---------- Kölner Phonetik ----------
   * Context-sensitive digit codes, then duplicate collapse, then the zeros
   * (vowels) drop except a leading one. */
  function cologne(input) {
    var s = String(input).toUpperCase()
      .replace(/Ä/g, 'A').replace(/Ö/g, 'O').replace(/Ü/g, 'U').replace(/ß/g, 'SS')
      .replace(/[^A-Z]/g, '');
    if (!s) return '';
    var codes = [];
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), prev = s.charAt(i - 1) || '', next = s.charAt(i + 1) || '';
      var code = null;
      if ('AEIJOUY'.indexOf(c) >= 0) code = '0';
      else if (c === 'H') code = null;                      // never coded
      else if (c === 'B') code = '1';
      else if (c === 'P') code = (next === 'H') ? '3' : '1';
      else if (c === 'D' || c === 'T') code = ('CSZ'.indexOf(next) >= 0) ? '8' : '2';
      else if (c === 'F' || c === 'V' || c === 'W') code = '3';
      else if (c === 'G' || c === 'K' || c === 'Q') code = '4';
      else if (c === 'C') {
        if (i === 0) code = ('AHKLOQRUX'.indexOf(next) >= 0) ? '4' : '8';
        else if ('SZ'.indexOf(prev) >= 0) code = '8';
        else code = ('AHKOQUX'.indexOf(next) >= 0) ? '4' : '8';
      } else if (c === 'X') code = ('CKQ'.indexOf(prev) >= 0) ? '8' : '48';
      else if (c === 'L') code = '5';
      else if (c === 'M' || c === 'N') code = '6';
      else if (c === 'R') code = '7';
      else if (c === 'S' || c === 'Z') code = '8';
      if (code !== null) codes.push(code);
    }
    var joined = codes.join('');
    var out = '';
    for (var j = 0; j < joined.length; j++) {
      if (joined.charAt(j) !== joined.charAt(j - 1)) out += joined.charAt(j);
    }
    return out.charAt(0) + out.slice(1).replace(/0/g, '');
  }

  /* ---------- English spelling fold ----------
   * English confusions are about how it is written, not how it sounds, so the
   * rules collapse the pairs people actually mix up. */
  function enFold(input) {
    var s = fold(input);
    if (!s) return '';
    s = s.replace(/^kn/, 'n').replace(/^wr/, 'r').replace(/^ps/, 's').replace(/^gn/, 'n');
    s = s.replace(/ough/g, 'of').replace(/augh/g, 'af').replace(/igh/g, 'i');
    s = s.replace(/ph/g, 'f').replace(/gh/g, 'g').replace(/ck/g, 'k').replace(/qu/g, 'kw');
    s = s.replace(/sch/g, 'sk').replace(/tch/g, 'ch').replace(/wh/g, 'w');
    s = s.replace(/c([eiy])/g, 's$1').replace(/c/g, 'k');   // soft c before e/i/y
    s = s.replace(/x/g, 'ks').replace(/z/g, 's').replace(/v/g, 'f');
    s = s.replace(/([aeiou])\1+/g, '$1').replace(/ea|ee|ie|ei|ey|ay|ai/g, 'e');
    s = s.replace(/(.)\1+/g, '$1');
    return s;
  }

  function key(word, lang) { return lang === 'de' ? cologne(word) : enFold(word); }

  /* ---------- loading ---------- */
  function ensure(lang, done) {
    if (LEX[lang] && LEX[lang].ready) return done(LEX[lang]);
    if (loading[lang]) { loading[lang].push(done); return; }
    loading[lang] = [done];

    function build() {
      var raw = (window.LEXICON && window.LEXICON[lang]) || '';
      var lines = raw ? raw.split('\n') : [];
      var words = [], gender = [], norm = [], pho = [];
      for (var i = 0; i < lines.length; i++) {
        var parts = lines[i].split('|');
        var w = parts[0];
        if (!w) continue;
        words.push(w);
        gender.push(parts[1] || '');
        norm.push(fold(w));
        pho.push(key(w, lang));
      }
      LEX[lang] = { words: words, gender: gender, norm: norm, pho: pho, ready: true };
      var queue = loading[lang];
      loading[lang] = null;
      queue.forEach(function (fn) { fn(LEX[lang]); });
    }

    if (window.LEXICON && window.LEXICON[lang]) return build();
    var s = document.createElement('script');
    s.src = 'data/lexicon-' + lang + '.js';
    s.onload = build;
    s.onerror = function () {
      // No lexicon: fall back to the app's own vocabulary rather than nothing.
      LEX[lang] = { words: [], gender: [], norm: [], pho: [], ready: true };
      var queue = loading[lang];
      loading[lang] = null;
      queue.forEach(function (fn) { fn(LEX[lang]); });
    };
    document.head.appendChild(s);
  }

  /* Distance from `a` to the CLOSEST PREFIX of `b`.
   *
   * Comparing against a fixed-length slice is wrong: "deke" against the first
   * four letters of "decke" is "deck", distance 2, which buries the right word
   * under noise. Against the whole word it is one insertion. Taking the
   * minimum over the final DP row gives that directly. */
  function prefixDistance(a, b) {
    var la = a.length, lb = b.length;
    if (!la) return 0;
    if (!lb) return la;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          v = Math.min(v, prev2[j - 2] + 1);
        }
        cur[j] = v;
      }
      prev2 = prev; prev = cur;
    }
    var best = prev[0];
    for (j = 1; j <= lb; j++) if (prev[j] < best) best = prev[j];
    return best;
  }

  /* Plain Damerau-Levenshtein, used to order near-misses. */
  function distance(a, b) {
    var la = a.length, lb = b.length;
    if (!la) return lb;
    if (!lb) return la;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          v = Math.min(v, prev2[j - 2] + 1);
        }
        cur[j] = v;
      }
      prev2 = prev; prev = cur;
    }
    return prev[lb];
  }

  /* Bounded Damerau-Levenshtein: gives up as soon as it exceeds `max`. */
  function within(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return false;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= lb; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          v = Math.min(v, prev2[j - 2] + 1);
        }
        cur[j] = v;
        if (v < best) best = v;
      }
      if (best > max) return false;
      prev2 = prev; prev = cur;
    }
    return prev[lb] <= max;
  }

  /* Words from the person's own life and from the practice vocabulary come
     first: those are the ones worth reaching, and Big CACTUS found personally
     relevant words are where the gains actually are. */
  function personal(lang) {
    var out = [];
    (window.Store.mine || []).forEach(function (m) {
      if (m.word) out.push({ w: m.word, g: '', own: true });
    });
    var ART2GEN = { der: 'm', die: 'f', das: 'n' };
    (window.WORDS || []).forEach(function (w) {
      var d = w[lang];
      // The practice words already carry their article; keep it rather than
      // dropping to a bare word just because they bypass the corpus.
      if (d && d.w) out.push({ w: d.w, g: ART2GEN[d.a] || '', own: false });
    });
    return out;
  }

  var Predict = {
    _cologne: cologne, _enFold: enFold, _fold: fold,
    loaded: function (lang) { return !!(LEX[lang] && LEX[lang].ready); },
    load: function (lang, done) { ensure(lang, function () { if (done) done(); }); },

    /* suggest(query, lang, limit) -> [{word, gender, tier}] */
    suggest: function (query, lang, limit) {
      limit = limit || 10;
      var q = fold(query);
      if (!q) return [];
      var lex = LEX[lang];
      var qk = key(query, lang);
      var seen = {}, tiers = [[], [], []];

      function add(word, gender, tier, rank, cand) {
        var k = word.toLowerCase();
        if (seen[k] !== undefined) return;
        seen[k] = 1;
        var score = rank;
        if (tier === 1) {
          /* The Cologne code is deliberately coarse: "deke", "dich" and "Tag"
             all share one key, so pure frequency would bury the word actually
             being reached. Order by how close the spelling is first. */
          score = prefixDistance(q, cand || fold(word)) * 4000 + rank;
        }
        tiers[tier].push({ word: word, gender: gender, tier: tier, rank: score });
      }

      // Personal and practice vocabulary, ranked ahead of the corpus.
      personal(lang).forEach(function (p, i) {
        var n = fold(p.w);
        if (!n) return;
        if (n.indexOf(q) === 0) add(p.w, p.g, 0, p.own ? -2000 + i : -1000 + i);
        else if (qk && key(p.w, lang).indexOf(qk) === 0) add(p.w, p.g, 1, p.own ? -2000 + i : -1000 + i, n);
      });

      if (lex && lex.words.length) {
        var n2 = lex.words.length, i2;
        for (i2 = 0; i2 < n2; i2++) {
          if (lex.norm[i2].indexOf(q) === 0) add(lex.words[i2], lex.gender[i2], 0, i2);
        }
        // Phonetic tier only from three characters on: below that it matches
        // half the language and the suggestions stop meaning anything.
        if (q.length >= 3 && tiers[0].length + tiers[1].length < limit * 3) {
          for (i2 = 0; i2 < n2; i2++) {
            if (qk && lex.pho[i2].indexOf(qk) === 0) add(lex.words[i2], lex.gender[i2], 1, i2, lex.norm[i2]);
          }
        }
        // One typo anywhere, over the same-length prefix region.
        if (q.length >= 4 && tiers[0].length + tiers[1].length < limit) {
          for (i2 = 0; i2 < n2; i2++) {
            var cand = lex.norm[i2];
            if (cand.length < q.length - 1) continue;
            if (within(q, cand.slice(0, q.length + 1), 1)) add(lex.words[i2], lex.gender[i2], 2, i2);
            if (tiers[2].length > 60) break;
          }
        }
      }

      var out = [];
      tiers.forEach(function (t) {
        t.sort(function (a, b) { return a.rank - b.rank; });
        out = out.concat(t);
      });
      return out.slice(0, limit);
    }
  };

  window.Predict = Predict;
})();
