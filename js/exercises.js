/* Exercise runners.
 *
 * Design rule that overrides everything else here: ONE question per screen,
 * a visible way to answer it, and the word always shown and spoken at the end.
 * An open demand with no resolution ("say the word" — and nothing else happens)
 * is the single most stressful thing a naming app can do, so it does not exist
 * in this file. Free naming is always the LAST rung of a ladder that starts
 * with recognition.
 *
 * The ladder is driven by the Leitner box of each word:
 *   box 0-1  choose      picture + three words        (recognition, always winnable)
 *   box 2    choose      sentence gap + three words   (recognition in context)
 *   box 3    name (cued) picture, one hint on tap
 *   box 4    name (free) picture, hints only if asked
 *
 * Each builder returns { el, cleanup } and calls ctx.done(outcome) when
 * finished. outcome is 'yes' | 'help' | 'not' | null.
 */
(function () {
  var h = window.UI.h, t = window.UI.t;

  /* Normalise built-in and personal words into one shape. */
  function norm(word, lang) {
    if (word.isMine) {
      return {
        id: word.id, mine: true, glyph: '⭐', photo: word.photo || null,
        w: word.word, article: '', syll: null,
        cloze: word.hint && word.hint.indexOf('___') >= 0 ? word.hint : null,
        hint: word.hint || null, feats: null, rhyme: null, translation: null, cat: 'mine'
      };
    }
    var d = word[lang], o = word[lang === 'de' ? 'en' : 'de'];
    return {
      id: word.id, mine: false, glyph: word.emoji, photo: null,
      w: d.w, article: d.a, syll: d.s, cloze: d.c, hint: null,
      feats: d.f, rhyme: d.r || null, translation: o.w, cat: word.cat
    };
  }

  function pictureEl(item, cls) {
    if (item.photo) return h('div', { class: 'picture ' + (cls || '') }, h('img', { src: item.photo, alt: '' }));
    return h('div', { class: 'picture ' + (cls || '') }, h('span', { class: 'glyph', 'aria-hidden': 'true' }, item.glyph));
  }

  function hasVoice() { return window.Speech.available(window.UI.lang()); }

  /* The neural voice needs ~650 ms per word. Warming it while the person is
     still reading the task makes the tap feel instant. */
  function warm(texts) { window.Speech.prefetch(texts, window.UI.lang()); }

  /* One quiet listen button for use during a task. */
  function listenBtn(text, label) {
    if (!hasVoice()) return null;
    return h('button', {
      class: 'btn btn-outline', type: 'button',
      onclick: function () { window.Speech.speak(text); }
    }, h('span', { 'aria-hidden': 'true' }, '🔊'), label || t('listen'));
  }

  /* The full speech help. Only appears once the word is on screen, because
   * that is the moment repeating after a model is actually possible. */
  function speechHelp(text, opts) {
    if (!hasVoice()) return null;
    opts = opts || {};
    var pieces = opts.pieces && opts.pieces.length > 1 ? opts.pieces : null;
    var strip = h('div', { class: 'chunks hidden' });
    var hint = h('p', { class: 'hint hidden' }, opts.pieceHint || t('syll_hint'));
    if (pieces) pieces.forEach(function (p) { strip.appendChild(h('span', { class: 'chunk' }, p)); });

    function light(i) {
      Array.prototype.forEach.call(strip.children, function (c, idx) { c.classList.toggle('on', idx === i); });
    }
    function plain() { strip.classList.add('hidden'); hint.classList.add('hidden'); }

    return h('div', { class: 'stack-sm' },
      h('div', { class: 'btn-row', role: 'group', 'aria-label': t('speech_help') },
        h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { plain(); window.Speech.speak(text); } },
          h('span', { 'aria-hidden': 'true' }, '🔊'), t('listen')),
        h('button', {
          class: 'btn btn-outline', type: 'button',
          onclick: function () {
            if (pieces) { strip.classList.remove('hidden'); hint.classList.remove('hidden'); }
            if (opts.wholeWords) {
              // Chunks are whole words, so speaking them apart is safe.
              window.Speech.speakSequence(pieces, {
                gap: opts.gap || 560, onItem: light,
                onDone: function () { setTimeout(function () { light(-1); }, 500); }
              });
            } else if (pieces) {
              window.Speech.speakTimed(text, pieces, {
                onItem: light, onDone: function () { setTimeout(function () { light(-1); }, 400); }
              });
            } else {
              window.Speech.speakSlow(text);
            }
          }
        }, h('span', { 'aria-hidden': 'true' }, '🐢'), pieces ? (opts.pieceLabel || t('listen_syll')) : t('listen_slow'))),
      strip, hint);
  }

  /* The closing panel every item ends on: the word, large, spoken, with the
   * speech help — and exactly one way forward, pinned to the bottom edge.
   * `footer` replaces the single Next button where an outcome is asked for. */
  function answerPanel(item, footer) {
    if (hasVoice()) window.Speech.speak(item.w);
    return h('div', { class: 'answerwrap' },
      h('div', { class: 'card answer' },
        h('div', { class: 'eyebrow' }, t('answer_is')),
        h('div', { class: 'answer-word' },
          item.article ? h('span', { class: 'article' }, item.article + ' ') : null,
          h('strong', {}, item.w)),
        item.syll && item.syll.length > 1 ? h('div', { class: 'syll' }, item.syll.join(' \u00b7 ')) : null,
        speechHelp(item.w, { pieces: item.syll })),
      h('div', { class: 'actions' }, footer));
  }

  function nextButton(onNext) {
    return h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: onNext },
      t('weiter'), h('span', { 'aria-hidden': 'true' }, ' \u2192'));
  }

  /* ---------- Recognition: pick the word ---------- */
  function choose(step, ctx) {
    var lang = window.UI.lang();
    var item = norm(step.word, lang);
    var opts = window.UI.shuffle(step.options.map(function (w) { return norm(w, lang); }));
    var tries = 0, settled = false;

    var host = h('div', { class: 'exercise' });
    warm([item.w].concat(opts.map(function (o) { return o.w; })));
    var isCloze = step.mode === 'cloze' && item.cloze;
    var parts = isCloze ? item.cloze.split('___') : null;

    var grid = h('div', { class: 'wordchoices' });
    opts.forEach(function (o) {
      var btn = h('button', {
        class: 'wordchoice', type: 'button',
        onclick: function () {
          if (settled) return;
          tries++;
          if (o.id === item.id) {
            settled = true;
            btn.classList.add('is-right');
            Array.prototype.forEach.call(grid.children, function (c) { c.disabled = true; if (c !== btn) c.classList.add('is-off'); });
            window.UI.announce(t('match_correct') + ' ' + item.w);
            window.Store.recordAttempt(item.id, tries === 1 ? 'yes' : 'help');
            setTimeout(function () {
              window.UI.clear(host);
              host.appendChild(pictureEl(item, 'small'));
              host.appendChild(answerPanel(item, nextButton(function () { ctx.done(tries === 1 ? 'yes' : 'help'); })));
            }, 550);
          } else {
            btn.classList.add('is-off');
            btn.disabled = true;
            window.UI.announce(t('match_try'));
          }
        }
      }, o.w);
      grid.appendChild(btn);
    });

    host.appendChild(h('p', { class: 'prompt' }, isCloze ? t('choose_cloze_q') : t('choose_q')));
    if (isCloze) {
      host.appendChild(pictureEl(item, 'small'));
      host.appendChild(h('p', { class: 'cloze' }, parts[0], h('span', { class: 'slot' }), parts[1] || ''));
    } else {
      host.appendChild(pictureEl(item));
    }
    host.appendChild(grid);
    return { el: host };
  }

  /* ---------- Production: say it, then see it ---------- */
  function name(step, ctx) {
    var lang = window.UI.lang();
    var item = norm(step.word, lang);
    var host = h('div', { class: 'exercise' });
    warm([item.w]);

    /* Cues, weakest first. Shown ONE at a time, replacing the previous one —
     * a growing stack of hint cards is its own kind of pressure. */
    var cues = [];
    if (item.feats) cues.push({ l: t('cue_fn'), b: item.feats.fn });
    if (item.cloze) cues.push({ l: t('cue_cloze'), b: item.cloze.replace('___', '…') });
    else if (item.hint) cues.push({ l: t('cue_cloze'), b: item.hint });
    cues.push({ l: t('cue_letter'), b: item.w.charAt(0).toUpperCase() + '…', big: true });
    if (item.translation) cues.push({ l: t('cue_translation'), b: item.translation });

    var shown = -1;
    var cueHost = h('div', {});
    var hintBtn = h('button', {
      class: 'btn btn-outline btn-block', type: 'button',
      onclick: function () {
        shown++;
        if (shown >= cues.length) { hintBtn.disabled = true; return; }
        var c = cues[shown];
        window.UI.clear(cueHost).appendChild(h('div', { class: 'cue' },
          h('div', { class: 'cue-label' }, c.l),
          h('div', { class: c.big ? 'cue-letter' : 'cue-body' }, c.b)));
        window.UI.announce(c.l + ': ' + c.b);
        hintBtn.lastChild.textContent = t('hint_more');
        if (shown >= cues.length - 1) hintBtn.disabled = true;
      }
    }, h('span', { 'aria-hidden': 'true' }, '💡'), t('hint_btn'));

    function reveal(usedHint) {
      window.UI.clear(host);
      host.appendChild(pictureEl(item, 'small'));
      host.appendChild(answerPanel(item, h('div', { class: 'stack-sm' },
        h('p', { class: 'prompt center', style: { margin: '0' } }, t('rate_q')),
        h('div', { class: 'btn-row' },
          h('button', {
            class: 'btn btn-calm btn-big', type: 'button',
            onclick: function () { window.Store.recordAttempt(item.id, usedHint ? 'help' : 'yes'); ctx.done('yes'); }
          }, h('span', { 'aria-hidden': 'true' }, '\u2713'), t('got_it')),
          h('button', {
            class: 'btn btn-outline btn-big', type: 'button',
            onclick: function () { window.Store.recordAttempt(item.id, 'not'); ctx.done('not'); }
          }, h('span', { 'aria-hidden': 'true' }, '\ud83c\udf31'), t('was_hard'))))));
    }

    host.appendChild(h('p', { class: 'prompt' }, t('say_now')));
    host.appendChild(pictureEl(item));
    host.appendChild(cueHost);
    host.appendChild(h('div', { class: 'actions stack-sm' },
      hintBtn,
      h('button', {
        class: 'btn btn-primary btn-block btn-big', type: 'button',
        onclick: function () { reveal(shown >= 0); }
      }, h('span', { 'aria-hidden': 'true' }, '👁️'), t('reveal_word'))));

    if (step.cued) hintBtn.click();   // the cued rung hands out the first hint for free
    return { el: host };
  }

  /* ---------- Semantic features, read rather than quizzed ---------- */
  function features(step, ctx) {
    var lang = window.UI.lang();
    var item = norm(step.word, lang);
    var qs = [
      { q: t('sfa_k'), a: item.feats.k },
      { q: t('sfa_fn'), a: item.feats.fn },
      { q: t('sfa_o'), a: item.feats.o }
    ];
    var i = 0;
    var host = h('div', { class: 'exercise' });
    warm([item.w].concat(qs.map(function (q) { return q.a; })));
    var card = h('div', { class: 'card scrollbox' });
    var btn = h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: step_ },
      t('weiter'), h('span', { 'aria-hidden': 'true' }, '→'));

    function step_() {
      if (i >= qs.length) {
        window.UI.clear(host);
        host.appendChild(pictureEl(item, 'small'));
        host.appendChild(h('p', { class: 'prompt' }, t('sfa_now_name')));
        host.appendChild(answerPanel(item, nextButton(function () {
          window.Store.recordAttempt(item.id, 'help');
          ctx.done('help');
        })));
        return;
      }
      var q = qs[i]; i++;
      window.UI.clear(card);
      card.appendChild(h('div', { class: 'eyebrow' }, t('hint_label', { n: i, total: qs.length })));
      card.appendChild(h('p', { class: 'prompt', style: { marginBottom: '.4rem' } }, q.q));
      card.appendChild(h('p', { class: 'answer-word', style: { fontSize: '1.4rem' } }, q.a));
      window.UI.announce(q.q + ' ' + q.a);
    }

    host.appendChild(pictureEl(item, 'small'));
    host.appendChild(card);
    host.appendChild(h('div', { class: 'actions' }, btn));
    step_();
    return { el: host };
  }

  /* ---------- Sounds and syllables (free choice only) ---------- */
  function sound(step, ctx) {
    var lang = window.UI.lang();
    var item = norm(step.word, lang);
    var target = item.syll ? item.syll.length : 1;
    var taps = 0;
    var host = h('div', { class: 'exercise' });
    warm([item.w]);

    var beads = h('div', { class: 'beads' });
    for (var i = 0; i < Math.max(4, target + 1); i++) beads.appendChild(h('span', { class: 'bead', 'aria-hidden': 'true' }, String(i + 1)));

    var tapBtn = h('button', {
      class: 'btn btn-primary btn-block btn-big', type: 'button',
      onclick: function () {
        taps++;
        Array.prototype.forEach.call(beads.children, function (b, idx) { b.classList.toggle('on', idx < taps); });
        if (taps >= target) {
          tapBtn.disabled = true;
          window.UI.clear(host);
          host.appendChild(pictureEl(item, 'small'));
          host.appendChild(answerPanel(item, nextButton(function () {
            window.Store.recordAttempt(item.id, 'help');
            ctx.done('help');
          })));
        }
      }
    }, h('span', { 'aria-hidden': 'true' }, '👏'), t('sound_syll_tap'));

    host.appendChild(h('p', { class: 'prompt' }, t('sound_syll_q')));
    host.appendChild(pictureEl(item, 'small'));
    var lb = listenBtn(item.w);
    if (lb) host.appendChild(h('div', { class: 'btn-row' }, lb));
    host.appendChild(beads);
    host.appendChild(h('div', { class: 'actions' }, tapBtn));
    return { el: host };
  }

  /* ---------- Automatic series ---------- */
  function warmup(step, ctx) {
    var lang = window.UI.lang();
    var s = step.series[lang];
    var i = 0;
    warm(s.items);
    var list = h('div', { class: 'serieslist scrollbox' });
    s.items.forEach(function (item, idx) {
      list.appendChild(h('span', { class: 'seriesitem' + (idx === 0 ? ' now' : '') }, item));
    });

    var nextBtn = h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: advance },
      t('weiter'), h('span', { 'aria-hidden': 'true' }, '→'));

    function advance() {
      if (i < s.items.length && hasVoice()) window.Speech.speak(s.items[i]);
      i++;
      Array.prototype.forEach.call(list.children, function (c, idx) {
        c.classList.toggle('now', idx === i);
        c.classList.toggle('past', idx < i);
      });
      if (i >= s.items.length) {
        nextBtn.disabled = true;
        window.UI.announce(t('series_finished'));
        setTimeout(function () { ctx.done(null); }, 500);
      }
    }

    return {
      el: h('div', { class: 'exercise' },
        h('h2', { text: s.t }),
        h('p', { class: 'prompt', text: t('warmup_prompt') }),
        list,
        h('div', { class: 'actions stack-sm' },
          nextBtn,
          h('button', { class: 'btn btn-quiet btn-block', type: 'button', onclick: function () { ctx.done(null); } }, t('done'))))
    };
  }

  /* ---------- Everyday phrases ---------- */
  function phrase(step, ctx) {
    var lang = window.UI.lang();
    var p = step.phrase[lang];
    warm([p.t].concat(p.p));

    /* The sentence IS the highlight strip: one element instead of two, and
       the eye stays on the real sentence rather than on a copy of it. */
    var line = h('p', { class: 'phraseline' });
    p.p.forEach(function (c, i) {
      if (i) line.appendChild(document.createTextNode(' '));
      line.appendChild(h('span', { class: 'pw' }, c));
    });
    function light(i) {
      var spans = line.querySelectorAll('.pw');
      Array.prototype.forEach.call(spans, function (c, idx) { c.classList.toggle('on', idx === i); });
    }

    var rec = null, buf = [], url = null;
    var recBtn = null, playBtn = null;
    if (navigator.mediaDevices && window.MediaRecorder) {
      playBtn = h('button', {
        class: 'btn btn-quiet btn-icon hidden', type: 'button', 'aria-label': t('phrase_play'),
        onclick: function () { if (url) new Audio(url).play(); }
      }, h('span', { 'aria-hidden': 'true' }, '🎧'));
      recBtn = h('button', {
        class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('phrase_record'),
        onclick: function () {
          if (rec && rec.state === 'recording') { stopRec(); return; }
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            buf = [];
            rec = new window.MediaRecorder(stream);
            rec.ondataavailable = function (e) { if (e.data && e.data.size) buf.push(e.data); };
            rec.onstop = function () {
              stream.getTracks().forEach(function (tr) { tr.stop(); });
              if (url) URL.revokeObjectURL(url);
              url = URL.createObjectURL(new Blob(buf, { type: rec.mimeType || 'audio/webm' }));
              playBtn.classList.remove('hidden');
              recBtn.firstChild.textContent = '🎙️';
            };
            rec.start();
            recBtn.firstChild.textContent = '⏹';
          }).catch(function () { window.UI.toast(t('phrase_recDenied')); });
        }
      }, h('span', { 'aria-hidden': 'true' }, '🎙️'));
    }
    function stopRec() { try { if (rec && rec.state === 'recording') rec.stop(); } catch (e) {} }

    return {
      el: h('div', { class: 'exercise' },
        h('div', { class: 'eyebrow' }, window.PHRASE_GROUPS[lang][step.phrase.grp] || ''),
        h('p', { class: 'prompt', text: t('say_phrase') }),
        h('div', { class: 'phrasebox' }, line),
        h('div', { class: 'actions stack-sm' },
          h('div', { class: 'btn-row' },
            hasVoice() ? h('button', {
              class: 'btn btn-outline', type: 'button',
              onclick: function () {
                window.Speech.speakSequence(p.p, {
                  gap: 620, onItem: light,
                  onDone: function () { setTimeout(function () { light(-1); }, 600); }
                });
              }
            }, h('span', { 'aria-hidden': 'true' }, '🔊'), t('phrase_listen')) : null,
            recBtn, playBtn),
          h('button', {
            class: 'btn btn-primary btn-block btn-big', type: 'button',
            onclick: function () { stopRec(); ctx.done('yes'); }
          }, t('weiter'), h('span', { 'aria-hidden': 'true' }, '→')))),
      cleanup: function () { stopRec(); if (url) URL.revokeObjectURL(url); }
    };
  }

  window.Exercises = {
    norm: norm,
    build: function (step, ctx) {
      switch (step.type) {
        case 'choose': return choose(step, ctx);
        case 'name': return name(step, ctx);
        case 'features': return features(step, ctx);
        case 'sound': return sound(step, ctx);
        case 'warmup': return warmup(step, ctx);
        case 'phrase': return phrase(step, ctx);
        default: return { el: h('p', { text: '…' }) };
      }
    }
  };
})();
