/* The communication board screen.
 *
 * Three ways to say something, in order of how much they let you say:
 *   Tiles    — one tap, fixed phrases. Fastest, most limited.
 *   Compose  — starter + continuation. Two taps, a few hundred utterances.
 *   Write    — free text, plus a letter grid for anyone who cannot use the
 *              on-screen keyboard. Unlimited.
 *
 * Everything spoken is also shown in very large type, because in a hospital
 * room the audio is the unreliable channel: masks, machines, distance, a phone
 * lying on a blanket. The nurse reading it off the screen from the foot of the
 * bed is the fallback that always works.
 */
(function () {
  var h = window.UI.h, t = window.UI.t;

  var mode = 'tiles';       // tiles | compose | write
  var activeCat = 0;
  var composePicked = null; // which sentence starter is open

  /* Back steps OUT of where you are, one level at a time, and only leaves the
     board from its own top level. Landing on the home screen because you
     wanted to get out of a sentence starter is the wrong answer under
     pressure. */
  function stepBack(go) {
    if (mode === 'compose' && composePicked !== null) { composePicked = null; window.App.render(); return; }
    if (mode !== 'tiles') { mode = 'tiles'; window.App.render(); return; }
    go('home');
  }

  function speakBig(text, chainId, src) {
    remember(text, src);
    window.Speech.speak(text);
    window.UI.announce(text);
    showBig(text, chainId, 0);
  }

  /* The spoken phrase, full screen, in the largest type that fits — plus the
     follow-up the other person is about to ask anyway. */
  function showBig(text, chainId, stepIdx) {
    var lang = window.UI.lang();
    var chain = chainId && window.BOARD_CHAINS[lang] ? window.BOARD_CHAINS[lang][chainId] : null;
    var step = chain ? chain[stepIdx || 0] : null;

    var overlay = h('div', { class: 'bigsay' + (step ? ' has-followup' : ''), role: 'dialog', 'aria-live': 'assertive', 'aria-label': text });
    var say = h('p', { class: 'bigsay-text' }, text);
    overlay.appendChild(say);

    if (step) {
      overlay.appendChild(h('p', { class: 'bigsay-q' }, step.q));
      var opts = h('div', { class: 'boardgrid followup' });

      if (step.kind === 'painScale') {
        window.Wellbeing.PAIN_STEPS.forEach(function (p) {
          opts.appendChild(h('button', {
            class: 'boardtile', type: 'button', 'aria-label': p.v + ' — ' + t(p.key),
            onclick: function () {
              // The answer is worth keeping: it lands in the pain history the
              // ward round can look at.
              window.Store.addWellbeing({ pain: p.v, where: [], energy: null, note: text });
              var phrase = t('board_pain_level', { n: p.v, word: t(p.key) });
              overlay.remove();
              remember(phrase, 'chain');
              window.Speech.speak(phrase);
              showBig(phrase, chainId, (stepIdx || 0) + 1);
            }
          },
            h('span', { class: 'boardtile-icon', 'aria-hidden': 'true' }, p.face),
            h('span', { class: 'boardtile-label' }, p.v + ' · ' + t(p.key))));
        });
      } else {
        step.options.forEach(function (o) {
          var phrase = fill(o.s || o.t);
          opts.appendChild(h('button', {
            class: 'boardtile', type: 'button', 'aria-label': phrase,
            onclick: function () {
              overlay.remove();
              remember(phrase, 'chain');
              window.Speech.speak(phrase);
              showBig(phrase, chainId, (stepIdx || 0) + 1);
            }
          },
            h('span', { class: 'boardtile-icon', 'aria-hidden': 'true' }, o.e),
            h('span', { class: 'boardtile-label' }, fill(o.t))));
        });
      }
      overlay.appendChild(opts);
    }

    overlay.appendChild(h('div', { class: 'bigsay-actions' },
      h('button', {
        class: 'btn btn-outline btn-big', type: 'button',
        onclick: function (e) { e.stopPropagation(); window.Speech.speak(text); }
      }, h('span', { 'aria-hidden': 'true' }, '🔊'), t('board_again')),
      h('button', {
        class: 'btn btn-primary btn-big', type: 'button',
        onclick: function () { overlay.remove(); }
      }, t('close'))));
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    // Shrink the text until it fits rather than letting it overflow.
    requestAnimationFrame(function () {
      var size = step ? 2.4 : 4.2;
      say.style.fontSize = size + 'rem';
      while (size > 1.2 && say.scrollHeight > say.clientHeight) {
        size -= 0.25;
        say.style.fontSize = size + 'rem';
      }
    });
  }

  function remember(text, src) {
    var list = (window.Store.progress.recentSaid || []).filter(function (x) { return x !== text; });
    list.unshift(text);
    window.Store.set('progress.recentSaid', list.slice(0, 8));
    window.Store.logSaid(text, src || 'tile');
  }

  /* {p} becomes the name of whoever visits, so the board says "I want to see
     Anna", not "I want to see my partner". Falls back to a neutral word. */
  function fill(text) {
    var p = (window.Store.settings.partner || '').trim();
    return String(text).split('{p}').join(p || t('board_partner_fallback'));
  }

  function tile(item) {
    var text = fill(item.s || item.t);
    return h('button', {
      class: 'boardtile' + (item.big ? ' is-big' : '') + (item.tone ? ' tone-' + item.tone : ''),
      type: 'button', 'aria-label': text,
      onclick: function () { speakBig(text, item.chain, 'tile'); }
    },
      h('span', { class: 'boardtile-icon', 'aria-hidden': 'true' }, item.e),
      h('span', { class: 'boardtile-label' }, fill(item.t)));
  }

  function tilesView(lang) {
    var cats = window.BOARD[lang];
    var wrap = h('div', { class: 'stack-sm' });

    var recent = window.Store.progress.recentSaid || [];
    if (recent.length) {
      var chips = h('div', { class: 'chipset' });
      recent.forEach(function (r) {
        chips.appendChild(h('button', {
          class: 'chip', type: 'button', onclick: function () { speakBig(r, null, 'recent'); }
        }, r.length > 34 ? r.slice(0, 33) + '…' : r));
      });
      wrap.appendChild(h('div', { class: 'field' },
        h('label', {}, t('board_recent')), chips));
    }

    var grid = h('div', { class: 'boardgrid' });
    (cats[activeCat] || cats[0]).items.forEach(function (it) { grid.appendChild(tile(it)); });
    wrap.appendChild(grid);
    return wrap;
  }

  function composeView(lang) {
    var starters = window.COMPOSE[lang];
    var host = h('div', { class: 'stack-sm' });

    function paint() {
      window.UI.clear(host);
      if (composePicked === null) {
        host.appendChild(h('p', { class: 'hint', text: t('board_compose_hint') }));
        var list = h('div', { class: 'boardgrid wide' });
        starters.forEach(function (st, i) {
          list.appendChild(h('button', {
            class: 'boardtile is-text', type: 'button',
            onclick: function () { composePicked = i; paint(); }
          }, h('span', { class: 'boardtile-label' }, st.s + ' …')));
        });
        host.appendChild(list);
        return;
      }
      var st = starters[composePicked];
      host.appendChild(h('p', { class: 'composehead' }, st.s + ' …'));
      var list2 = h('div', { class: 'boardgrid wide' });
      st.next.forEach(function (n) {
        list2.appendChild(h('button', {
          class: 'boardtile is-text', type: 'button',
          onclick: function () {
            var sentence = st.s + ' ' + n;
            if (!/[.?!]$/.test(sentence)) sentence += /^(Wann|Wo|Warum|When|Where|Why|What)/.test(st.s) ? '?' : '.';
            speakBig(sentence, null, 'compose');
          }
        }, h('span', { class: 'boardtile-label' }, n)));
      });
      host.appendChild(list2);
    }
    paint();
    return host;
  }

  function writeView(lang) {
    var field = h('textarea', {
      id: 'boardWrite', rows: '3', maxlength: '240',
      'aria-label': t('board_write_label'), placeholder: t('board_write_ph')
    });
    var suggestions = h('div', { class: 'chipset' });

    /* Word suggestions come from the practice vocabulary and the board, so a
       half-remembered spelling still reaches the whole word. */
    function suggest() {
      window.UI.clear(suggestions);
      var v = field.value;
      var last = (v.split(/\s+/).pop() || '').toLowerCase();
      if (last.length < 2) return;
      var pool = window.WORDS.map(function (w) { return w[lang].w; })
        .concat(window.Store.mine.map(function (m) { return m.word; }));
      var hits = pool.filter(function (w) { return w.toLowerCase().indexOf(last) === 0; }).slice(0, 6);
      hits.forEach(function (w) {
        suggestions.appendChild(h('button', {
          class: 'chip', type: 'button',
          onclick: function () {
            var parts = field.value.split(/(\s+)/);
            parts[parts.length - 1] = w + ' ';
            field.value = parts.join('');
            field.focus();
            suggest();
          }
        }, w));
      });
    }
    field.addEventListener('input', suggest);

    var letters = h('div', { class: 'letters' });
    'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('').concat(['␣', '⌫']).forEach(function (c) {
      letters.appendChild(h('button', {
        class: 'letterkey', type: 'button', 'aria-label': c === '␣' ? t('board_space') : c === '⌫' ? t('board_del') : c,
        onclick: function () {
          if (c === '⌫') field.value = field.value.slice(0, -1);
          else if (c === '␣') field.value += ' ';
          else field.value += (field.value && !/\s$/.test(field.value)) ? c.toLowerCase() : c;
          suggest();
        }
      }, c));
    });

    return h('div', { class: 'stack-sm' },
      h('div', { class: 'field' }, field, suggestions),
      h('div', { class: 'btn-row' },
        h('button', {
          class: 'btn btn-primary btn-big', type: 'button',
          onclick: function () { if (field.value.trim()) speakBig(field.value.trim(), null, 'write'); }
        }, h('span', { 'aria-hidden': 'true' }, '🔊'), t('board_say')),
        h('button', {
          class: 'btn btn-outline', type: 'button',
          onclick: function () { field.value = ''; window.UI.clear(suggestions); field.focus(); }
        }, t('board_clear'))),
      h('details', { class: 'disclose' },
        h('summary', {}, t('board_letters')),
        letters));
  }

  window.Board = {
    stepBack: stepBack,
    render: function (go) {
      var lang = window.UI.lang();
      var cats = window.BOARD[lang];
      // Warm the neural voice for this category so a tap speaks immediately.
      if (window.Speech.prefetch) {
        window.Speech.prefetch((cats[activeCat] || cats[0]).items
          .map(function (i) { return fill(i.s || i.t); }).slice(0, 12), lang);
      }

      function modeBtn(id, icon, label) {
        return h('button', {
          class: 'btn ' + (mode === id ? 'btn-primary' : 'btn-outline'), type: 'button',
          'aria-pressed': String(mode === id),
          onclick: function () { mode = id; composePicked = null; window.App.render(); }
        }, h('span', { 'aria-hidden': 'true' }, icon), label);
      }

      /* The controls do not scroll away. Under pressure you must be able to
         reach "Yes" or switch to writing without hunting for the header. */
      var head = h('div', { class: 'boardhead' },
        h('div', { class: 'btn-row' },
          modeBtn('tiles', '🔲', t('board_tiles')),
          modeBtn('compose', '🧩', t('board_compose')),
          modeBtn('write', '⌨️', t('board_write'))));

      if (mode === 'tiles') {
        var tabs = h('div', { class: 'boardtabs', role: 'tablist' });
        cats.forEach(function (c, i) {
          tabs.appendChild(h('button', {
            class: 'boardtab', type: 'button', role: 'tab', 'aria-selected': String(i === activeCat),
            onclick: function () { activeCat = i; window.App.render(); }
          }, h('span', { 'aria-hidden': 'true' }, c.icon + ' '), c.title));
        });
        head.appendChild(tabs);
      }

      var body = mode === 'compose' ? composeView(lang)
        : mode === 'write' ? writeView(lang)
          : tilesView(lang);

      return h('div', { class: 'boardscreen' },
        h('h1', { text: t('board_title'), class: 'sr-only' }),
        head,
        h('div', { class: 'boardbody' }, body),
        h('div', { class: 'boardfoot' },
          h('button', {
            class: 'btn btn-quiet btn-block', type: 'button',
            onclick: function () { stepBack(go); }
          }, h('span', { 'aria-hidden': 'true' }, '←'), t('back'))));
    }
  };
})();
