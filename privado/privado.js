/* Página privada: experiencias en pestañas, ideas para inspirarse (destinos con ejemplos) y «Cuéntenos qué está buscando»
   (cinco preguntas y contacto). Textos de opciones en opciones.js. */
(function () {
  'use strict';

  /* URL del Apps Script que guarda la ficha y envía los emails. Vacía = modo borrador: no envía nada. */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxdcMsTxFNCOrOYl1ziEaTNTgGag7k4pd7r06qG1MA_9OvyNDOZ-dZNjfZcL8kisvaa/exec';

  var P = window.PRIVADO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var params = new URLSearchParams(location.search);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Enlace de socio: ?ref=codigo, el mismo criterio y la misma clave que la landing general (app.js). */
  var REF = (function () {
    var KEY = 'evermind_ref', DAYS = 90, raw = (params.get('ref') || '').toLowerCase().trim();
    var ok = /^[a-z0-9_-]{2,40}$/.test(raw) ? raw : '';
    try {
      if (ok) localStorage.setItem(KEY, JSON.stringify({ v: ok, t: Date.now() }));
      else {
        var s = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (s && Date.now() - s.t < DAYS * 864e5) ok = s.v;
      }
    } catch (e) { /* sin almacenamiento: vale solo el enlace */ }
    return ok;
  })();

  var state = { started: false, answers: {}, step: 0, pref: 'whatsapp', sent: false, startedAt: Date.now(), contact: null };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /* ---------- Desplazamiento suave ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.2, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  function go(id) {
    var t = document.getElementById(id); if (!t) return;
    if (lenis) lenis.scrollTo(t, { offset: -40 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]');
    if (t) { e.preventDefault(); showExp(t.getAttribute('data-tab')); go('experiencias'); return; }
    var a = e.target.closest('[data-go]'); if (!a) return;
    e.preventDefault(); go(a.getAttribute('data-go'));
  });

  /* ---------- Cabecera ---------- */
  var top = $('#top');
  function onScroll() { top.classList.toggle('solid', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Experiencias en pestañas ---------- */
  var current = P.experiences[0].id;
  P.experiences.forEach(function (x) {
    $('#tabs').appendChild(el('button', { class: 'tab', type: 'button', role: 'tab', id: 'tab-' + x.id, 'aria-controls': 'expPanel', 'aria-selected': 'false', text: x.tab,
      onclick: function () { showExp(x.id); } }));
  });
  $('#tabs').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var ids = P.experiences.map(function (x) { return x.id; }), i = ids.indexOf(current);
    var nx = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
    showExp(nx); $('#tab-' + nx).focus();
  });
  function showExp(id) {
    current = id;
    var x = P.experiences.filter(function (e) { return e.id === id; })[0];
    document.querySelectorAll('.tab').forEach(function (t) { var on = t.id === 'tab-' + id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    var panel = $('#expPanel'); panel.setAttribute('aria-labelledby', 'tab-' + id); panel.innerHTML = '';
    panel.appendChild(el('div', { class: 'exp step-in' }, [
      el('figure', {}, [el('img', { src: x.img, alt: x.title }), el('figcaption', { text: x.credit })]),
      el('div', { class: 'body' }, [
        el('p', { class: 'caps', text: x.kicker }), el('h3', { text: x.title }), el('p', { class: 'lead2', text: x.lead }),
        el('ul', {}, x.points.map(function (t) { return el('li', { text: t }); })),
        el('p', { class: 'ex', text: x.example }),
        el('button', { class: 'btn', type: 'button', text: 'Me interesa', onclick: function () { startWith(x.id); } })
      ])
    ]));
  }
  showExp(current);

  /* ---------- Ideas para inspirarse (destinos con ejemplos; no se seleccionan) ---------- */
  P.ideas.forEach(function (s) {
    $('#ideasGrid').appendChild(el('article', { class: 'idea rv' }, [
      el('figure', {}, [el('img', { src: s.img, alt: s.title + ', ' + s.place, loading: 'lazy' }), el('figcaption', { text: s.credit || 'Imagen ilustrativa' })]),
      el('h3', { text: s.title }), el('p', { class: 'place', text: s.place }), el('p', { class: 'd', text: s.text }),
      el('ul', { class: 'examples' }, s.examples.map(function (t) { return el('li', { text: t }); }))
    ]));
  });

  /* ---------- Apariciones (el contenido ya es visible; solo se asienta) ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.rv').forEach(function (n) { io.observe(n); });
    setTimeout(function () { document.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); }); }, 4000);
  } else document.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); });

  /* ---------- Cuéntenos qué está buscando ---------- */
  var Q = P.questions, TOTAL = Q.length + 1;
  function begin() {
    state.started = true; $('#start').hidden = true; $('#panel').hidden = false;
    render(true);
  }
  function startWith(expId) {
    var t = state.answers.tipo || [];
    if (t.indexOf(expId) === -1) t = t.concat(expId);
    state.answers.tipo = t;
    if (!state.started) begin();
    go('viaje');
  }
  $('#start').addEventListener('click', begin);

  function render(focus) {
    var panel = $('#panel'); panel.innerHTML = '';
    if (state.sent) { panel.appendChild(doneView()); return; }
    var i = state.step;
    var bar = el('div', { class: 'progress' }, [el('i')]);
    bar.firstChild.style.width = Math.round(i / TOTAL * 100) + '%';
    panel.appendChild(el('div', { class: 'meta' }, [el('span', { class: 'caps', text: (i + 1) + ' / ' + TOTAL }),
      i > 0 ? el('button', { class: 'link', type: 'button', text: '← Atrás', onclick: function () { state.step--; render(true); } }) : null]));
    panel.appendChild(bar);
    var body = i < Q.length ? questionView(Q[i]) : contactView();
    body.classList.add('step-in'); panel.appendChild(body);
    if (focus) { var f = body.querySelector('button.opt, textarea, input'); if (f) f.focus({ preventScroll: true }); }
  }
  function next() { state.step++; render(true); }

  function questionView(q) {
    var wrap = el('div', { style: 'display:grid;gap:22px' });
    wrap.appendChild(el('h3', { text: q.q }));
    if (q.help) wrap.appendChild(el('p', { class: 'help', text: q.help }));
    if (q.text) {
      var ta = el('textarea', { id: 'p-' + q.id, maxlength: '1500', 'aria-label': q.q });
      ta.value = state.answers[q.id] || '';
      ta.addEventListener('input', function () { state.answers[q.id] = ta.value; });
      wrap.appendChild(el('div', { class: 'field' }, [ta]));
      wrap.appendChild(el('div', { class: 'actions' }, [el('button', { class: 'btn', type: 'button', text: 'Continuar', onclick: next })]));
      return wrap;
    }
    var sel = q.multi ? (state.answers[q.id] || []).slice() : state.answers[q.id];
    var opts = el('div', { class: 'opts' }), cont;
    q.options.forEach(function (o) {
      var on = q.multi ? sel.indexOf(o.v) !== -1 : sel === o.v;
      opts.appendChild(el('button', { class: 'opt', type: 'button', 'aria-pressed': String(on), text: o.label, onclick: function () {
        if (q.multi) {
          var k = sel.indexOf(o.v);
          if (k !== -1) sel.splice(k, 1); else sel.push(o.v);
          state.answers[q.id] = sel.slice();
          this.setAttribute('aria-pressed', String(k === -1));
          cont.disabled = !sel.length;
        } else {
          state.answers[q.id] = o.v;
          opts.querySelectorAll('.opt').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
          this.setAttribute('aria-pressed', 'true');
          setTimeout(next, reduce ? 0 : 260);
        }
      } }));
    });
    wrap.appendChild(opts);
    if (q.multi) {
      cont = el('button', { class: 'btn', type: 'button', text: 'Continuar', onclick: next });
      cont.disabled = !sel.length;
      wrap.appendChild(el('div', { class: 'actions' }, [cont]));
    }
    return wrap;
  }

  function field(name, label, type, opts) {
    opts = opts || {};
    var input = el('input', { id: 'p-' + name, name: name, type: type, maxlength: opts.max || '120' });
    if (opts.auto) input.setAttribute('autocomplete', opts.auto);
    if (opts.req) input.setAttribute('required', '');
    if (state.contact && state.contact[name]) input.value = state.contact[name];
    return el('div', { class: 'field' }, [el('label', { for: 'p-' + name, text: label }), input, el('span', { class: 'err' })]);
  }

  function contactView() {
    var wrap = el('div', { style: 'display:grid;gap:22px' });
    wrap.appendChild(el('h3', { text: '¿Dónde le enviamos su propuesta?' }));
    var form = el('form', { class: 'form', novalidate: '' });
    form.appendChild(field('nombre', 'Nombre', 'text', { req: true, auto: 'name', max: '80' }));
    form.appendChild(field('email', 'Email', 'email', { req: true, auto: 'email' }));
    form.appendChild(field('telefono', 'WhatsApp o teléfono', 'tel', { auto: 'tel', max: '40' }));
    form.appendChild(field('pais', 'País de residencia', 'text', { req: true, auto: 'country-name', max: '60' }));
    var seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Forma de contacto preferida' });
    P.contactPref.forEach(function (o) {
      seg.appendChild(el('button', { type: 'button', 'aria-pressed': String(state.pref === o.v), text: o.label, onclick: function () {
        state.pref = o.v; seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); this.setAttribute('aria-pressed', 'true');
      } }));
    });
    form.appendChild(el('div', { class: 'field full' }, [el('span', { class: 'caps', style: 'font-family:var(--ui);font-size:11px;letter-spacing:.14em;color:var(--ivory-2)', text: '¿Cómo prefiere que le contactemos?' }), seg]));
    form.appendChild(el('div', { class: 'hp', 'aria-hidden': 'true' }, [el('label', { for: 'p-web', text: 'Web' }), el('input', { id: 'p-web', name: 'web', type: 'text', tabindex: '-1', autocomplete: 'off' })]));
    var consent = el('label', { class: 'check full' }, [el('input', { type: 'checkbox', name: 'consent', id: 'p-consent' }),
      el('span', { html: 'Acepto el tratamiento de mis datos para preparar y enviarme la propuesta. <a href="../privacidad.html" target="_blank" rel="noopener">Política de privacidad</a>.' })]);
    form.appendChild(consent);
    var err = el('p', { class: 'formerr full', role: 'alert' });
    var submit = el('button', { class: 'btn', type: 'submit', text: 'Solicitar propuesta' });
    form.appendChild(el('div', { class: 'actions full' }, [submit, el('span', { class: 'help', style: 'margin:0;font-size:16px', text: 'Le escribiremos en un plazo de 48 horas.' })]));
    form.appendChild(err);

    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.textContent = '';
      var ok = true, data = {};
      form.querySelectorAll('.field input').forEach(function (inp) {
        if (inp.name === 'web') return;
        var v = inp.value.trim(), msg = '';
        if (inp.required && !v) msg = 'Este dato es necesario.';
        else if (inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Revise su correo electrónico.';
        var f = inp.closest('.field'); f.classList.toggle('bad', !!msg); f.querySelector('.err').textContent = msg;
        if (msg) ok = false; data[inp.name] = v;
      });
      var c = form.querySelector('#p-consent').checked;
      consent.classList.toggle('bad', !c);
      if (!c) { ok = false; err.textContent = 'Para enviarle la propuesta necesitamos su consentimiento.'; }
      if (!ok) { var first = form.querySelector('.bad input, .check.bad input'); if (first) first.focus(); return; }
      data.web = form.querySelector('#p-web').value; data.preferencia = state.pref; data.mensaje = (state.answers.comentarios || '').trim();
      state.contact = data;
      submit.disabled = true; submit.textContent = 'Enviando…';
      send(data).then(function () { state.sent = true; render(); go('viaje'); })
        .catch(function () { submit.disabled = false; submit.textContent = 'Solicitar propuesta'; err.textContent = 'No se pudo enviar. Inténtelo de nuevo o escríbanos por WhatsApp.'; });
    });
    wrap.appendChild(form);
    return wrap;
  }

  function send(contact) {
    var a = {}; Q.forEach(function (q) { if (!q.text) a[q.id] = state.answers[q.id]; });
    var payload = {
      door: 'privado', answers: a, contact: contact,
      consent: { given: true, version: 'privacidad-2026-10-17', at: new Date().toISOString() },
      ref: REF, source: REF ? 'ref=' + REF + (document.referrer ? ' · ' + document.referrer : '') : document.referrer || '',
      elapsedMs: Date.now() - state.startedAt
    };
    if (!ENDPOINT) {
      console.info('[modo borrador] ficha no enviada', payload);
      var bn = document.getElementById('draftBanner'); if (bn) bn.textContent = 'BORRADOR · ficha no enviada · origen: ' + (payload.source || 'directo');
      return Promise.resolve();
    }
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'error'); });
  }

  function doneView() {
    var name = (state.contact.nombre || '').split(' ')[0];
    var dl = el('dl', { class: 'ticket' });
    Q.forEach(function (q) {
      var v = P.label(q.id, state.answers[q.id]); if (!v) return;
      dl.appendChild(el('dt', { text: q.q.replace(/^¿|\?$/g, '') })); dl.appendChild(el('dd', { text: v }));
    });
    return el('div', { class: 'done step-in' }, [
      el('p', { class: 'caps', text: 'Solicitud recibida' }),
      el('h3', { text: 'Gracias' + (name ? ', ' + name : '') + '.' }),
      el('p', { text: 'Prepararemos su propuesta y le contactaremos personalmente en un plazo de 48 horas.' }),
      dl,
      el('div', { class: 'actions' }, [el('a', { class: 'btn ghost', href: P.whatsappUrl, target: '_blank', rel: 'noopener', text: 'Escribir por WhatsApp' })])
    ]);
  }

  onScroll();
  if (location.hash === '#viaje') setTimeout(function () { go('viaje'); }, 400);
})();
