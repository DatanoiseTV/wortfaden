/* Optional high-quality offline voice (Piper / VITS, run in the browser).
 *
 * Why this exists: the system voices are a lottery. macOS hands out novelty
 * voices, iOS Safari hides the good German ones from getVoices() entirely, and
 * what is left often mangles the very words this app is built to teach. Piper
 * gives one known, natural German voice on every platform.
 *
 * Cost, measured on this machine: 60.3 MB one-time download for
 * de_DE-thorsten-medium, ~650 ms to synthesise a word, and the model survives
 * a reload in the Origin Private File System (verified: no re-download).
 * The 650 ms is hidden by prefetching the target word when a task appears.
 *
 * Everything here is optional and degrades: without a network, without OPFS,
 * or on any error, the app falls straight back to the system voice.
 */
(function () {
  var MODULE = 'https://cdn.jsdelivr.net/npm/@diffusionstudio/vits-web@1.0.3/+esm';

  var VOICES = {
    de: [
      { id: 'de_DE-thorsten-medium', mb: 60, quality: 'good' },
      { id: 'de_DE-eva_k-x_low', mb: 20, quality: 'small' }
    ],
    en: [
      { id: 'en_GB-jenny_dioco-medium', mb: 60, quality: 'good' },
      { id: 'en_US-amy-low', mb: 60, quality: 'small' }
    ]
  };

  var mod = null;            // the lazily imported module
  var loading = null;
  var clips = {};            // "voice text" -> object URL, in-memory cache
  var clipOrder = [];
  var MAX_CLIPS = 120;
  var installing = false;

  function settings() { return window.Store.settings.neural || { enabled: false, de: null, en: null }; }

  function save(patch) {
    var cur = settings();
    var n = { enabled: cur.enabled, de: cur.de, en: cur.en };
    Object.keys(patch).forEach(function (k) { n[k] = patch[k]; });
    window.Store.set('settings.neural', n);
    return n;
  }

  function load() {
    if (mod) return Promise.resolve(mod);
    if (loading) return loading;
    loading = import(MODULE).then(function (m) { mod = m; return m; })
      .catch(function (e) { loading = null; throw e; });
    return loading;
  }

  function voiceFor(lang) {
    var s = settings();
    return s.enabled ? (s[lang] || null) : null;
  }

  function key(text, voice) { return voice + ' ' + text; }

  function remember(k, url) {
    clips[k] = url;
    clipOrder.push(k);
    while (clipOrder.length > MAX_CLIPS) {
      var old = clipOrder.shift();
      if (clips[old]) { URL.revokeObjectURL(clips[old]); delete clips[old]; }
    }
  }

  var NeuralVoice = {
    catalogue: function (lang) { return VOICES[lang] || []; },
    enabled: function () { return !!settings().enabled; },
    voiceId: voiceFor,

    /* True once a voice for this language is installed and switched on. */
    ready: function (lang) { return !!voiceFor(lang); },
    busy: function () { return installing; },

    installed: function () {
      return load().then(function (m) { return m.stored(); }).catch(function () { return []; });
    },

    /* Downloads the model, verifies it by synthesising once, then switches on. */
    install: function (lang, voiceId, onProgress) {
      if (installing) return Promise.reject(new Error('busy'));
      installing = true;
      return load().then(function (m) {
        return m.download(voiceId, function (p) {
          if (onProgress && p && p.total) onProgress(Math.round((p.loaded / p.total) * 100), p);
        }).then(function () {
          // Prove it actually works before promising it to anyone.
          return m.predict({ text: lang === 'de' ? 'Probe' : 'test', voiceId: voiceId });
        });
      }).then(function () {
        var patch = { enabled: true };
        patch[lang] = voiceId;
        save(patch);
        installing = false;
        return true;
      }).catch(function (e) {
        installing = false;
        throw e;
      });
    },

    remove: function (lang) {
      var v = settings()[lang];
      var patch = {};
      patch[lang] = null;
      var s = save(patch);
      if (!s.de && !s.en) save({ enabled: false });
      if (!v) return Promise.resolve();
      return load().then(function (m) { return m.remove(v); }).catch(function () {});
    },

    /* Returns an object URL for the spoken text, or null if unavailable. */
    synth: function (text, lang) {
      var voice = voiceFor(lang);
      if (!voice || !text) return Promise.resolve(null);
      var k = key(text, voice);
      if (clips[k]) return Promise.resolve(clips[k]);
      return load().then(function (m) {
        return m.predict({ text: String(text), voiceId: voice });
      }).then(function (blob) {
        var url = URL.createObjectURL(blob);
        remember(k, url);
        return url;
      }).catch(function () { return null; });
    },

    /* Fire and forget: warms the cache so the tap plays instantly. */
    prefetch: function (texts, lang) {
      if (!voiceFor(lang) || !texts) return;
      var list = Array.isArray(texts) ? texts : [texts];
      list.forEach(function (txt) { if (txt) NeuralVoice.synth(txt, lang); });
    }
  };

  window.NeuralVoice = NeuralVoice;
})();
