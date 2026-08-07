/** Wiring between the form, the calculator and the page. */
(function () {
  'use strict';

  const fmt = window.Calculator.fmt;
  const form = document.getElementById('form');
  const results = document.getElementById('results');
  const breakdown = document.getElementById('breakdown');
  let current = null;
  let months = window.RATES.payments.defaultOption;
  let companySize = window.RATES.wageGuaranteeFunds.defaultOption;
  let firstYear = false;

  /** The radio group owns its own selected state, so this only carries the value. */
  function onPick(name, handler) {
    document.querySelectorAll('input[name="' + name + '"]').forEach((input) => {
      input.addEventListener('change', function () {
        handler(input.value);
      });
    });
  }

  function renderBreakdown(result) {
    breakdown.innerHTML = '';
    result.steps.forEach((step) => {
      const tr = document.createElement('tr');
      if (step.emphasis) tr.classList.add('emphasis');
      if (step.total) tr.classList.add('total');

      const left = document.createElement('td');
      const label = document.createElement('div');
      label.className = 'row-label';
      label.textContent = step.label;
      left.appendChild(label);

      if (step.detail) {
        const detail = document.createElement('div');
        detail.className = 'row-detail';
        detail.textContent = step.detail;
        if (step.sourceKey && window.SOURCES[step.sourceKey]) {
          const src = window.SOURCES[step.sourceKey];
          detail.appendChild(document.createTextNode(' '));
          const a = document.createElement('a');
          a.href = src.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = 'fonte';
          detail.appendChild(a);
        }
        left.appendChild(detail);
      }

      const right = document.createElement('td');
      right.className = 'amount';
      if (step.sign === -1) right.classList.add('minus');
      if (step.sign === 1) right.classList.add('plus');
      const prefix = step.sign === -1 ? '−' : step.sign === 1 ? '+' : '';
      right.textContent = prefix + fmt(step.amount);

      tr.appendChild(left);
      tr.appendChild(right);
      breakdown.appendChild(tr);
    });
  }

  function renderMonthly() {
    if (!current) return;
    document.getElementById('netMonthly').textContent =
      fmt(current.monthly[months]) + ' / mese';
  }

  function renderSources() {
    const container = document.getElementById('sources');
    const seen = new Set();

    Object.keys(window.RATES).forEach((key) => {
      const entry = window.RATES[key];
      if (!entry || typeof entry !== 'object' || !entry.kind) return;
      const src = entry.source ? window.SOURCES[entry.source] : null;
      const id = entry.source || key;
      if (seen.has(id)) return;
      seen.add(id);

      const div = document.createElement('div');
      div.className = 'source';

      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = src ? src.label : 'CCNL Terziario Distribuzione e Servizi';
      const kind = document.createElement('span');
      kind.className = 'kind kind-' + entry.kind;
      kind.textContent = entry.kind === 'annual' ? 'annuale' : 'strutturale';
      name.appendChild(kind);
      div.appendChild(name);

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = src ? src.norm + ' · ' + src.updated : entry.note;
      div.appendChild(meta);

      if (src) {
        const a = document.createElement('a');
        a.href = src.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = src.url;
        div.appendChild(a);
      }

      container.appendChild(div);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const gross = Number(document.getElementById('ral').value);
    if (!Number.isFinite(gross) || gross < 0) return;

    // Contract type is fixed: the brief grants the permanent-employment
    // assumption. The fixed-term floor stays in the calculator because it is
    // part of art. 13, but it is not a choice the user has to make here.
    current = window.Calculator.compute(gross, {
      contractType: 'indeterminato',
      companySize: companySize,
      firstYear: firstYear,
    });

    document.getElementById('netAnnual').textContent = fmt(current.netAnnual);
    document.getElementById('taxes').textContent = fmt(current.totalTaxes);
    document.getElementById('contributions').textContent = fmt(current.totalContributions);
    document.getElementById('withheld').textContent = fmt(current.totalWithheld);
    document.getElementById('rate').textContent =
      window.Calculator.pct(current.effectiveRate, 1);

    renderBreakdown(current);
    renderMonthly();
    results.hidden = false;
  });

  onPick('months', function (value) {
    months = Number(value);
    renderMonthly();
  });

  // requestSubmit, not dispatchEvent: it runs the input's own constraint
  // validation first, so a negative RAL stops here with the browser's message
  // instead of leaving the previous result on screen.
  onPick('size', function (value) {
    companySize = value;
    form.requestSubmit();
  });

  onPick('firstYear', function (value) {
    firstYear = value === 'true';
    form.requestSubmit();
  });

  renderSources();
  form.requestSubmit();
})();
