/* The training programme.
 *
 * A flat "practise whatever is due" queue is not a programme. This module
 * decides what a session contains, and it moves in one direction: a small
 * pool of high-value words practised by recognition, widening into free
 * naming as those words settle.
 *
 * Three things it guarantees:
 *   1. GRADED DIFFICULTY — exercise types unlock by stage, so nobody meets
 *      free naming on day one.
 *   2. REPETITION — every session revisits words from the previous ones,
 *      spaced by the Leitner box in Store.
 *   3. VARIATION — a word that came up as "pick the word" comes back as a
 *      sentence gap, then as cued naming. Repeating the same word in the same
 *      task teaches the task, not the word.
 *
 * Stages never go backwards. A hard day moves the pace, not the level.
 */
(function () {

  /* Teaching order. Front-loaded with what a person actually needs to ask for
   * in a hospital bed, then the everyday world outward from the room. */
  var ORDER = [
    'wasser', 'schmerz', 'bett', 'tablette', 'hand', 'aerztin', 'pflegerin', 'brot',
    'kaffee', 'brille', 'handy', 'mund', 'auge', 'ohr', 'fuss', 'haar',
    'suppe', 'apfel', 'tasse', 'loeffel', 'teller', 'messer', 'ei', 'kaese',
    'mutter', 'kind', 'freund', 'baby', 'tuer', 'fenster', 'stuhl', 'lampe',
    'haus', 'schluessel', 'uhr', 'seife', 'schuh', 'jacke', 'hose', 'socke',
    'hut', 'banane', 'kartoffel', 'salz', 'schokolade', 'pfanne', 'milch',
    'buch', 'zeitung', 'brief', 'geld', 'foto', 'musik', 'fernseher',
    'hund', 'katze', 'vogel', 'fisch', 'pferd', 'baum', 'blume', 'sonne',
    'regen', 'schnee', 'auto', 'zug', 'fahrrad', 'strasse', 'rollstuhl'
  ];

  var STAGES = 5;

  /* How many curriculum words are in play at each stage. The last stage holds
     the whole vocabulary. */
  function poolSize(stage) {
    if (stage >= STAGES) return ORDER.length;
    return Math.min(ORDER.length, 8 + (stage - 1) * 12);
  }

  /* What a stage is allowed to ask for. Each stage adds one demand. */
  function allowedTypes(stage) {
    var t = ['choose'];                        // recognition, always available
    if (stage >= 2) t.push('choose-cloze');    // recognition inside a sentence
    if (stage >= 3) t.push('name-cued');       // production with a free hint
    if (stage >= 3) t.push('features');        // describe, then name
    if (stage >= 4) t.push('name');            // free production
    if (stage >= 3) t.push('spell');           // written form
    if (stage >= 5) t.push('sound');           // syllables and first sounds
    return t;
  }

  function stage() {
    var s = window.Store.progress.stage || 1;
    return Math.max(1, Math.min(STAGES, s));
  }

  function curriculum() {
    var byId = {};
    window.WORDS.forEach(function (w) { byId[w.id] = w; });
    var out = [];
    ORDER.forEach(function (id) { if (byId[id]) out.push(byId[id]); });
    // Anything not named in ORDER still gets taught, just last.
    window.WORDS.forEach(function (w) { if (ORDER.indexOf(w.id) < 0) out.push(w); });
    return out;
  }

  function activePool() {
    return curriculum().slice(0, poolSize(stage()));
  }

  function personalWords() {
    return window.Store.mine.map(function (m) {
      return { isMine: true, id: m.id, word: m.word, hint: m.hint, photo: m.photo };
    });
  }

  /* A word counts as settled once it has been produced or recognised
   * unaided often enough to sit in box 2 or higher. */
  function settledShare(pool) {
    if (!pool.length) return 0;
    var n = 0;
    pool.forEach(function (w) { if (window.Store.wordStat(w.id).box >= 2) n++; });
    return n / pool.length;
  }

  /* Advance when the current pool is mostly settled and the person has not
   * been signalling overload. Called once at the end of a session. */
  function maybeAdvance() {
    var s = stage();
    if (s >= STAGES) return false;
    if (settledShare(activePool()) < 0.7) return false;

    var recent = window.Store.recentLoad(3);
    var strained = recent.filter(function (x) { return x.answer !== 'good'; }).length;
    if (recent.length >= 2 && strained >= 2) return false;   // not while it is hard

    window.Store.set('progress.stage', s + 1);
    return true;
  }

  /* Pick a task type for a word: allowed by the stage, harder than the word's
   * box only by one step, and different from last time where possible. */
  function typeFor(word, allowed) {
    var st = window.Store.wordStat(word.id);
    var ladder = ['choose', 'choose-cloze', 'name-cued', 'name'];
    var wanted = ladder[Math.min(ladder.length - 1, st.box)];

    var options = allowed.filter(function (x) { return ladder.indexOf(x) >= 0; });
    if (options.indexOf(wanted) < 0) {
      // Stage has not unlocked that rung yet: stay on the hardest it allows.
      wanted = options[options.length - 1] || 'choose';
    }
    // Variation: if the word arrived at the same task last time and a
    // neighbouring rung is open, use the neighbour instead.
    if (st.lastType === wanted) {
      var idx = ladder.indexOf(wanted);
      var alt = [ladder[idx - 1], ladder[idx + 1]].filter(function (x) {
        return x && options.indexOf(x) >= 0;
      });
      if (alt.length) wanted = alt[alt.length - 1];
    }

    // Personal words carry no feature set, no syllables, often no sentence.
    if (word.isMine) {
      if (wanted === 'choose-cloze' && !(word.hint && word.hint.indexOf('___') >= 0)) wanted = 'choose';
      if (wanted === 'features' || wanted === 'sound') wanted = 'name-cued';
    }
    return wanted;
  }

  function distractors(word, pool) {
    var box = window.Store.wordStat(word.id).box;
    // Easy at first: a different category is told apart by the picture alone.
    // Once settled, same-category options force a semantic decision.
    var sameCat = window.WORDS.filter(function (x) { return x.id !== word.id && x.cat === word.cat; });
    var otherCat = pool.filter(function (x) { return !x.isMine && x.id !== word.id && x.cat !== word.cat; });
    var source = box >= 2 && sameCat.length >= 2 ? sameCat : (otherCat.length >= 2 ? otherCat : window.WORDS);
    return window.UI.shuffle(source.filter(function (x) { return x.id !== word.id; })).slice(0, 2);
  }

  var Programme = {
    STAGES: STAGES,
    stage: stage,
    stageLabel: function () { return stage(); },
    poolSize: function () { return poolSize(stage()); },
    activePool: activePool,
    settledShare: function () { return settledShare(activePool()); },
    maybeAdvance: maybeAdvance,

    /* Builds one session. `count` overrides the length; `onlyType` is used by
     * nothing in the normal flow and exists for testing. */
    build: function (opts) {
      opts = opts || {};
      var st = stage();
      var allowed = allowedTypes(st);
      var n = { s: 6, m: 10, l: 14 }[window.Store.settings.sessionLen] || 10;
      if (window.Store.settings.gentlePace) n = Math.max(4, Math.ceil(n * 0.6));
      if (opts.count) n = opts.count;

      var steps = [];
      if (window.Store.shouldAskPain()) steps.push({ type: 'pain' });
      steps.push({ type: 'warmup', series: window.UI.pick(window.SERIES) });

      var wordSlots = Math.max(3, n - 2);
      var pool = activePool().concat(personalWords());

      // Never seen yet: at most two per session, so new material stays small.
      var fresh = pool.filter(function (w) { return window.Store.wordStat(w.id).seen === 0; });
      var review = window.Store.dueOrder(
        pool.filter(function (w) { return window.Store.wordStat(w.id).seen > 0; })
          .map(function (w) { return w.id; })
      );
      var byId = {};
      pool.forEach(function (w) { byId[w.id] = w; });

      var chosen = [];
      fresh.slice(0, 2).forEach(function (w) { chosen.push({ w: w, type: 'choose' }); });
      for (var i = 0; i < review.length && chosen.length < wordSlots; i++) {
        var w = byId[review[i]];
        if (!w) continue;
        var ty = typeFor(w, allowed);
        /* Slot in the two side exercises at a low rate. They are variety and
           a different route to the same word, not the backbone: describing
           before naming (features) and hearing the shape of the word (sound). */
        var settled = window.Store.wordStat(w.id).box >= 2;
        if (!w.isMine && settled && allowed.indexOf('features') >= 0 && chosen.length % 4 === 3) ty = 'features';
        else if (!w.isMine && settled && allowed.indexOf('sound') >= 0 && chosen.length % 5 === 4) ty = 'sound';
        else if (!w.isMine && settled && allowed.indexOf('spell') >= 0 && chosen.length % 3 === 2 &&
                 window.Spelling.isSuitable(w[window.UI.lang()].w, window.UI.lang())) ty = 'spell';
        chosen.push({ w: w, type: ty });
      }
      // Early days: the review list is short, so keep introducing.
      for (var j = 2; j < fresh.length && chosen.length < wordSlots; j++) {
        chosen.push({ w: fresh[j], type: 'choose' });
      }

      chosen.forEach(function (c) {
        var w = c.w, type = opts.onlyType || c.type;
        if (type === 'choose' || type === 'choose-cloze') {
          var isCloze = type === 'choose-cloze';
          if (isCloze) {
            var cl = w.isMine ? w.hint : w[window.UI.lang()].c;
            if (!cl || cl.indexOf('___') < 0) isCloze = false;
          }
          steps.push({
            type: 'choose', mode: isCloze ? 'cloze' : 'picture', word: w,
            options: distractors(w, pool).concat([w]), taskType: type
          });
        } else if (type === 'name-cued') {
          steps.push({ type: 'name', word: w, cued: true, taskType: type });
        } else if (type === 'name') {
          steps.push({ type: 'name', word: w, cued: false, taskType: type });
        } else if (type === 'features' && !w.isMine) {
          steps.push({ type: 'features', word: w, taskType: type });
        } else if (type === 'sound' && !w.isMine) {
          steps.push({ type: 'sound', word: w, taskType: type });
        } else if (type === 'spell' && !w.isMine) {
          steps.push({ type: 'spell', word: w, taskType: type });
        } else {
          steps.push({ type: 'name', word: w, cued: true, taskType: 'name-cued' });
        }
      });

      // Everyday sentences close every session: this is the part that has to
      // reach conversation, and it never does if it is optional.
      var phraseCount = st >= 3 ? 2 : 1;
      window.UI.shuffle(window.PHRASES).slice(0, phraseCount).forEach(function (p) {
        steps.push({ type: 'phrase', phrase: p });
      });
      return steps;
    }
  };

  window.Programme = Programme;
})();
