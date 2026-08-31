/* Text-to-speech.
 *
 * Deliberately non-essential: iOS Safari is known to hide installed German
 * voices from getVoices(), so every screen that speaks also shows the written
 * word. Speech is an aid, never the only channel.
 *
 * Three delivery modes, because repeating after a model is the actual exercise:
 *   speak()          — whole word or sentence
 *   speakSlow()      — same, clearly slower
 *   speakSequence()  — item by item (syllables, or sentence chunks) with a
 *                      real pause between them and a callback per item so the
 *                      screen can highlight what is being said right now.
 */
(function () {
  var synth = window.speechSynthesis || null;
  var voices = [];
  var listeners = [];
  var keepAlive = null;
  var seqToken = 0;

  var RATE = { normal: 0.92, slow: 0.62, syllable: 0.55 };

  function refresh() {
    if (!synth) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    listeners.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  if (synth) {
    refresh();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', refresh);
    else synth.onvoiceschanged = refresh;
    setTimeout(refresh, 400);
    setTimeout(refresh, 1500);
  }

  function forLang(lang) {
    var pref = lang === 'de' ? 'de' : 'en';
    return voices.filter(function (v) { return (v.lang || '').toLowerCase().indexOf(pref) === 0; });
  }

  /* Voice quality matters more here than in a normal app: the model utterance
   * is what she repeats. Two rules, in this order.
   *
   * 1. Hard-exclude the character/novelty voices. macOS ships a pile of them
   *    (Hysterical, Grandpa, Bubbles, Zarvox ...) in several languages, they
   *    are enumerated exactly like the real ones, and picking one hands a
   *    person practising speech a cartoon to imitate. Never usable here.
   * 2. Rank what is left: Premium/Enhanced/Neural builds first, then the
   *    known-good system voices per language, then everything else.
   */
  var NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|eddy|flo|good news|grandma|grandpa|hysterical|jester|junior|kathy|organ|princess|ralph|reed|rocko|sandy|shelley|superstar|trinoids|whisper|wobble|zarvox|fred|agnes|victoria|bruce|vicki|bahh)\b/i;
  var ROBOTIC = /eloquence|compact|espeak|pico/i;

  var GOOD = {
    de: /^(anna|petra|markus|helena|martin|viktor|yannick|google deutsch|microsoft (katja|hedda|stefan|conrad))/i,
    en: /^(samantha|ava|allison|susan|tom|alex|daniel|serena|kate|oliver|fiona|karen|moira|zoe|nicky|aaron|google (uk|us) english|microsoft (aria|guy|sonia|ryan|jenny))/i
  };

  function usable(v) {
    var n = (v.name || '').trim();
    if (NOVELTY.test(n)) return false;
    if (ROBOTIC.test(n) || ROBOTIC.test(v.voiceURI || '')) return false;
    return true;
  }

  function score(v, lang) {
    var n = (v.name || '') + ' ' + (v.voiceURI || '');
    var s = 0;
    if (/premium/i.test(n)) s += 70;
    if (/enhanced|neural|natural|wavenet|studio/i.test(n)) s += 60;
    if (/^google /i.test(v.name || '')) s += 45;
    if (GOOD[lang] && GOOD[lang].test((v.name || '').trim())) s += 35;
    if (/siri/i.test(n)) s += 25;
    if (lang === 'de' && /^de-DE/i.test(v.lang || '')) s += 20;
    if (lang === 'en' && /^en-(GB|US)/i.test(v.lang || '')) s += 20;
    if (v.localService) s += 8;   // offline matters, but only as a tiebreak
    if (v.default) s += 2;
    return s;
  }

  /* Ordered best-first, novelty voices dropped. Used by the settings picker
   * too, so the list she chooses from can never contain a joke voice. */
  function ranked(lang) {
    return forLang(lang).filter(usable).sort(function (a, b) { return score(b, lang) - score(a, lang); });
  }

  function pick(lang) {
    var list = ranked(lang);
    var wanted = (window.Store && window.Store.settings.voiceURI[lang]) || null;
    if (wanted) {
      // An explicit choice wins over the ranking — including a novelty voice,
      // if that is genuinely what someone picked.
      var hit = forLang(lang).filter(function (v) { return v.voiceURI === wanted; })[0];
      if (hit) return hit;
    }
    if (list.length) return list[0];
    return forLang(lang)[0] || null;   // last resort: better a joke than silence
  }

  /* Chrome stops synthesis after ~15 s of queued speech unless it is nudged. */
  function startKeepAlive() {
    stopKeepAlive();
    keepAlive = setInterval(function () {
      if (!synth) return stopKeepAlive();
      if (synth.speaking && !synth.paused) { try { synth.resume(); } catch (e) {} }
      else stopKeepAlive();
    }, 8000);
  }
  function stopKeepAlive() { if (keepAlive) { clearInterval(keepAlive); keepAlive = null; } }

  function utter(text, lang, rate) {
    var v = pick(lang);
    // A trailing space keeps engines that clip the final phoneme honest.
    var u = new window.SpeechSynthesisUtterance(String(text) + ' ');
    if (v) { u.voice = v; u.lang = v.lang; }
    else { u.lang = lang === 'de' ? 'de-DE' : 'en-GB'; }
    u.rate = Math.max(0.35, Math.min(1.3, rate));
    u.pitch = 1;
    u.volume = 1;
    return u;
  }

  function curLang(opts) {
    return (opts && opts.lang) || (window.Store ? window.Store.settings.lang : 'de') || 'de';
  }
  function userRate() {
    var r = window.Store ? window.Store.settings.rate : RATE.normal;
    return r || RATE.normal;
  }

  /* ---- Neural voice playback -------------------------------------------
   * When a Piper voice is installed, speech becomes an audio element rather
   * than a synthesis call. That buys three things: one known voice on every
   * platform, correct pronunciation, and — because the clip has a real
   * duration — exact syllable highlighting instead of an estimate. */
  var audio = null;
  var audioToken = 0;
  var unlocked = false;

  function el() {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
    }
    return audio;
  }

  /* iOS blocks the first playback that is not inside a user gesture. Prime a
   * silent element on the first touch so later automatic playback works. */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      var a = el();
      a.muted = true;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
      setTimeout(function () { try { a.pause(); a.muted = false; } catch (e) {} }, 40);
    } catch (e) {}
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, unlock, { once: true, passive: true });
  });

  function neural(lang) {
    return window.NeuralVoice && window.NeuralVoice.ready(lang) ? window.NeuralVoice : null;
  }

  function playUrl(url, rate, onStart, onEnd) {
    var my = ++audioToken;
    var a = el();
    try { a.pause(); } catch (e) {}
    a.src = url;
    a.playbackRate = Math.max(0.5, Math.min(1.4, rate || 1));
    if ('preservesPitch' in a) a.preservesPitch = true;
    a.onloadedmetadata = function () { if (my === audioToken && onStart) onStart(a.duration / a.playbackRate); };
    a.onended = function () { if (my === audioToken && onEnd) onEnd(); };
    a.onerror = function () { if (my === audioToken && onEnd) onEnd(); };
    var p = a.play();
    if (p && p.catch) p.catch(function () { if (my === audioToken && onEnd) onEnd(); });
    return my;
  }

  function stopAudio() {
    audioToken++;
    if (audio) { try { audio.pause(); } catch (e) {} }
  }

  /* The neural voice reads a Piper clip at its natural speed; the user's rate
   * setting maps onto playbackRate instead of a synthesiser rate. */
  function neuralRate(rate) {
    var base = userRate();       // 0.5 .. 0.92 from the settings screen
    var r = rate != null ? rate : base;
    // Piper is already deliberate; do not slow it as hard as a system voice.
    return Math.max(0.6, Math.min(1.15, 0.6 + r * 0.5));
  }

  function systemSpeak(text, opts) {
    if (!synth || !text) return false;
    opts = opts || {};
    seqToken++;
    try {
      synth.cancel();
      var u = utter(text, curLang(opts), opts.rate != null ? opts.rate : userRate());
      if (opts.onend) u.onend = opts.onend;
      // Some engines drop an utterance queued in the same tick as cancel().
      setTimeout(function () { synth.speak(u); startKeepAlive(); }, 30);
      return true;
    } catch (e) { return false; }
  }

  var Speech = {
    RATE: RATE,
    supported: function () { return !!synth; },
    voicesFor: ranked,
    allVoicesFor: forLang,
    available: function (lang) {
      if (window.NeuralVoice && window.NeuralVoice.ready(lang)) return true;
      return !!synth && forLang(lang).length > 0;
    },
    isNovelty: function (v) { return !usable(v); },
    onVoicesChanged: function (fn) { listeners.push(fn); },
    voiceName: function (lang) {
      if (window.NeuralVoice && window.NeuralVoice.ready(lang)) return window.NeuralVoice.voiceId(lang);
      var v = pick(lang); return v ? v.name : null;
    },

    speak: function (text, opts) {
      opts = opts || {};
      var lang = curLang(opts);
      var nv = neural(lang);
      if (nv) {
        seqToken++; stopAudio();
        nv.synth(text, lang).then(function (url) {
          if (url) playUrl(url, neuralRate(opts.rate), null, opts.onend);
          else systemSpeak(text, opts);
        });
        return true;
      }
      return systemSpeak(text, opts);
    },

    prefetch: function (texts, lang) {
      if (window.NeuralVoice) window.NeuralVoice.prefetch(texts, lang || curLang());
    },

    systemSpeak: function (text, opts) { return systemSpeak(text, opts); },

    speakSlow: function (text, opts) {
      opts = opts || {};
      var lang = curLang(opts);
      if (neural(lang)) return this.speak(text, { lang: lang, rate: 0.25, onend: opts.onend });
      opts.rate = Math.min(userRate(), RATE.slow);
      return this.speak(text, opts);
    },

    /* Speaks a word as ONE utterance but lights up its syllables in time.
     *
     * Why not speak the syllables separately: orthographic syllables are not
     * pronounceable fragments. German TTS reads "Ta-blet-te" in isolation as
     * [taː][blɛt][teː] — the final schwa becomes a full [eː] and the medial
     * fragment gets a hard stop, so the model utterance teaches a wrong
     * pronunciation. SSML <phoneme> with IPA would solve it, but the Web
     * Speech API ignores SSML in both Chrome and Safari, so it is not an
     * option here. Speaking the whole word slowly is always phonetically
     * correct; the highlight carries the segmentation instead.
     *
     * Piece timings are estimated from character counts against the measured
     * utterance duration — good enough to follow with the eye, and it can
     * never mispronounce anything. */
    speakTimed: function (text, pieces, opts) {
      opts = opts || {};
      var lang = curLang(opts);
      var nv = neural(lang);
      if (nv) {
        var mine = ++seqToken;
        stopAudio();
        var totalChars = pieces.reduce(function (a, p) { return a + p.length; }, 0) || 1;
        var tmr = [];
        nv.synth(text, lang).then(function (url) {
          if (mine !== seqToken) return;
          if (!url) return systemTimed(text, pieces, opts);
          playUrl(url, neuralRate(0.3), function (dur) {
            // Exact, because the clip length is known rather than estimated.
            var acc = 0;
            pieces.forEach(function (p, i) {
              var at = (acc / totalChars) * dur * 1000;
              tmr.push(setTimeout(function () { if (mine === seqToken && opts.onItem) opts.onItem(i); }, at));
              acc += p.length;
            });
          }, function () {
            tmr.forEach(clearTimeout);
            if (mine === seqToken && opts.onDone) opts.onDone();
          });
        });
        return true;
      }
      return systemTimed(text, pieces, opts);
    },

    speakSequence: function (items, opts) {
      opts = opts || {};
      var lang = curLang(opts);
      var nv = neural(lang);
      if (nv) {
        var mine = ++seqToken;
        stopAudio();
        var i = 0;
        var step = function () {
          if (mine !== seqToken) return;
          if (i >= items.length) { if (opts.onDone) opts.onDone(); return; }
          var idx = i++;
          if (opts.onItem) opts.onItem(idx);
          nv.synth(items[idx], lang).then(function (url) {
            if (mine !== seqToken) return;
            if (!url) return step();
            playUrl(url, neuralRate(0.4), null, function () {
              setTimeout(step, opts.gap != null ? opts.gap : 480);
            });
          });
        };
        step();
        return true;
      }
      return systemSequence(items, opts);
    },

    _systemTimed: function (text, pieces, opts) { return systemTimed(text, pieces, opts); },
    _systemSequence: function (items, opts) { return systemSequence(items, opts); },

    stop: function () {
      seqToken++;
      stopAudio();
      stopKeepAlive();
      if (synth) { try { synth.cancel(); } catch (e) {} }
    }
  };

  /* ---- system-voice implementations, used when no Piper voice is installed */
  function systemTimed(text, pieces, opts) {
      if (!synth || !text) return false;
      opts = opts || {};
      var my = ++seqToken;
      var lang = curLang(opts);
      var rate = opts.rate != null ? opts.rate : RATE.syllable;
      try { synth.cancel(); } catch (e) {}

      var total = pieces.reduce(function (a, p) { return a + p.length; }, 0) || 1;
      var timers = [];
      function clearTimers() { timers.forEach(clearTimeout); timers = []; }

      var u = utter(text, lang, rate);
      u.onstart = function () {
        if (my !== seqToken) return;
        // Rough but stable: ~95 ms per character at rate 1, scaled by rate.
        var perChar = 95 / Math.max(0.35, rate);
        var acc = 0;
        pieces.forEach(function (p, i) {
          var at = acc;
          timers.push(setTimeout(function () {
            if (my === seqToken && opts.onItem) opts.onItem(i);
          }, at));
          acc += p.length * perChar;
        });
      };
      u.onend = function () {
        clearTimers();
        if (my === seqToken && opts.onDone) opts.onDone();
      };
      u.onerror = function () { clearTimers(); if (my === seqToken && opts.onDone) opts.onDone(); };
      setTimeout(function () { if (my === seqToken) { synth.speak(u); startKeepAlive(); } }, 30);
      return true;
  }

  /* Speaks items one after another, waiting for each to finish and pausing in
   * between. Only safe where each item is itself a whole word or phrase — see
   * speakTimed above for why syllables are not. */
  function systemSequence(items, opts) {
      if (!synth || !items || !items.length) return false;
      opts = opts || {};
      var lang = curLang(opts);
      var rate = opts.rate != null ? opts.rate : RATE.syllable;
      var gap = opts.gap != null ? opts.gap : 420;
      var my = ++seqToken;
      try { synth.cancel(); } catch (e) {}

      function step(i) {
        if (my !== seqToken) return;                 // superseded by a newer call
        if (i >= items.length) {
          stopKeepAlive();
          if (opts.onDone) opts.onDone();
          return;
        }
        if (opts.onItem) opts.onItem(i);
        var u = utter(items[i], lang, rate);
        var advanced = false;
        function go() {
          if (advanced) return;
          advanced = true;
          setTimeout(function () { step(i + 1); }, gap);
        }
        u.onend = go;
        // Safety net: if the engine never fires onend (a known iOS quirk),
        // move on anyway after a length-scaled timeout.
        setTimeout(go, 1200 + String(items[i]).length * 130);
        try { synth.speak(u); startKeepAlive(); } catch (e) { go(); }
      }
      setTimeout(function () { step(0); }, 30);
      return true;
  }

  window.Speech = Speech;
})();
