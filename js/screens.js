/* Screens: About, Settings, My words, Wellbeing. */
(function () {
  var h = window.UI.h, t = window.UI.t;


  /* ================= Onboarding =================
   * Three questions, one screen each, all skippable. Someone else (a nurse, a
   * partner) may well be holding the phone, so nothing here assumes the person
   * practising can type. */
  window.Onboarding = {
    render: function (go) {
      var stepIdx = window.Onboarding.stepFor || 0;
      var host = h('div', { class: 'exercise' });
      var name = window.Store.settings.name || '';

      function finish() {
        window.Onboarding.stepFor = 0;
        window.Store.set('settings.name', name.trim().slice(0, 24));
        window.Store.set('settings.onboarded', true);
        go('home');
      }

      function paint() {
        window.UI.clear(host);
        if (stepIdx === 0) {
          var input = h('input', { type: 'text', id: 'obName', autocomplete: 'given-name', maxlength: '24', value: name });
          input.addEventListener('input', function () { name = input.value; });
          input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { stepIdx = 1; window.Onboarding.stepFor = 1; paint(); } });
          host.appendChild(h('div', { class: 'ob-top' },
            h('span', { class: 'ob-mark', 'aria-hidden': 'true' }, '\ud83e\uddf5'),
            h('h1', { text: t('ob_welcome') }),
            h('p', { class: 'lead', text: t('ob_intro') })));
          host.appendChild(h('div', { class: 'field' },
            h('label', { for: 'obName' }, t('ob_name_q')), input,
            h('p', { class: 'hint' }, t('ob_name_hint'))));
          host.appendChild(h('div', { class: 'actions stack-sm' },
            h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: function () { stepIdx = 1; window.Onboarding.stepFor = 1; paint(); } }, t('weiter')),
            h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: function () { stepIdx = 1; window.Onboarding.stepFor = 1; paint(); } }, t('ob_skip'))));
          setTimeout(function () { input.focus(); }, 60);
          return;
        }
        if (stepIdx === 1) {
          host.appendChild(h('h1', { text: t('ob_lang_q') }));
          host.appendChild(h('div', { class: 'actions stack-sm' },
            h('button', {
              class: 'btn btn-outline btn-block btn-big', type: 'button',
              'aria-pressed': String(window.UI.lang() === 'de'),
              onclick: function () { window.Store.set('settings.lang', 'de'); window.Onboarding.stepFor = 2; window.App.render(); }
            }, 'Deutsch'),
            h('button', {
              class: 'btn btn-outline btn-block btn-big', type: 'button',
              'aria-pressed': String(window.UI.lang() === 'en'),
              onclick: function () { window.Store.set('settings.lang', 'en'); window.Onboarding.stepFor = 2; window.App.render(); }
            }, 'English')));
          return;
        }
        if (stepIdx === 2) {
          host.appendChild(h('h1', { text: t('ob_text_q') }));
          host.appendChild(h('p', { class: 'ob-sample', text: t('ob_text_sample') }));
          var row = h('div', { class: 'segmented' });
          [['s', t('set_text_s')], ['m', t('set_text_m')], ['l', t('set_text_l')], ['xl', t('set_text_xl')]].forEach(function (o) {
            row.appendChild(h('button', {
              class: 'btn btn-outline', type: 'button',
              'aria-pressed': String(window.Store.settings.textSize === o[0]),
              onclick: function () { window.Store.set('settings.textSize', o[0]); window.App.render(); }
            }, o[1]));
          });
          host.appendChild(row);
          host.appendChild(h('div', { class: 'actions stack-sm' },
            h('button', {
              class: 'btn btn-primary btn-block btn-big', type: 'button',
              onclick: function () { stepIdx = 3; window.Onboarding.stepFor = 3; paint(); }
            }, t('weiter')),
            h('p', { class: 'hint center', text: t('ob_helper') })));
          return;
        }

        /* The last two questions are for whoever is setting the phone up.
           Sometimes practising is simply too much and the board alone is the
           right answer — that call belongs to the ward, not to the app. */
        if (stepIdx === 3) {
          host.appendChild(h('h1', { text: t('ob_mode_q') }));
          host.appendChild(h('p', { class: 'hint', text: t('ob_mode_helper') }));
          var modes = h('div', { class: 'stack-sm' });
          [['both', '🤝'], ['board', '💬'], ['training', '🎯']].forEach(function (m) {
            modes.appendChild(h('button', {
              class: 'btn btn-outline btn-block btn-big', type: 'button',
              'aria-pressed': String(window.Store.settings.mode === m[0]),
              style: { flexDirection: 'column', gap: '.15em', minHeight: 'calc(var(--tap) + 18px)' },
              onclick: function () {
                window.Store.set('settings.mode', m[0]);
                stepIdx = 4; window.Onboarding.stepFor = 4; paint();
              }
            },
              h('span', {}, h('span', { 'aria-hidden': 'true' }, m[1] + ' '), t('mode_' + m[0])),
              h('span', { class: 'btn-hero-sub' }, t('mode_' + m[0] + '_d'))));
          });
          host.appendChild(modes);
          host.appendChild(h('p', { class: 'hint', text: t('mode_board_note') }));
          return;
        }

        host.appendChild(h('h1', { text: t('ob_lock_q') }));
        host.appendChild(h('p', { class: 'hint', text: t('ob_lock_d') }));
        var p1 = h('input', { type: 'password', id: 'obPin', inputmode: 'numeric', autocomplete: 'new-password' });
        var err = h('p', { class: 'err hidden' });
        host.appendChild(h('div', { class: 'field' }, h('label', { for: 'obPin' }, t('ad_enterPin')), p1, err));
        host.appendChild(h('div', { class: 'actions stack-sm' },
          h('button', {
            class: 'btn btn-primary btn-block btn-big', type: 'button',
            onclick: function () {
              if (p1.value.length < 4) { err.textContent = t('ad_pinShort'); err.classList.remove('hidden'); return; }
              window.Store.setPin(p1.value).then(function () {
                window.Store.set('settings.lockSettings', true);
                finish();
              });
            }
          }, t('ob_lock_yes')),
          h('button', {
            class: 'btn btn-outline btn-block', type: 'button',
            onclick: function () { window.Store.set('settings.lockSettings', false); finish(); }
          }, t('ob_lock_no')),
          h('p', { class: 'hint center', text: t('ad_notSecurity') })));
      }

      // Re-entering the screen after a re-render should keep the step.
      paint();
      return { el: host };
    },
    stepFor: null
  };

  /* ================= About ================= */
  window.About = {
    render: function () {
      var de = window.UI.lang() === 'de';
      return h('div', { class: 'stack' },
        h('section', { class: 'card' },
          h('h1', { text: t('about_title') }),
          de ? h('div', {},
            h('p', {}, 'Wortfaden ist eine Übungs-App für Menschen mit Aphasie und Wortfindungsstörungen. Sie ersetzt keine Logopädie. Sie füllt die Zeit zwischen den Terminen.'),
            h('h2', {}, 'Woher die Übungen kommen'),
            h('p', {}, 'Die Übungen bilden Verfahren nach, die in der Aphasietherapie gut untersucht sind:'),
            h('ul', {},
              h('li', {}, h('strong', {}, 'Hilfe-Hierarchie beim Benennen'), ' — die Hinweise gehen vom schwächsten zum stärksten. So bekommst du immer nur so viel Hilfe, wie du gerade brauchst.'),
              h('li', {}, h('strong', {}, 'Semantische Merkmalsanalyse'), ' — erst beschreiben (Was ist das? Wofür? Wo?), dann benennen. Das aktiviert das Wortfeld um das Wort herum.'),
              h('li', {}, h('strong', {}, 'Lückensätze'), ' — ein Satz mit klarem Ende ist einer der stärksten Hinweise überhaupt.'),
              h('li', {}, h('strong', {}, 'Automatische Reihen'), ' — Zählen und Wochentage bleiben bei Aphasie oft erhalten. Ein guter Start.'),
              h('li', {}, h('strong', {}, 'Alltagssätze in Stücken'), ' — Rhythmus trägt das Sprechen. Deshalb sind die Sätze zerlegt.')
            ),
            h('h2', {}, 'Warum eigene Wörter wichtig sind'),
            h('p', {}, 'In der größten Studie zu selbstständigem Computertraining bei Aphasie (Big CACTUS, 278 Teilnehmende) verbesserte sich die Wortfindung deutlich — trainiert wurden dort persönlich ausgewählte Wörter. Der Übertrag ins Gespräch kam aber nicht von allein. Deshalb: eigene Wörter eintragen, und die Alltagssätze wirklich laut sprechen.'),
            h('h2', {}, 'Tempo und Pausen'),
            h('p', {}, 'Kurz nach einer Operation ist nicht die Menge entscheidend, sondern dass Üben überhaupt möglich bleibt. In einer Studie zu sehr früher, intensiver Aphasietherapie konnte ein großer Teil der Teilnehmenden die vorgesehene Menge gar nicht schaffen. Deshalb fragt diese App zwischendurch nach dem Tempo — und macht die Einheit dann wirklich kürzer.'),
            h('h2', {}, 'Was diese App nicht ist'),
            h('p', {}, 'Kein Medizinprodukt. Keine Diagnose. Keine Therapie. Wenn eine logopädische Behandlung läuft, ist in Deutschland die ', h('strong', {}, 'neolexon Aphasie-App'), ' eine erstattungsfähige Alternative (DiGA-Verzeichnis, PZN 18017082) — sie wird von der behandelnden Logopädin freigeschaltet und von den gesetzlichen Krankenkassen bezahlt. Frag danach, sobald die Behandlung steht.'),
            h('h2', {}, 'Deine Daten'),
            h('p', {}, 'Alles bleibt in diesem Browser, auf diesem Gerät. Es gibt keinen Server, kein Konto, keine Übertragung. Auch die Sprachaufnahmen bleiben lokal und werden nicht gespeichert.')
          ) : h('div', {},
            h('p', {}, 'Wortfaden is a practice app for people with aphasia and word-finding difficulty. It does not replace speech therapy. It fills the time between appointments.'),
            h('h2', {}, 'Where the exercises come from'),
            h('p', {}, 'The exercises follow methods that are well studied in aphasia therapy:'),
            h('ul', {},
              h('li', {}, h('strong', {}, 'Cueing hierarchy for naming'), ' — hints run from the weakest to the strongest, so you only ever get as much help as you actually need.'),
              h('li', {}, h('strong', {}, 'Semantic Feature Analysis'), ' — describe it first (What is it? What for? Where?), then name it. This activates the word field around the word.'),
              h('li', {}, h('strong', {}, 'Sentence completion'), ' — a sentence with an obvious ending is one of the strongest cues there is.'),
              h('li', {}, h('strong', {}, 'Automatic series'), ' — counting and weekdays are often preserved in aphasia. A good way to start.'),
              h('li', {}, h('strong', {}, 'Everyday sentences in chunks'), ' — rhythm carries speech, which is why the sentences are broken up.')
            ),
            h('h2', {}, 'Why your own words matter'),
            h('p', {}, 'In the largest trial of self-managed computer therapy for aphasia (Big CACTUS, 278 participants), word finding improved clearly — and the words trained there were personally chosen. Transfer into conversation did not happen by itself. So: add your own words, and say the everyday sentences out loud for real.'),
            h('h2', {}, 'Pace and breaks'),
            h('p', {}, 'Shortly after surgery, what matters is not the amount but that practice stays possible at all. In a trial of very early intensive aphasia therapy, a large share of participants could not manage the prescribed amount. That is why this app asks about the pace during a session — and then actually makes the session shorter.'),
            h('h2', {}, 'What this app is not'),
            h('p', {}, 'Not a medical device. Not a diagnosis. Not therapy. If speech therapy is running and you are in Germany, the ', h('strong', {}, 'neolexon aphasia app'), ' is a reimbursable alternative (listed in the DiGA register, PZN 18017082), unlocked by the treating therapist and paid for by statutory health insurance.'),
            h('h2', {}, 'Your data'),
            h('p', {}, 'Everything stays in this browser, on this device. There is no server, no account, no transmission. Voice recordings stay local and are not stored.')
          ),
          h('p', { class: 'hint' }, t('wb_disclaimer'))
        ),
        h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { window.App.go('home'); } }, t('back'))
      );
    }
  };

  /* ================= Settings ================= */
  function segmented(label, value, options, onPick, describedBy) {
    var row = h('div', { class: 'segmented', role: 'group', 'aria-label': label });
    options.forEach(function (o) {
      row.appendChild(h('button', {
        class: 'btn btn-outline', type: 'button', 'aria-pressed': String(o.v === value),
        onclick: function () { onPick(o.v); }
      }, o.l));
    });
    return h('div', { class: 'field' },
      h('label', { id: describedBy || null }, label),
      row);
  }

  function toggleRow(label, desc, checked, onToggle) {
    return h('div', { class: 'field' },
      h('div', { class: 'switch-row' },
        h('div', {}, h('span', { class: 'lbl' }, label), desc ? h('div', { class: 'hint' }, desc) : null),
        h('button', {
          class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(!!checked),
          'aria-label': label, onclick: function () { onToggle(!checked); }
        })
      ));
  }


  /* The optional Piper voice: one clear offer, a real progress bar, and an
     honest size. Nothing here is required for the app to work. */
  function neuralVoiceField(lang, rerender) {
    if (!window.NeuralVoice) return null;
    var box = h('div', { class: 'field' });
    var status = h('p', { class: 'hint' });

    if (window.NeuralVoice.ready(lang)) {
      box.appendChild(h('div', { class: 'encourage' }, t('nv_ready')));
      box.appendChild(h('p', { class: 'hint' }, window.NeuralVoice.voiceId(lang)));
      box.appendChild(h('div', { class: 'btn-row', style: { marginTop: '.7rem' } },
        h('button', {
          class: 'btn btn-outline', type: 'button',
          onclick: function () { window.Speech.speak(t('set_testText'), { lang: lang }); }
        }, h('span', { 'aria-hidden': 'true' }, '🔊'), t('set_test')),
        h('button', {
          class: 'btn btn-quiet', type: 'button',
          onclick: function () {
            window.UI.confirmSheet(t('nv_remove'), '', t('nv_remove'), function () {
              window.NeuralVoice.remove(lang).then(rerender);
            }, true);
          }
        }, t('nv_remove'))));
      return box;
    }

    box.appendChild(h('h3', { text: t('nv_title'), style: { marginBottom: '.3rem' } }));
    box.appendChild(h('p', { class: 'muted', text: t('nv_intro') }));

    var bar = h('div', { class: 'progress-track', style: { display: 'none', marginTop: '.8rem' } },
      h('div', { class: 'progress-fill', style: { width: '0%' } }));

    var row = h('div', { class: 'stack-sm', style: { marginTop: '.8rem' } });
    window.NeuralVoice.catalogue(lang).forEach(function (v) {
      var btn = h('button', {
        class: 'btn btn-outline btn-block', type: 'button',
        onclick: function () {
          btn.disabled = true;
          bar.style.display = '';
          status.textContent = t('nv_installing', { pct: 0 });
          window.NeuralVoice.install(lang, v.id, function (pct) {
            bar.firstChild.style.width = pct + '%';
            status.textContent = t('nv_installing', { pct: pct });
          }).then(function () {
            window.UI.toast(t('nv_ready'));
            rerender();
          }).catch(function () {
            btn.disabled = false;
            bar.style.display = 'none';
            status.textContent = t('nv_failed');
          });
        }
      },
        h('span', {},
          h('span', { style: { fontWeight: '700' } }, v.quality === 'good' ? t('nv_good') : t('nv_small')),
          h('span', { class: 'tile-desc' }, t('nv_size', { mb: v.mb }))));
      row.appendChild(btn);
    });

    box.appendChild(row);
    box.appendChild(bar);
    box.appendChild(status);
    box.appendChild(h('p', { class: 'hint' }, t('nv_wifi')));
    return box;
  }

  window.SettingsScreen = {
    render: function (go, rerender, VERSION) {
      var s = window.Store.settings;
      var lang = window.UI.lang();

      function set(k, v) { window.Store.set('settings.' + k, v); rerender(); }

      var voices = window.Speech.voicesFor(lang);
      var voiceField;
      if (!window.Speech.supported() || !voices.length) {
        voiceField = h('div', { class: 'field' },
          h('label', {}, t('set_voice')),
          h('p', { class: 'hint' }, t('set_voice_none') + ' · ' + t('set_voice_note')));
      } else {
        var sel = h('select', {
          id: 'voiceSel', onchange: function (e) {
            var v = window.Store.settings.voiceURI;
            v[lang] = e.target.value || null;
            window.Store.set('settings.voiceURI', v);
          }
        }, h('option', { value: '' }, '—'));
        voices.forEach(function (v) {
          sel.appendChild(h('option', { value: v.voiceURI, selected: s.voiceURI[lang] === v.voiceURI }, v.name + ' (' + v.lang + ')'));
        });
        voiceField = h('div', { class: 'field' },
          h('label', { for: 'voiceSel' }, t('set_voice')),
          sel,
          h('p', { class: 'hint' }, t('set_voice_note')),
          h('div', { class: 'btn-row', style: { marginTop: '.7rem' } },
            h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { window.Speech.speak(t('set_testText')); } },
              h('span', { 'aria-hidden': 'true' }, '🔊'), t('set_test'))));
      }

      var fileInput = h('input', {
        type: 'file', accept: 'application/json', class: 'sr-only', id: 'importFile',
        'aria-label': t('set_import'),
        onchange: function (e) {
          var f = e.target.files && e.target.files[0];
          if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            try { window.Store.importJSON(String(r.result)); window.UI.toast(t('set_imported')); rerender(); }
            catch (err) { window.UI.toast(t('set_importErr')); }
          };
          r.readAsText(f);
        }
      });

      return h('div', { class: 'stack' },
        h('section', { class: 'card' },
          h('h1', { text: t('set_title') }),
          (function () {
            var nameIn = h('input', { type: 'text', id: 'setName', maxlength: '24', value: s.name || '' });
            nameIn.addEventListener('change', function () { window.Store.set('settings.name', nameIn.value.trim().slice(0, 24)); });
            return h('div', { class: 'field' }, h('label', { for: 'setName' }, t('set_name')), nameIn);
          })(),
          (function () {
            var pIn = h('input', { type: 'text', id: 'setPartner', maxlength: '24', value: s.partner || '' });
            pIn.addEventListener('change', function () { window.Store.set('settings.partner', pIn.value.trim().slice(0, 24)); });
            return h('div', { class: 'field' },
              h('label', { for: 'setPartner' }, t('set_partner')), pIn,
              h('p', { class: 'hint' }, t('set_partner_d')));
          })(),
          segmented(t('set_lang'), lang, [{ v: 'de', l: 'Deutsch' }, { v: 'en', l: 'English' }], function (v) { set('lang', v); }),
          segmented(t('set_text'), s.textSize, [
            { v: 's', l: t('set_text_s') }, { v: 'm', l: t('set_text_m') },
            { v: 'l', l: t('set_text_l') }, { v: 'xl', l: t('set_text_xl') }
          ], function (v) { set('textSize', v); }),
          segmented(t('set_theme'), s.theme, [
            { v: 'auto', l: t('set_theme_auto') }, { v: 'light', l: t('set_theme_light') }, { v: 'dark', l: t('set_theme_dark') }
          ], function (v) { set('theme', v); }),
          toggleRow(t('set_contrast'), t('set_contrast_d'), s.contrast, function (v) { set('contrast', v); }),
          toggleRow(t('set_motion'), t('set_motion_d'), s.reduceMotion, function (v) { set('reduceMotion', v); })
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('set_mode') }),
          segmented(t('set_mode'), s.mode || 'both', [
            { v: 'both', l: t('mode_both') }, { v: 'board', l: t('mode_board') }, { v: 'training', l: t('mode_training') }
          ], function (v) { set('mode', v); }),
          h('p', { class: 'hint', text: t('mode_' + (s.mode || 'both') + '_d') }),
          (s.mode === 'training') ? h('p', { class: 'hint', text: t('mode_board_note') }) : null,
          toggleRow(t('set_lock'), t('set_unlock_hint'), s.lockSettings, function (v) {
            if (v && !window.Store.hasPin()) { go('review'); return; }   // set a PIN first
            set('lockSettings', v);
          })
        ),

        h('section', { class: 'card' },
          h('h2', { text: t('set_len') }),
          segmented(t('set_len'), s.sessionLen, [
            { v: 's', l: t('set_len_s') }, { v: 'm', l: t('set_len_m') }, { v: 'l', l: t('set_len_l') }
          ], function (v) { set('sessionLen', v); }),
          toggleRow(t('set_pace'), t('set_pace_d'), s.gentlePace, function (v) { set('gentlePace', v); }),
          toggleRow(t('set_check'), t('set_check_d'), s.checkIn, function (v) { set('checkIn', v); }),
          s.checkIn ? segmented(t('set_checkEvery', { n: s.checkEvery }), s.checkEvery, [
            { v: 3, l: '3' }, { v: 4, l: '4' }, { v: 6, l: '6' }
          ], function (v) { set('checkEvery', v); }) : null,
          segmented(t('set_wb'), s.painAsk, [
            { v: 'off', l: t('set_wb_off') }, { v: 'some', l: t('set_wb_some') }, { v: 'always', l: t('set_wb_always') }
          ], function (v) { set('painAsk', v); })
        ),

        h('section', { class: 'card' },
          h('details', { class: 'disclose' },
          h('summary', {}, t('set_voice')),
          neuralVoiceField(lang, rerender),
          voiceField,
          segmented(t('set_rate'), s.rate <= 0.58 ? 'veryslow' : (s.rate <= 0.8 ? 'slow' : 'normal'), [
            { v: 'veryslow', l: t('set_rate_veryslow') },
            { v: 'slow', l: t('set_rate_slow') },
            { v: 'normal', l: t('set_rate_normal') }
          ], function (v) { set('rate', v === 'veryslow' ? 0.5 : v === 'slow' ? 0.72 : 0.92); }),
          window.Speech.voiceName(lang)
            ? h('p', { class: 'hint' }, t('set_voiceUsed') + ': ' + window.Speech.voiceName(lang))
            : null)
        ),

        h('section', { class: 'card' },
          h('details', { class: 'disclose' },
          h('summary', {}, t('set_data')),
          h('p', { class: 'muted', text: t('set_data_d') }),
          !window.Store.isPersistent() ? h('p', { class: 'err' }, lang === 'de'
            ? 'Achtung: Dieser Browser speichert gerade nichts dauerhaft (privates Fenster?). Der Fortschritt geht beim Schließen verloren.'
            : 'Careful: this browser is not storing anything permanently (private window?). Progress will be lost when you close it.') : null,
          h('div', { class: 'btn-row' },
            h('button', {
              class: 'btn btn-outline', type: 'button', onclick: function () {
                var blob = new Blob([window.Store.exportJSON()], { type: 'application/json' });
                var a = h('a', { href: URL.createObjectURL(blob), download: 'wortfaden-' + window.UI.dayKey(new Date()) + '.json' });
                document.body.appendChild(a); a.click();
                setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
              }
            }, t('set_export')),
            h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { fileInput.click(); } }, t('set_import')),
            fileInput,
            h('button', {
              class: 'btn btn-quiet', type: 'button', onclick: function () {
                window.UI.confirmSheet(t('set_reset'), t('set_resetConfirm'), t('set_reset'), function () {
                  window.Store.reset(); window.location.reload();
                }, true);
              }
            }, t('set_reset'))
          ),
          window.Store.hasPin() ? h('div', { style: { marginTop: '1rem' } },
            h('button', { class: 'btn btn-ghost', type: 'button', onclick: function () { go('review'); } },
              h('span', { 'aria-hidden': 'true' }, '🔒'), t('ad_openHint'))) : null)
        ),
        h('section', { class: 'card' },
          h('div', { class: 'btn-row' },
            h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { go('words'); } },
              h('span', { 'aria-hidden': 'true' }, '⭐'), t('nav_words')),
            h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { go('about'); } },
              h('span', { 'aria-hidden': 'true' }, 'ℹ️'), t('set_about')),
            h('button', {
              class: 'btn btn-outline', type: 'button',
              onclick: function () { window.Onboarding.stepFor = 0; go('onboarding'); }
            }, h('span', { 'aria-hidden': 'true' }, '👋'), t('set_onboarding')),
            (function () {
              // Discreet entry to the review area: five taps, so it does not
              // read as a feature to the person practising.
              var taps = 0, timer = null;
              return h('button', {
                class: 'btn btn-ghost', type: 'button', 'aria-label': t('ad_openHint'),
                onclick: function () {
                  taps++;
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(function () { taps = 0; }, 2500);
                  if (taps >= 5 || window.Store.hasPin()) { taps = 0; go('review'); }
                }
              }, h('span', { 'aria-hidden': 'true' }, '🔒'));
            })()
          )
        ),
        h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('home'); } }, t('back'))
      );
    }
  };

  /* ================= My words ================= */
  window.MyWords = {
    render: function (go) {
      var list = h('ul', { class: 'list' });

      function paintList() {
        window.UI.clear(list);
        var mine = window.Store.mine;
        if (!mine.length) {
          list.appendChild(h('li', {}, h('p', { class: 'muted', text: t('words_none') })));
          return;
        }
        mine.slice().reverse().forEach(function (m) {
          var stat = window.Store.wordStat(m.id);
          list.appendChild(h('li', {},
            h('div', { class: 'listitem' },
              h('div', { class: 'thumb' }, m.photo ? h('img', { src: m.photo, alt: '' }) : h('span', { 'aria-hidden': 'true' }, '⭐')),
              h('div', { class: 'grow' },
                h('strong', {}, m.word),
                m.hint ? h('div', { class: 'hint' }, m.hint) : null,
                h('div', { class: 'hint' }, t('ad_box', { n: stat.box }) + ' · ' + stat.seen + ' ' + t('ad_attempts'))
              ),
              h('button', {
                class: 'btn btn-quiet btn-icon', type: 'button', 'aria-label': t('words_delete') + ': ' + m.word,
                onclick: function () {
                  window.UI.confirmSheet(t('words_delete'), t('words_deleteConfirm') + ' „' + m.word + '“', t('words_delete'), function () {
                    window.Store.removeMine(m.id); paintList();
                  }, true);
                }
              }, h('span', { 'aria-hidden': 'true' }, '🗑')))));
        });
      }
      paintList();

      var wordIn = h('input', { type: 'text', id: 'mwWord', autocomplete: 'off', maxlength: '60' });
      var hintIn = h('input', { type: 'text', id: 'mwHint', autocomplete: 'off', maxlength: '140' });
      var photoData = null;
      var preview = h('div', { class: 'thumb', style: { width: '4.5rem', height: '4.5rem' } }, h('span', { 'aria-hidden': 'true' }, '⭐'));
      var err = h('p', { class: 'err hidden' });

      var photoIn = h('input', {
        type: 'file', accept: 'image/*', class: 'sr-only', id: 'mwPhoto',
        'aria-label': t('words_photo'),
        onchange: function (e) {
          var f = e.target.files && e.target.files[0];
          if (!f) return;
          shrinkImage(f, 640, function (dataUrl) {
            photoData = dataUrl;
            window.UI.clear(preview).appendChild(h('img', { src: dataUrl, alt: '' }));
          });
        }
      });

      function save() {
        var w = wordIn.value.trim();
        if (!w) { err.textContent = t('words_emptyErr'); err.classList.remove('hidden'); wordIn.focus(); return; }
        err.classList.add('hidden');
        window.Store.addMine({ word: w, hint: hintIn.value.trim(), photo: photoData });
        wordIn.value = ''; hintIn.value = ''; photoData = null;
        window.UI.clear(preview).appendChild(h('span', { 'aria-hidden': 'true' }, '⭐'));
        window.UI.toast(t('words_saved'));
        paintList();
        wordIn.focus();
      }

      return h('div', { class: 'stack' },
        h('section', { class: 'card' },
          h('h1', { text: t('words_title') }),
          h('p', { class: 'muted', text: t('words_intro') })
        ),
        h('section', { class: 'card' },
          h('h2', { text: t('words_add') }),
          h('div', { class: 'field' }, h('label', { for: 'mwWord' }, t('words_word')), wordIn),
          h('div', { class: 'field' }, h('label', { for: 'mwHint' }, t('words_hint')), hintIn,
            h('p', { class: 'hint' }, window.UI.lang() === 'de'
              ? 'Tipp: Schreib ___ an die Stelle des Wortes, dann wird ein Lückensatz daraus. Zum Beispiel: „Meine Schwester heißt ___.“'
              : 'Tip: write ___ where the word goes and it becomes a sentence to complete. For example: “My sister is called ___.”')),
          h('div', { class: 'field' },
            h('label', {}, t('words_photo')),
            h('div', { class: 'btn-row', style: { alignItems: 'center' } },
              preview,
              h('button', { class: 'btn btn-outline', type: 'button', onclick: function () { photoIn.click(); } },
                h('span', { 'aria-hidden': 'true' }, '📷'), t('words_photo')),
              photoData ? null : null),
            photoIn),
          err,
          h('button', { class: 'btn btn-primary btn-block btn-big', type: 'button', onclick: save }, t('save'))
        ),
        h('section', {}, h('h2', { text: t('words_title') }), list),
        h('button', { class: 'btn btn-outline btn-block', type: 'button', onclick: function () { go('home'); } }, t('back'))
      );
    }
  };

  /* Downscale before storing: localStorage is small, and a phone photo is not. */
  function shrinkImage(file, maxEdge, cb) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function () {
      var scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      var w = Math.round(img.width * scale), hh = Math.round(img.height * scale);
      var c = document.createElement('canvas');
      c.width = w; c.height = hh;
      c.getContext('2d').drawImage(img, 0, 0, w, hh);
      URL.revokeObjectURL(url);
      try { cb(c.toDataURL('image/jpeg', 0.75)); } catch (e) { cb(null); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(null); };
    img.src = url;
  }

  /* ================= Wellbeing ================= */
  var PAIN_STEPS = [
    { v: 0, face: '😀', key: 'wb_p0' }, { v: 2, face: '🙂', key: 'wb_p2' }, { v: 4, face: '😐', key: 'wb_p4' },
    { v: 6, face: '🙁', key: 'wb_p6' }, { v: 8, face: '😣', key: 'wb_p8' }, { v: 10, face: '😖', key: 'wb_p10' }
  ];

  function painScale(onPick) {
    var row = h('div', { class: 'painscale', role: 'group', 'aria-label': t('wb_pain_scale') });
    PAIN_STEPS.forEach(function (p) {
      row.appendChild(h('button', {
        class: 'painbtn', type: 'button', 'aria-pressed': 'false',
        'aria-label': p.v + ' — ' + t(p.key),
        onclick: function () {
          Array.prototype.forEach.call(row.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
          this.setAttribute('aria-pressed', 'true');
          onPick(p.v);
        }
      },
        h('span', { class: 'face', 'aria-hidden': 'true' }, p.face),
        h('span', { class: 'n' }, String(p.v)),
        h('span', { class: 'lbl' }, t(p.key))));
    });
    return row;
  }

  function painAlert() {
    return h('div', { class: 'cue', role: 'alert' },
      h('div', { class: 'cue-label' }, t('wb_alert_title')),
      h('div', { class: 'cue-body', style: { fontWeight: '600', fontSize: '1rem' } }, t('wb_alert_body')));
  }

  window.Wellbeing = {
    /* Asked inside a session, never as a menu of its own. Two taps at most,
     * and skipping is always one tap away. */
    quickCard: function (done) {
      var host = h('div', { class: 'exercise' });

      function save(pain, where) {
        window.Store.addWellbeing({ pain: pain, where: where || [], energy: null, note: '' });
        window.UI.toast(t('wb_saved'));
        done();
      }

      function askScale() {
        window.UI.clear(host);
        var picked = null, where = [];
        var alertHost = h('div', {});
        var whereRow = h('div', { class: 'chipset' });
        ['kopf', 'nacken', 'augen', 'ruecken', 'andere'].forEach(function (k) {
          whereRow.appendChild(h('button', {
            class: 'chip', type: 'button', 'aria-pressed': 'false',
            onclick: function () {
              var on = this.getAttribute('aria-pressed') === 'true';
              this.setAttribute('aria-pressed', String(!on));
              if (on) where = where.filter(function (x) { return x !== k; }); else where.push(k);
            }
          }, t('wb_where_' + k)));
        });
        var saveBtn = h('button', {
          class: 'btn btn-primary btn-block btn-big', type: 'button', disabled: true,
          onclick: function () { save(picked, where); }
        }, t('wb_save'));

        host.appendChild(h('h2', { text: t('wb_pain_scale') }));
        host.appendChild(painScale(function (v) {
          picked = v;
          saveBtn.disabled = false;
          window.UI.clear(alertHost);
          if (v >= 6) alertHost.appendChild(painAlert());
        }));
        host.appendChild(alertHost);
        host.appendChild(h('div', { class: 'field' }, h('label', {}, t('wb_where')), whereRow));
        host.appendChild(h('div', { class: 'actions stack-sm' }, saveBtn,
          h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: done }, t('wb_skip'))));
        window.UI.announce(t('wb_pain_scale'));
      }

      host.appendChild(h('div', { class: 'card center' },
        h('h1', { text: t('wb_pain_q'), style: { margin: '0' } })));
      host.appendChild(h('div', { class: 'actions stack-sm' },
        h('button', {
          class: 'btn btn-calm btn-block btn-big', type: 'button',
          onclick: function () { save(0, []); }
        }, h('span', { 'aria-hidden': 'true' }, '\ud83d\ude00'), t('wb_pain_no')),
        h('button', {
          class: 'btn btn-outline btn-block btn-big', type: 'button', onclick: askScale
        }, h('span', { 'aria-hidden': 'true' }, '\ud83d\ude41'), t('wb_pain_yes')),
        h('button', { class: 'btn btn-ghost btn-block', type: 'button', onclick: done }, t('wb_skip'))));
      return host;
    },

    painScale: painScale,
    painAlert: painAlert,
    PAIN_STEPS: PAIN_STEPS
  };
})();
