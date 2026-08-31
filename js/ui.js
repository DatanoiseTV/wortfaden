/* Small DOM + i18n helpers shared by every screen. */
(function () {
  function h(tag, attrs) {
    var node = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      });
    }
    (function add(list) {
      list.forEach(function (c) {
        if (c === null || c === undefined || c === false) return;
        if (Array.isArray(c)) return add(c);
        node.appendChild(typeof c === 'object' && c.nodeType ? c : document.createTextNode(String(c)));
      });
    })(kids);
    return node;
  }

  function lang() {
    var l = window.Store.settings.lang;
    if (l === 'de' || l === 'en') return l;
    var nav = (navigator.language || 'de').toLowerCase();
    return nav.indexOf('de') === 0 ? 'de' : 'en';
  }

  function t(key, vars) {
    var pack = window.I18N[lang()] || window.I18N.de;
    var s = pack[key];
    if (s === undefined) s = (window.I18N.de[key] !== undefined ? window.I18N.de[key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  function announce(msg) {
    var live = document.getElementById('live');
    if (!live) return;
    live.textContent = '';
    // A same-text update is ignored by screen readers without the reset tick.
    setTimeout(function () { live.textContent = msg; }, 60);
  }

  var toastTimer = null;
  function toast(msg) {
    var host = document.getElementById('toastHost');
    clear(host);
    var node = h('div', { class: 'toast', role: 'status' }, msg);
    host.appendChild(node);
    announce(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { clear(host); }, 3200);
  }

  /* Confirm/alert replacements: native dialog when available, window.confirm
   * as the fallback so the flow never dead-ends on an old browser. */
  function sheet(build) {
    var dlg = document.getElementById('sheet');
    var body = document.getElementById('sheetBody');
    clear(body);
    build(body, function close() {
      try { dlg.close(); } catch (e) { dlg.removeAttribute('open'); }
    });
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    var focusable = body.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus();
  }

  function confirmSheet(title, bodyText, okLabel, onOk, danger) {
    sheet(function (body, close) {
      body.appendChild(h('h2', { text: title }));
      if (bodyText) body.appendChild(h('p', { class: 'muted', text: bodyText }));
      body.appendChild(h('div', { class: 'btn-row', style: { marginTop: '1.2rem' } },
        h('button', {
          class: 'btn ' + (danger ? 'btn-primary' : 'btn-calm'), type: 'button',
          onclick: function () { close(); onOk(); }
        }, okLabel),
        h('button', { class: 'btn btn-outline', type: 'button', onclick: close }, t('cancel'))
      ));
    });
  }

  /* Applies every accessibility setting to the document root. */
  function applySettings() {
    var s = window.Store.settings;
    var root = document.documentElement;
    root.setAttribute('lang', lang());
    root.setAttribute('data-text', s.textSize || 'm');
    root.setAttribute('data-theme', s.theme === 'auto' ? 'auto' : s.theme);
    if (s.contrast) root.setAttribute('data-contrast', 'high'); else root.removeAttribute('data-contrast');
    if (s.reduceMotion) root.setAttribute('data-motion', 'reduce'); else root.removeAttribute('data-motion');
    document.title = t('appName');
    var skip = document.getElementById('skipLink');
    if (skip) skip.textContent = t('skipToMain');
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function fmtDate(ts, withTime) {
    var d = new Date(ts);
    var l = lang() === 'de' ? 'de-DE' : 'en-GB';
    try {
      return withTime
        ? d.toLocaleString(l, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString(l, { day: '2-digit', month: '2-digit' });
    } catch (e) { return d.toISOString().slice(0, 10); }
  }

  function dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  window.UI = {
    h: h, t: t, lang: lang, clear: clear, announce: announce, toast: toast,
    sheet: sheet, confirmSheet: confirmSheet, applySettings: applySettings,
    pick: pick, shuffle: shuffle, fmtDate: fmtDate, dayKey: dayKey
  };
})();
