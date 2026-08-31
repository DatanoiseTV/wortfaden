/* Local-only persistence. Nothing leaves the device.
 * Every read/write is guarded: private-mode Safari and blocked site data
 * make localStorage throw on access, and the app must still run. */
(function () {
  var KEY = 'wortfaden.v1';

  var DEFAULTS = {
    settings: {
      lang: null,            // null = decide from navigator.language on first run
      textSize: 'm',         // s | m | l | xl
      theme: 'auto',         // auto | light | dark
      contrast: false,
      reduceMotion: false,
      voiceURI: { de: null, en: null },
      rate: 0.85,            // slower than default: easier to follow and to shadow
      sessionLen: 'm',       // s | m | l
      gentlePace: false,     // set by the in-session load check
      checkIn: true,         // ask "is the pace ok?" during a session
      checkEvery: 4,         // ... every N steps
      painAsk: 'some',       // off | some | always
      pinHash: null,         // soft lock for the review area (see README: NOT security)
      name: '',              // first name, used only for the greeting
      partner: '',           // who visits: lets the board say a real name
      onboarded: false,
      mode: 'both',          // both | board | training — set at setup by whoever helps
      lockSettings: false,   // hide settings behind the PIN
      keyboard: 'qwertz',    // qwertz | abc — the on-screen keyboard layout
      neural: { enabled: false, de: null, en: null }   // optional offline Piper voice
    },
    progress: { words: {}, days: {}, totalWords: 0, stage: 1, sessions: 0 },
    wellbeing: [],           // { ts, pain, where[], energy, note }
    saidLog: [],             // every phrase spoken on the communication board
    load: [],                // { ts, answer } from the in-session pace check
    mine: []
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, add) {
    var out = clone(base);
    Object.keys(add || {}).forEach(function (k) {
      if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k]) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
        out[k] = merge(out[k], add[k]);
      } else if (add[k] !== undefined) {
        out[k] = add[k];
      }
    });
    return out;
  }

  // Non-cryptographic fallback for environments without crypto.subtle.
  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16);
  }

  var state = clone(DEFAULTS);
  var writable = true;

  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) state = merge(DEFAULTS, JSON.parse(raw));
  } catch (e) {
    writable = false;
  }

  var pending = null;
  function persist() {
    if (!writable) return;
    if (pending) clearTimeout(pending);
    pending = setTimeout(function () {
      pending = null;
      try {
        window.localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        writable = false; // quota or blocked; keep running from memory
      }
    }, 150);
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var Store = {
    get settings() { return state.settings; },
    get progress() { return state.progress; },
    get mine() { return state.mine; },
    get wellbeing() { return state.wellbeing; },
    get saidLog() { return state.saidLog; },
    isPersistent: function () { return writable; },

    set: function (path, value) {
      var parts = path.split('.'), node = state;
      for (var i = 0; i < parts.length - 1; i++) node = node[parts[i]];
      node[parts[parts.length - 1]] = value;
      persist();
    },

    /* --- Leitner spaced repetition -------------------------------------
     * box 0..4. "Said it" promotes, "with help" holds, "not yet" steps back
     * one box only — never to zero, so a hard day cannot undo a week. */
    recordAttempt: function (wordId, outcome, taskType) {
      var w = state.progress.words[wordId] || { box: 0, seen: 0, ok: 0, last: 0, lastType: null };
      if (taskType) w.lastType = taskType;
      w.seen += 1;
      w.last = Date.now();
      if (outcome === 'yes') { w.box = Math.min(4, w.box + 1); w.ok += 1; }
      else if (outcome === 'not') { w.box = Math.max(0, w.box - 1); }
      state.progress.words[wordId] = w;

      var d = today();
      state.progress.days[d] = (state.progress.days[d] || 0) + 1;
      state.progress.totalWords += 1;
      persist();
    },

    wordStat: function (wordId) {
      return state.progress.words[wordId] || { box: 0, seen: 0, ok: 0, last: 0, lastType: null };
    },

    /* Lowest box first, oldest first inside a box. Unseen words rank as box 0
     * with last = 0, so new material naturally leads. */
    dueOrder: function (ids) {
      var self = this;
      return ids.slice().sort(function (a, b) {
        var A = self.wordStat(a), B = self.wordStat(b);
        if (A.box !== B.box) return A.box - B.box;
        return A.last - B.last;
      });
    },

    todayCount: function () { return state.progress.days[today()] || 0; },

    daysPracticed: function () { return Object.keys(state.progress.days).length; },

    streak: function () {
      var n = 0, d = new Date();
      for (;;) {
        var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        if (state.progress.days[key]) { n++; d.setDate(d.getDate() - 1); }
        else if (n === 0) { d.setDate(d.getDate() - 1); if (n === 0 && key !== today()) break; }
        else break;
        if (n > 3650) break;
      }
      return n;
    },

    addMine: function (entry) {
      entry.id = 'mine_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      entry.created = Date.now();
      state.mine.push(entry);
      persist();
      return entry.id;
    },
    updateMine: function (id, patch) {
      var e = state.mine.filter(function (x) { return x.id === id; })[0];
      if (e) { Object.keys(patch).forEach(function (k) { e[k] = patch[k]; }); persist(); }
    },
    removeMine: function (id) {
      state.mine = state.mine.filter(function (x) { return x.id !== id; });
      delete state.progress.words[id];
      persist();
    },

    /* --- Load / fatigue adaptation ------------------------------------
     * Rationale: in the acute phase, dose is the limiting factor, not content
     * (VERSE trial). The app therefore asks and then actually acts on it. */
    recordLoad: function (answer) {          // 'good' | 'much' | 'stop'
      state.load.push({ ts: Date.now(), answer: answer });
      if (state.load.length > 200) state.load = state.load.slice(-200);
      if (answer === 'much' || answer === 'stop') state.settings.gentlePace = true;
      persist();
    },
    /* Three straight "feels good" answers earn the normal pace back. */
    recentLoad: function (n) { return state.load.slice(-(n || 3)); },
    maybeRelaxPace: function () {
      var last = state.load.slice(-3);
      if (last.length === 3 && last.every(function (x) { return x.answer === 'good'; })) {
        state.settings.gentlePace = false;
        persist();
        return true;
      }
      return false;
    },

    /* --- Communication log ----------------------------------------------
     * Everything said on the board, with a timestamp. It is the only record
     * of what someone who cannot speak actually asked for, which makes it
     * genuinely useful on a ward round — and genuinely sensitive. It stays on
     * the device and sits behind the review PIN. */
    logSaid: function (text, src) {
      if (!text) return;
      state.saidLog.push({ ts: Date.now(), text: String(text).slice(0, 200), src: src || 'tile' });
      if (state.saidLog.length > 800) state.saidLog = state.saidLog.slice(-800);
      persist();
    },
    clearSaidLog: function () { state.saidLog = []; persist(); },

    /* --- Wellbeing log -------------------------------------------------- */
    addWellbeing: function (entry) {
      entry.ts = Date.now();
      entry.id = 'wb_' + entry.ts.toString(36);
      state.wellbeing.push(entry);
      if (state.wellbeing.length > 1000) state.wellbeing = state.wellbeing.slice(-1000);
      persist();
      return entry.id;
    },
    removeWellbeing: function (id) {
      state.wellbeing = state.wellbeing.filter(function (x) { return x.id !== id; });
      persist();
    },
    lastWellbeing: function () {
      return state.wellbeing.length ? state.wellbeing[state.wellbeing.length - 1] : null;
    },
    /* Ask at most once every four hours so it never turns into nagging. */
    shouldAskPain: function () {
      var mode = state.settings.painAsk;
      if (mode === 'off') return false;
      var last = this.lastWellbeing();
      if (!last) return true;
      var hours = (Date.now() - last.ts) / 3600000;
      return mode === 'always' ? hours > 1 : hours > 4;
    },

    /* --- Review-area soft lock ------------------------------------------
     * This is a privacy screen, not security: the data sits unencrypted in
     * localStorage and anyone with the device can read it. Its job is to keep
     * error rates and statistics out of the practising person's way. */
    hashPin: function (pin) {
      var text = 'wortfaden::' + String(pin);
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
          return Array.prototype.map.call(new Uint8Array(buf), function (b) {
            return b.toString(16).padStart(2, '0');
          }).join('');
        }).catch(function () { return 'fnv:' + fnv(text); });
      }
      return Promise.resolve('fnv:' + fnv(text));
    },
    hasPin: function () { return !!state.settings.pinHash; },
    setPin: function (pin) {
      var self = this;
      return this.hashPin(pin).then(function (h) { state.settings.pinHash = h; persist(); return true; });
    },
    checkPin: function (pin) {
      var stored = state.settings.pinHash;
      if (!stored) return Promise.resolve(false);
      return this.hashPin(pin).then(function (h) { return h === stored; });
    },
    clearPin: function () { state.settings.pinHash = null; persist(); },

    exportJSON: function () { return JSON.stringify(state, null, 2); },
    importJSON: function (text) {
      var incoming = JSON.parse(text);
      if (!incoming || typeof incoming !== 'object' || !incoming.settings || !incoming.progress) {
        throw new Error('shape');
      }
      state = merge(DEFAULTS, incoming);
      persist();
    },
    reset: function () {
      state = clone(DEFAULTS);
      try { window.localStorage.removeItem(KEY); } catch (e) {}
    }
  };

  window.Store = Store;
})();
