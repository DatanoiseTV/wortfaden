/* Router, screens and the session engine.
 *
 * Layout contract: the shell owns the viewport. During a session `main` gets
 * the `is-task` class and does not scroll — the whole task must be visible at
 * once. Session chrome (progress, pause, close) lives in the top bar so the
 * task area stays free of navigation.
 */
(function () {
  var h = window.UI.h, t = window.UI.t, clear = window.UI.clear;
  var VERSION = '1.0.0';

  var main = document.getElementById('main');
  var actions = document.getElementById('topbarActions');
  var topbar = document.querySelector('.topbar');
  var brandSlot = document.getElementById('brandSlot');

  var current = { name: 'home', params: null, cleanup: null };
  var session = null;   // live session state, so the chrome can show progress

  function go(name, params) {
    if (current.cleanup) { try { current.cleanup(); } catch (e) {} }
    window.Speech.stop();
    if (name !== 'session') session = null;
    current = { name: name, params: params || null, cleanup: null };
    render();
    main.focus();
    main.scrollTop = 0;
  }

  function render() {
    window.UI.applySettings();
    clear(main);
    renderChrome();
    var screen = Screens[current.name] || Screens.home;
    var out = screen(current.params || {});
    if (out && out.nodeType) main.appendChild(out);
    else if (out && out.el) { main.appendChild(out.el); current.cleanup = out.cleanup || null; }
  }

  function renderChrome() {
    var inTask = current.name === 'session';
    var bare = current.name === 'onboarding';
    var fixed = inTask || bare || current.name === 'board';
    clear(actions);
    clear(brandSlot);
    topbar.classList.toggle('is-task', inTask);
    topbar.classList.toggle('hidden', bare);
    main.classList.toggle('is-task', fixed);

    if (inTask) {
      if (session) {
        brandSlot.appendChild(h('div', {
          class: 'progress-track', role: 'progressbar',
          'aria-valuemin': '0', 'aria-valuemax': String(session.total), 'aria-valuenow': String(session.at),
          'aria-label': t('session_stepOf', { n: session.at + 1, total: session.total })
        }, h('div', { class: 'progress-fill', style: { width: Math.round((session.at / Math.max(1, session.total)) * 100) + '%' } })));
      }
      actions.appendChild(h('button', {
        class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('pause'),
        onclick: function () { if (session && session.pause) session.pause(); }
      }, h('span', { 'aria-hidden': 'true' }, '⏸')));
      actions.appendChild(h('button', {
        class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('session_leave'),
        onclick: function () {
          window.UI.confirmSheet(t('session_leave'), t('session_leave_body'), t('done'), function () { go('home'); });
        }
      }, h('span', { 'aria-hidden': 'true' }, '✕')));
      return;
    }

    if (bare) return;

    if (current.name !== 'home') {
      brandSlot.appendChild(h('button', {
        class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('back'),
        onclick: function () {
          if (current.name === 'board') window.Board.stepBack(go);
          else go('home');
        }
      }, h('span', { 'aria-hidden': 'true' }, '←')));
    }
    if (current.name !== 'board') {
      actions.appendChild(h('button', {
        class: 'btn btn-talk btn-icon', type: 'button', 'aria-label': t('board_open'),
        onclick: function () { go('board'); }
      }, h('span', { 'aria-hidden': 'true' }, '💬')));
    }
    actions.appendChild(h('button', {
      class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('langSwitch') + ': ' + t('otherLang'),
      onclick: function () {
        window.Store.set('settings.lang', window.UI.lang() === 'de' ? 'en' : 'de');
        render();
        window.UI.announce(t('langName'));
      }
    }, window.UI.lang() === 'de' ? 'EN' : 'DE'));
    actions.appendChild(h('button', {
      class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('nav_settings'),
      onclick: function () { go('settings'); }
    }, h('span', { 'aria-hidden': 'true' }, '⚙')));

  }

  /* ---------- Content pools ---------- */
  function allWords() {
    var mine = window.Store.mine.map(function (m) {
      return { isMine: true, id: m.id, word: m.word, hint: m.hint, photo: m.photo };
    });
    return window.WORDS.concat(mine);
  }

  function greeting() {
    var hh = new Date().getHours();
    var g = hh < 11 ? t('greet_morning') : hh < 18 ? t('greet_day') : t('greet_evening');
    var name = (window.Store.settings.name || '').trim();
    return name ? t('greet_named', { greet: g, name: name }) : g + '.';
  }

  function encouragementLine() {
    var pack = window.ENCOURAGE[window.UI.lang()];
    var p = window.Store.progress;
    var todayN = window.Store.todayCount();
    var streak = window.Store.streak();
    if (p.totalWords === 0) return window.UI.pick(pack.generic);
    if (todayN >= 25) return pack.milestone.words25.replace('{n}', todayN);
    if (todayN >= 10) return pack.milestone.words10;
    if (streak >= 7) return pack.milestone.streak7;
    if (streak >= 3) return pack.milestone.streak3;
    if (p.totalWords >= 100 && p.totalWords < 110) return pack.milestone.total100;
    if (todayN === 0 && streak === 0) return pack.milestone.backAfterBreak;
    return window.UI.pick(pack.generic);
  }

  /* ---------- Session building ----------
   * Composition lives in Programme: stage, pool, difficulty ladder, repetition
   * and variation. This file only runs what it is handed. */
  var LEN = { s: 6, m: 10, l: 14 };

  function isGraded(st) { return ['choose', 'spell', 'name', 'features', 'sound'].indexOf(st.type) >= 0; }

  function sessionSteps(opts) { return window.Programme.build(opts || {}); }

  /* Ask about the pace after every N graded steps, never as the last step. */
  function withChecks(steps) {
    if (!window.Store.settings.checkIn) return steps;
    var every = Math.max(2, window.Store.settings.checkEvery || 4);
    var out = [], graded = 0;
    steps.forEach(function (s, idx) {
      out.push(s);
      if (isGraded(s)) graded++;
      if (graded >= every && idx < steps.length - 1) { out.push({ type: 'check' }); graded = 0; }
    });
    return out;
  }

  /* ---------- Screens ---------- */
  var Screens = {};

  Screens.home = function () {
    var s = window.Store.settings;
    var minutes = Math.max(3, Math.round((LEN[s.sessionLen] || 10) * 0.8));
    if (s.gentlePace) minutes = Math.max(2, Math.round(minutes * 0.6));

    return h('div', { class: 'stack' },
      h('section', { class: 'card hero' },
        h('h1', {}, greeting()),
        h('p', { class: 'lead' }, encouragementLine())
      ),
      h('button', {
        class: 'btn btn-primary btn-block btn-hero', type: 'button',
        onclick: function () { go('session', {}); }
      },
        h('span', { class: 'btn-hero-main' }, h('span', { 'aria-hidden': 'true' }, '▶ '), t('home_today')),
        h('span', { class: 'btn-hero-sub' }, t('home_minutes', { n: minutes }))
      ),
      h('p', { class: 'quiet-stats' },
        t('stage_of', { n: window.Programme.stage(), total: window.Programme.STAGES })),
      h('button', {
        class: 'btn btn-outline btn-block', type: 'button',
        onclick: function () { go('board'); }
      }, h('span', { 'aria-hidden': 'true' }, '💬'), t('board_open')),
      h('p', { class: 'hint center' }, t('home_noPressure'))
    );
  };

  Screens.session = function (params) {
    var steps = withChecks(sessionSteps(params));
    var idx = 0, graded = 0, cleanupStep = null;

    var host = h('div', { class: 'taskhost' });
    session = {
      at: 0, total: steps.length,
      pause: function () { showBreak(); }
    };

    function syncChrome() {
      session.at = idx;
      session.total = steps.length;
      renderChrome();
    }

    function next() {
      if (cleanupStep) { try { cleanupStep(); } catch (e) {} cleanupStep = null; }
      // Deliberately NOT stopping speech here: turning the page used to cut the
      // spoken word off halfway. A new speak() cancels the old one anyway, so
      // letting it finish costs nothing and keeps the model utterance intact.
      idx++;
      if (idx >= steps.length) return finish();
      paint();
    }

    function paint() {
      syncChrome();
      clear(host);
      main.scrollTop = 0;
      var step = steps[idx];
      if (step.type === 'check') return host.appendChild(checkCard());
      if (step.type === 'pain') return host.appendChild(window.Wellbeing.quickCard(next));
      var built = window.Exercises.build(step, {
        done: function (outcome) { if (outcome) graded++; next(); }
      });
      cleanupStep = built.cleanup || null;
      host.appendChild(built.el);
      prefetchNext();
    }

    /* Warm the next step's audio while this one is still on screen. */
    function prefetchNext() {
      var nx = steps[idx + 1];
      if (!nx || !window.Speech.prefetch) return;
      var lang = window.UI.lang();
      var texts = [];
      if (nx.word) texts.push(nx.word.isMine ? nx.word.word : nx.word[lang].w);
      if (nx.phrase) texts = texts.concat([nx.phrase[lang].t]).concat(nx.phrase[lang].p);
      if (nx.series) texts = texts.concat(nx.series[lang].items);
      if (texts.length) setTimeout(function () { window.Speech.prefetch(texts, lang); }, 400);
    }

    function checkCard() {
      function answer(a) {
        window.Store.recordLoad(a);
        if (a === 'stop') return showBreak();
        if (a === 'much') {
          var keep = Math.max(idx + 1, idx + Math.ceil((steps.length - idx) * 0.5));
          steps = steps.slice(0, keep);
          window.Store.set('settings.rate', Math.max(0.5, window.Store.settings.rate - 0.1));
          window.UI.toast(t('check_adjusted'));
        } else if (window.Store.maybeRelaxPace()) {
          window.UI.toast(t('pace_gentleOff'));
        }
        next();
      }
      return h('div', { class: 'exercise' },
        h('div', { class: 'card' },
          h('div', { class: 'eyebrow' }, t('check_title')),
          h('h2', { text: t('check_q') })),
        h('div', { class: 'actions stack-sm' },
          h('button', { class: 'btn btn-calm btn-block btn-big', type: 'button', 'aria-label': t('check_good_a'), onclick: function () { answer('good'); } },
            h('span', { 'aria-hidden': 'true' }, '🙂'), t('check_good')),
          h('button', { class: 'btn btn-outline btn-block btn-big', type: 'button', 'aria-label': t('check_much_a'), onclick: function () { answer('much'); } },
            h('span', { 'aria-hidden': 'true' }, '😐'), t('check_much')),
          h('button', { class: 'btn btn-outline btn-block btn-big', type: 'button', 'aria-label': t('check_stop_a'), onclick: function () { answer('stop'); } },
            h('span', { 'aria-hidden': 'true' }, '🛑'), t('check_stop'))));
    }

    function showBreak() {
      if (cleanupStep) { try { cleanupStep(); } catch (e) {} cleanupStep = null; }
      window.Speech.stop();
      clear(host);
      host.appendChild(h('div', { class: 'exercise center' },
        h('h1', { text: t('break_title') }),
        h('div', { class: 'breathe', 'aria-hidden': 'true' }),
        h('p', { class: 'lead', style: { whiteSpace: 'pre-line' } }, t('break_body')),
        h('div', { class: 'actions stack-sm' },
          h('button', { class: 'btn btn-outline btn-block btn-big', type: 'button', onclick: paint }, t('break_back')),
          h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: finish }, t('break_end')))));
      window.UI.announce(t('break_title'));
    }

    function finish() {
      if (cleanupStep) { try { cleanupStep(); } catch (e) {} cleanupStep = null; }
      idx = steps.length;
      syncChrome();
      clear(host);
      window.Store.set('progress.sessions', (window.Store.progress.sessions || 0) + 1);
      var advanced = graded > 0 && window.Programme.maybeAdvance();
      var pack = window.ENCOURAGE[window.UI.lang()];
      var line = advanced
        ? t('stage_up', { n: window.Programme.stage() })
        : (window.Store.progress.totalWords <= graded ? pack.milestone.firstSession : window.UI.pick(pack.generic));
      host.appendChild(h('div', { class: 'exercise center' },
        h('h1', { text: t('session_done_title') }),
        h('p', { class: 'lead' }, t('session_done_body', { n: window.Store.todayCount() })),
        h('div', { class: 'encourage', style: { textAlign: 'left' } }, line),
        h('div', { class: 'actions stack-sm' },
          h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: function () { go('home'); } }, t('session_done_home')),
          h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('session', { count: 4 }); } }, t('session_done_again')))));
      window.UI.announce(t('session_done_title'));
    }

    paint();
    return { el: host, cleanup: function () { if (cleanupStep) { try { cleanupStep(); } catch (e) {} } } };
  };

  Screens.onboarding = function () { return window.Onboarding.render(go); };
  Screens.board = function () { return window.Board.render(go); };
  Screens.about = function () { return window.About.render(); };
  Screens.settings = function () { return window.SettingsScreen.render(go, render, VERSION); };
  Screens.words = function () { return window.MyWords.render(go); };
  Screens.review = function () { return window.Review.render(go); };

  window.App = { go: go, render: render, allWords: allWords, VERSION: VERSION };

  /* ---------- Boot ---------- */
  function boot() {
    if (window.Store.settings.lang === null) {
      window.Store.set('settings.lang', (navigator.language || 'de').toLowerCase().indexOf('de') === 0 ? 'de' : 'en');
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.setAttribute('data-motion', 'reduce');
    }
    window.Speech.onVoicesChanged(function () { if (current.name === 'settings') render(); });
    go(window.Store.settings.onboarded ? 'home' : 'onboarding');
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
