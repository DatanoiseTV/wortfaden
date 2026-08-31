/* Review area — practice statistics, wellbeing trends and a plain-text report.
 *
 * Behind a PIN on purpose, but be clear about what that is: a privacy screen,
 * not security. The data sits unencrypted in localStorage and anyone with the
 * device and developer tools can read it. Its actual job is to keep error
 * rates and mastery statistics out of the practising person's way — seeing
 * your own failure rate mid-recovery is discouraging and clinically unhelpful.
 */
(function () {
  var h = window.UI.h, t = window.UI.t;
  var unlocked = false; // resets on reload, deliberately

  function dayKeys(n) {
    var out = [], d = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var x = new Date(d);
      x.setDate(d.getDate() - i);
      out.push({ key: window.UI.dayKey(x), ts: x.getTime() });
    }
    return out;
  }

  function barChart(values, labels, opts) {
    opts = opts || {};
    var max = Math.max.apply(null, values.concat([opts.min || 1]));
    var bars = h('div', { class: 'bars', role: 'img', 'aria-label': opts.label || '' });
    values.forEach(function (v, i) {
      var pct = max > 0 ? Math.round((v / max) * 100) : 0;
      bars.appendChild(h('div', {
        class: 'bar' + (v === 0 ? ' empty' : '') + (opts.tone === 'pain' ? ' pain' : ''),
        style: { height: Math.max(2, pct) + '%' },
        title: labels[i] + ': ' + v
      }));
    });
    var axis = h('div', { class: 'axis' });
    labels.forEach(function (l, i) {
      axis.appendChild(h('span', {}, (i % 2 === 0 || labels.length <= 14) ? l : ''));
    });
    return h('div', {},
      h('div', { class: 'chartwrap' }, h('div', { class: 'chartinner' }, bars, axis)),
      h('p', { class: 'hint' }, (opts.label || '') + ' · max ' + max));
  }

  function practiceSeries(n) {
    var days = window.Store.progress.days;
    return dayKeys(n).map(function (d) { return { label: String(new Date(d.ts).getDate()), v: days[d.key] || 0 }; });
  }

  function painSeries(n) {
    var buckets = {};
    window.Store.wellbeing.forEach(function (e) {
      if (e.pain === null || e.pain === undefined) return;
      var k = window.UI.dayKey(new Date(e.ts));
      if (!buckets[k]) buckets[k] = [];
      buckets[k].push(e.pain);
    });
    return dayKeys(n).map(function (d) {
      var vals = buckets[d.key] || [];
      return { label: String(new Date(d.ts).getDate()), v: vals.length ? Math.max.apply(null, vals) : 0, n: vals.length };
    });
  }

  function attemptTotals() {
    var w = window.Store.progress.words;
    var seen = 0, ok = 0;
    Object.keys(w).forEach(function (k) { seen += w[k].seen; ok += w[k].ok; });
    return { seen: seen, ok: ok, rate: seen ? Math.round((ok / seen) * 100) : 0 };
  }

  function boxDistribution() {
    var dist = [0, 0, 0, 0, 0];
    var w = window.Store.progress.words;
    Object.keys(w).forEach(function (k) { dist[Math.min(4, Math.max(0, w[k].box))]++; });
    return dist;
  }

  function wordLabel(id) {
    var w = window.App.allWords().filter(function (x) { return x.id === id; })[0];
    if (!w) return id;
    return w.isMine ? w.word : w[window.UI.lang()].w;
  }

  function rankedWords(worst) {
    var w = window.Store.progress.words;
    return Object.keys(w)
      .filter(function (k) { return w[k].seen >= 2; })
      .sort(function (a, b) {
        var ra = w[a].ok / w[a].seen, rb = w[b].ok / w[b].seen;
        return worst ? ra - rb : rb - ra;
      })
      .slice(0, 8)
      .map(function (k) { return { id: k, label: wordLabel(k), seen: w[k].seen, ok: w[k].ok, box: w[k].box }; });
  }

  function buildReport() {
    var L = [];
    var tot = attemptTotals();
    var dist = boxDistribution();
    L.push('=== ' + t('appName') + ' — ' + t('ad_title') + ' ===');
    L.push(new Date().toLocaleString());
    L.push('');
    L.push('[' + t('ad_practice') + ']');
    L.push(t('home_daysPracticed') + ': ' + window.Store.daysPracticed());
    L.push(t('home_wordsTotal') + ': ' + window.Store.progress.totalWords);
    L.push(t('ad_attempts') + ': ' + tot.seen + ' · ' + t('ad_indepRate') + ': ' + tot.rate + '%');
    L.push('');
    L.push('[' + t('ad_last14') + ']');
    practiceSeries(14).forEach(function (d) { L.push('  ' + d.label + '  ' + d.v); });
    L.push('');
    L.push('[' + t('ad_mastery') + ']');
    dist.forEach(function (n, i) { L.push('  ' + t('ad_box', { n: i }) + ': ' + n); });
    L.push('');
    L.push('[' + t('ad_hardest') + ']');
    rankedWords(true).forEach(function (w) { L.push('  ' + w.label + '  ' + w.ok + '/' + w.seen); });
    L.push('');
    L.push('[' + t('ad_strongest') + ']');
    rankedWords(false).forEach(function (w) { L.push('  ' + w.label + '  ' + w.ok + '/' + w.seen); });
    L.push('');
    L.push('[' + t('ad_wellbeing') + ']');
    var wb = window.Store.wellbeing.slice(-30);
    if (!wb.length) L.push('  ' + t('ad_noData'));
    wb.forEach(function (e) {
      L.push('  ' + window.UI.fmtDate(e.ts, true) +
        '  ' + t('wb_pain_scale') + ': ' + (e.pain === null || e.pain === undefined ? '-' : e.pain + '/10') +
        (e.energy ? '  ' + t('wb_energy_q') + ': ' + t('wb_e' + e.energy) : '') +
        (e.where && e.where.length ? '  ' + e.where.map(function (k) { return t('wb_where_' + k); }).join(',') : '') +
        (e.note ? '  "' + e.note + '"' : ''));
    });
    L.push('');
    L.push('[' + t('ad_said') + ']');
    var said = window.Store.saidLog.slice(-80);
    if (!said.length) L.push('  ' + t('ad_said_none'));
    said.forEach(function (e) {
      L.push('  ' + window.UI.fmtDate(e.ts, true) + '  "' + e.text + '"  (' + t('ad_said_src_' + (e.src || 'tile')) + ')');
    });
    L.push('');
    L.push('[' + t('ad_load') + ']');
    var load = window.Store.recentLoad(30);
    var counts = { good: 0, much: 0, stop: 0 };
    load.forEach(function (x) { counts[x.answer] = (counts[x.answer] || 0) + 1; });
    L.push('  ' + t('ad_loadGood') + ': ' + counts.good + ' · ' + t('ad_loadMuch') + ': ' + counts.much + ' · ' + t('ad_loadStop') + ': ' + counts.stop);
    L.push('');
    L.push(t('wb_disclaimer'));
    return L.join('\n');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { window.UI.toast(t('ad_copied')); })
        .catch(function () { fallbackCopy(text); });
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var ta = h('textarea', { style: { position: 'fixed', opacity: '0' } });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); window.UI.toast(t('ad_copied')); } catch (e) {}
    ta.remove();
  }

  function gate(go) {
    var err = h('p', { class: 'err hidden' });

    if (!window.Store.hasPin()) {
      var p1 = h('input', { type: 'password', id: 'pin1', inputmode: 'numeric', autocomplete: 'new-password' });
      var p2 = h('input', { type: 'password', id: 'pin2', inputmode: 'numeric', autocomplete: 'new-password' });
      return h('div', { class: 'stack' },
        h('section', { class: 'card' },
          h('div', { class: 'eyebrow' }, t('ad_locked')),
          h('h1', { text: t('ad_setPin') }),
          h('p', { class: 'muted', text: t('ad_setPin_d') }),
          h('div', { class: 'field' }, h('label', { for: 'pin1' }, t('ad_enterPin')), p1),
          h('div', { class: 'field' }, h('label', { for: 'pin2' }, t('ad_pinAgain')), p2),
          err,
          h('button', {
            class: 'btn btn-primary btn-block btn-big', type: 'button',
            onclick: function () {
              if (p1.value.length < 4) { err.textContent = t('ad_pinShort'); err.classList.remove('hidden'); return; }
              if (p1.value !== p2.value) { err.textContent = t('ad_pinMismatch'); err.classList.remove('hidden'); return; }
              window.Store.setPin(p1.value).then(function () { unlocked = true; window.App.render(); });
            }
          }, t('save')),
          h('p', { class: 'hint' }, t('ad_notSecurity'))
        ),
        h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('home'); } }, t('back'))
      );
    }

    var pin = h('input', { type: 'password', id: 'pin', inputmode: 'numeric', autocomplete: 'current-password' });
    function tryUnlock() {
      window.Store.checkPin(pin.value).then(function (ok) {
        if (ok) { unlocked = true; window.App.render(); }
        else { err.textContent = t('ad_pinWrong'); err.classList.remove('hidden'); pin.value = ''; pin.focus(); }
      });
    }
    pin.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
    return h('div', { class: 'stack' },
      h('section', { class: 'card' },
        h('div', { class: 'eyebrow' }, t('ad_locked')),
        h('h1', { text: t('ad_title') }),
        h('div', { class: 'field' }, h('label', { for: 'pin' }, t('ad_enterPin')), pin),
        err,
        h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: tryUnlock }, t('ad_unlock')),
        h('p', { class: 'hint' }, t('ad_notSecurity'))
      ),
      h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('home'); } }, t('back'))
    );
  }

  window.Review = {
    painChart: function (days) {
      var s = painSeries(days);
      if (!s.some(function (d) { return d.n; })) return h('p', { class: 'muted', text: t('ad_noData') });
      return barChart(s.map(function (d) { return d.v; }), s.map(function (d) { return d.label; }),
        { label: t('ad_painMax') + ' (0–10)', tone: 'pain', min: 10 });
    },

    render: function (go) {
      if (!unlocked) return gate(go);

      var tot = attemptTotals();
      var dist = boxDistribution();
      var ps = practiceSeries(14);
      var load = window.Store.recentLoad(50);
      var counts = { good: 0, much: 0, stop: 0 };
      load.forEach(function (x) { counts[x.answer] = (counts[x.answer] || 0) + 1; });

      /* Grouped by day, newest first: on a ward round the question is
         "what did she ask for today", not "what is entry 214". */
      function saidList() {
        var log = window.Store.saidLog.slice().reverse();
        if (!log.length) return h('p', { class: 'muted', text: t('ad_said_none') });
        var out = h('div', { class: 'stack-sm' });
        var curDay = null, ul = null;
        log.slice(0, 120).forEach(function (e) {
          var day = window.UI.fmtDate(e.ts);
          if (day !== curDay) {
            curDay = day;
            out.appendChild(h('div', { class: 'eyebrow', style: { marginTop: '.8rem' } }, day));
            ul = h('ul', { class: 'list' });
            out.appendChild(ul);
          }
          var time = new Date(e.ts);
          ul.appendChild(h('li', {}, h('div', { class: 'listitem' },
            h('span', { class: 'small muted', style: { flex: '0 0 auto', fontVariantNumeric: 'tabular-nums' } },
              String(time.getHours()).padStart(2, '0') + ':' + String(time.getMinutes()).padStart(2, '0')),
            h('div', { class: 'grow' },
              h('strong', {}, e.text),
              h('div', { class: 'hint' }, t('ad_said_src_' + (e.src || 'tile')))))));
        });
        return out;
      }

      function wellbeingList() {
        var entries = window.Store.wellbeing.slice(-14).reverse();
        if (!entries.length) return h('p', { class: 'muted', text: t('wb_history_none') });
        var ul = h('ul', { class: 'list' });
        var steps = window.Wellbeing.PAIN_STEPS;
        entries.forEach(function (e) {
          var face = (e.pain === null || e.pain === undefined)
            ? '—'
            : (steps.filter(function (p) { return p.v === Math.round(e.pain / 2) * 2; })[0] || steps[0]).face;
          ul.appendChild(h('li', {}, h('div', { class: 'listitem' },
            h('div', { class: 'thumb' }, h('span', { 'aria-hidden': 'true' }, face)),
            h('div', { class: 'grow' },
              h('strong', {}, window.UI.fmtDate(e.ts, true)),
              h('div', { class: 'hint' },
                ((e.pain === null || e.pain === undefined) ? t('wb_pain_none') : e.pain + '/10') +
                (e.energy ? ' · ' + t('wb_e' + e.energy) : '') +
                (e.where && e.where.length ? ' · ' + e.where.map(function (k) { return t('wb_where_' + k); }).join(', ') : '')),
              e.note ? h('div', { class: 'hint' }, e.note) : null),
            h('button', {
              class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('wb_delete_entry'),
              onclick: function () { window.Store.removeWellbeing(e.id); window.App.render(); }
            }, h('span', { 'aria-hidden': 'true' }, '🗑')))));
        });
        return ul;
      }

      function wordList(items, empty) {
        if (!items.length) return h('p', { class: 'muted', text: empty });
        var ul = h('ul', { class: 'list' });
        items.forEach(function (w) {
          ul.appendChild(h('li', {}, h('div', { class: 'listitem' },
            h('div', { class: 'grow' }, h('strong', {}, w.label),
              h('div', { class: 'hint' }, t('ad_box', { n: w.box }))),
            h('span', { class: 'small muted' }, w.ok + '/' + w.seen))));
        });
        return ul;
      }

      return h('div', { class: 'stack' },
        h('section', { class: 'card' },
          h('h1', { text: t('ad_title') }),
          h('div', { class: 'stats' },
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, String(window.Store.daysPracticed())), h('span', { class: 'stat-l' }, t('home_daysPracticed'))),
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, String(window.Store.progress.totalWords)), h('span', { class: 'stat-l' }, t('home_wordsTotal'))),
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, tot.rate + '%'), h('span', { class: 'stat-l' }, t('ad_indepRate')))
          ),
          h('p', { class: 'hint', style: { marginTop: '.8rem' } }, t('ad_notSecurity'))
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_practice') }),
          barChart(ps.map(function (d) { return d.v; }), ps.map(function (d) { return d.label; }), { label: t('ad_last14') })
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_mastery') }),
          barChart(dist, dist.map(function (_, i) { return String(i); }), { label: t('ad_mastery') }),
          h('div', { class: 'legend' }, dist.map(function (n, i) {
            return h('span', { class: 'key' }, t('ad_box', { n: i }) + ': ' + n);
          }))
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_hardest') }),
          wordList(rankedWords(true), t('ad_noData'))
        ),
        h('section', { class: 'card' },
          h('h2', { text: t('ad_strongest') }),
          wordList(rankedWords(false), t('ad_noData'))
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_said') }),
          h('p', { class: 'hint', text: t('ad_said_hint') }),
          h('p', { class: 'hint' }, t('ad_said_count', { n: window.Store.saidLog.length })),
          saidList(),
          window.Store.saidLog.length ? h('button', {
            class: 'btn btn-quiet', style: { marginTop: '1rem' }, type: 'button',
            onclick: function () {
              window.UI.confirmSheet(t('ad_said_clear'), t('ad_said_clearQ'), t('ad_said_clear'), function () {
                window.Store.clearSaidLog(); window.App.render();
              }, true);
            }
          }, t('ad_said_clear')) : null,
          h('p', { class: 'hint', style: { marginTop: '.8rem' } }, t('ad_said_privacy'))
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_wellbeing') }),
          h('p', { class: 'hint', text: t('wb_history_hint') }),
          this.painChart(14),
          wellbeingList()
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_load') }),
          h('div', { class: 'stats' },
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, String(counts.good)), h('span', { class: 'stat-l' }, t('ad_loadGood'))),
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, String(counts.much)), h('span', { class: 'stat-l' }, t('ad_loadMuch'))),
            h('div', { class: 'stat' }, h('span', { class: 'stat-n' }, String(counts.stop)), h('span', { class: 'stat-l' }, t('ad_loadStop')))
          )
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('ad_copyReport') }),
          h('p', { class: 'hint', text: t('ad_reportHint') }),
          h('div', { class: 'btn-row' },
            h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { copyText(buildReport()); } }, t('ad_copyReport')),
            h('button', {
              class: 'btn btn-outline', type: 'button', onclick: function () {
                window.UI.confirmSheet(t('ad_changePin'), '', t('ad_changePin'), function () {
                  window.Store.clearPin(); unlocked = false; window.App.render();
                });
              }
            }, t('ad_changePin')),
            h('button', { class: 'btn btn-quiet', type: 'button', onclick: function () { unlocked = false; go('home'); } }, t('ad_lock'))
          )
        ),
        h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('home'); } }, t('back'))
      );
    }
  };
})();
