/* Plausible misspellings for the orthographic-discrimination exercise.
 *
 * The point of that exercise is to judge the WRITTEN form, so a distractor has
 * to be one that sounds (near enough) the same and only looks wrong. "Wasser"
 * against "Waser" is a real decision; "Wasser" against "Wamper" is not — the
 * ear settles it and nothing about spelling gets practised.
 *
 * So the rules below are the ordinary German and English spelling traps:
 * single/double consonants, ss/ß, ie/i, silent h, umlaut spellings, v/f, and
 * adjacent-letter swaps. Letter substitutions that change the sound are only a
 * last resort when a word yields nothing better.
 */
(function () {

  function replaceOnce(word, from, to) {
    var i = word.indexOf(from);
    if (i < 0) return null;
    return word.slice(0, i) + to + word.slice(i + from.length);
  }

  /* Applies a rule anywhere but the first character where possible, so the
     word still starts recognisably. */
  function applyRule(word, from, to) {
    var lower = word.toLowerCase();
    var i = lower.indexOf(from, 1);
    if (i < 0) i = lower.indexOf(from);
    if (i < 0) return null;
    return word.slice(0, i) + to + word.slice(i + from.length);
  }

  var DE_RULES = [
    // doubled consonant collapsed: Wasser -> Waser
    ['ss', 's'], ['tt', 't'], ['ll', 'l'], ['nn', 'n'], ['mm', 'm'],
    ['ff', 'f'], ['pp', 'p'], ['rr', 'r'], ['ck', 'k'], ['tz', 'z'],
    // ß / ss confusion
    ['ß', 'ss'],
    // silent h dropped: Uhr -> Ur, Haar -> Har
    ['ah', 'a'], ['eh', 'e'], ['ih', 'i'], ['oh', 'o'], ['uh', 'u'],
    // long vowel written short and the other way round
    ['ie', 'i'], ['aa', 'a'], ['ee', 'e'], ['oo', 'o'],
    // umlaut spellings
    ['ä', 'e'], ['ö', 'o'], ['ü', 'u'], ['äu', 'eu'],
    // v/f, ei/ai, eu/oi — all homophone traps
    ['v', 'f'], ['ei', 'ai'], ['eu', 'oi'], ['chs', 'x']
  ];

  var EN_RULES = [
    ['ee', 'ea'], ['ea', 'ee'], ['ie', 'ei'], ['ei', 'ie'],
    ['ss', 's'], ['tt', 't'], ['ll', 'l'], ['nn', 'n'], ['ff', 'f'], ['pp', 'p'],
    ['ck', 'k'], ['ph', 'f'], ['kn', 'n'], ['wh', 'w'], ['gh', ''],
    ['ou', 'ow'], ['ow', 'ou'], ['er', 'ar'], ['ar', 'er'], ['or', 'er'],
    ['ce', 'se'], ['se', 'ce'], ['y', 'ey'], ['oa', 'o']
  ];

  /* Doubling a single consonant between vowels: Apfel -> Appfel */
  function doubleConsonant(word) {
    var m = /([aeiouäöü])([bdfgklmnprst])([aeiouäöü])/i.exec(word);
    if (!m) return null;
    var i = m.index + 1;
    return word.slice(0, i + 1) + word.charAt(i) + word.slice(i + 1);
  }

  /* Swap two adjacent letters away from the first and last position. */
  function transpose(word) {
    if (word.length < 5) return null;
    var i = Math.floor(word.length / 2);
    if (word.charAt(i) === word.charAt(i + 1)) i--;          // a swap you cannot see
    if (i < 1 || i + 1 >= word.length - 1) return null;
    return word.slice(0, i) + word.charAt(i + 1) + word.charAt(i) + word.slice(i + 2);
  }

  function looksSame(a, b) { return a.toLowerCase() === b.toLowerCase(); }

  /* Keep the original capitalisation: German nouns are capitalised, and a
     lowercase distractor would be wrong for a reason the exercise is not
     asking about. */
  function matchCase(original, candidate) {
    if (!candidate) return candidate;
    var first = original.charAt(0);
    if (first === first.toUpperCase() && first !== first.toLowerCase()) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
    return candidate.charAt(0).toLowerCase() + candidate.slice(1);
  }

  /* Three of the same letter in a row is not a spelling anyone would make. */
  function tripled(word) { return /(.)\1\1/i.test(word); }

  /* A "misspelling" that is itself a word in the vocabulary is a trap of a
     different kind, and an unfair one. */
  function isRealWord(cand) {
    if (!window.WORDS) return false;
    var lc = cand.toLowerCase();
    for (var i = 0; i < window.WORDS.length; i++) {
      var w = window.WORDS[i];
      if (w.de.w.toLowerCase() === lc || w.en.w.toLowerCase() === lc) return true;
    }
    return false;
  }

  /* Returns up to `n` distinct plausible misspellings of `word`. */
  function misspellings(word, lang, n) {
    n = n || 2;
    var rules = lang === 'en' ? EN_RULES : DE_RULES;
    var out = [];

    function add(cand) {
      if (!cand || cand.length < 2) return;
      cand = matchCase(word, cand);
      if (looksSame(cand, word)) return;
      if (tripled(cand)) return;
      if (isRealWord(cand)) return;
      for (var i = 0; i < out.length; i++) if (looksSame(out[i], cand)) return;
      out.push(cand);
    }

    rules.forEach(function (r) {
      if (out.length >= n) return;
      add(applyRule(word, r[0], r[1]));
    });
    if (out.length < n) add(doubleConsonant(word));
    if (out.length < n) add(transpose(word));

    // Last resort for short, regular words with no trap in them: drop a
    // middle letter. Still a spelling judgement, just a blunter one.
    if (out.length < n && word.length > 3) {
      var i = Math.floor(word.length / 2);
      add(word.slice(0, i) + word.slice(i + 1));
    }
    if (out.length < n && word.length > 3) {
      var j = Math.max(1, Math.floor(word.length / 3));
      add(word.slice(0, j) + word.charAt(j) + word.slice(j));
    }

    return out.slice(0, n);
  }

  /* A word only gets a spelling exercise if it yields enough plausible wrong
     forms. Short regular words like "Ei" or "bed" do not, and inventing
     nonsense for them would test nothing. */
  function isSuitable(word, lang) { return misspellings(word, lang, 2).length >= 2; }

  window.Spelling = { misspellings: misspellings, isSuitable: isSuitable, _replaceOnce: replaceOnce };
})();
