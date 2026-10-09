/* ClimateShield AI — Step 1 UI foundation.
 * Everything below is ILLUSTRATIVE, FICTIONAL sample data. No scores are validated,
 * no model is run, and no network requests are made. */
(() => {
  'use strict';

  /* =====================================================================
   * 1. Central sample dataset (single source of truth for every component)
   * ===================================================================== */

  // Illustrative scoring rule: 40% financial vulnerability + 60% mean climate exposure.
  const WEIGHTS = { fin: 0.4, climate: 0.6 };

  // Same four bands are used for overall risk, vulnerability and each exposure value.
  const BANDS = [
    { key: 'low',      label: 'Low',      range: '0–29',   desc: 'Limited sample vulnerability and exposure' },
    { key: 'moderate', label: 'Moderate', range: '30–49',  desc: 'Some exposure; routine monitoring' },
    { key: 'elevated', label: 'Elevated', range: '50–69',  desc: 'Material exposure; review mitigation' },
    { key: 'high',     label: 'High',     range: '70–100', desc: 'Significant exposure; priority review' }
  ];

  const HAZARD_KEYS = ['flood', 'heat', 'water'];

  // Labels, business-continuity effects and mitigation ideas per risk dimension.
  const FACTOR_INFO = {
    fin: {
      label: 'Financial vulnerability',
      short: 'Thin financial buffer',
      impact: 'Limited reserves make it harder to absorb repair costs, lost sales or delayed receivables after a climate event.',
      mitigation: 'Review working-capital buffers and discuss a contingency credit line or staged repayment option.'
    },
    flood: {
      label: 'Flood exposure',
      short: 'Flood exposure',
      impact: 'Inundation could halt operations for days and damage stock, machinery or records.',
      mitigation: 'Raise or protect critical stock and equipment, and confirm that flood cover is included in insurance.'
    },
    heat: {
      label: 'Extreme heat exposure',
      short: 'Extreme heat exposure',
      impact: 'Prolonged heat can cut output, strain cooling systems and spoil temperature-sensitive goods.',
      mitigation: 'Assess cooling capacity, shift timings and heat-resilient storage; consider a backup power plan.'
    },
    water: {
      label: 'Water scarcity exposure',
      short: 'Water scarcity exposure',
      impact: 'Shortfalls can interrupt water-dependent processes and raise input costs.',
      mitigation: 'Evaluate water storage, recycling and efficiency measures, and identify a secondary supply.'
    }
  };

  const RAW_BUSINESSES = [
    { id: 'b01', name: 'Sahyadri Agro Foods',          type: 'Food processing',  city: 'Pune',   state: 'Maharashtra', fin: 48, flood: 62, heat: 55, water: 40, assessed: '2026-10-06', context: 'Seasonal produce is stored on the ground floor of a unit near a drainage channel.' },
    { id: 'b02', name: 'Godavari Handloom Weavers',    type: 'Textile weaving',  city: 'Nashik', state: 'Maharashtra', fin: 66, flood: 70, heat: 58, water: 52, assessed: '2026-10-02', context: 'Looms and yarn stock sit close to the river floodplain, with limited cash reserves.' },
    { id: 'b03', name: 'Tapi Textile Dyeing Works',    type: 'Textile dyeing',   city: 'Surat',  state: 'Gujarat',     fin: 72, flood: 88, heat: 70, water: 76, assessed: '2026-10-07', context: 'A water-intensive process in a low-lying industrial cluster.' },
    { id: 'b04', name: 'Vidarbha Cold Chain Services', type: 'Cold storage',     city: 'Nagpur', state: 'Maharashtra', fin: 70, flood: 35, heat: 92, water: 60, assessed: '2026-09-29', context: 'Refrigeration load rises sharply in peak summer, and the unit carries significant debt.' },
    { id: 'b05', name: 'Kothrud Artisan Bakery',       type: 'Bakery',           city: 'Pune',   state: 'Maharashtra', fin: 30, flood: 28, heat: 40, water: 25, assessed: '2026-10-08', context: 'Small urban premises with diversified local customers.' },
    { id: 'b06', name: 'Nashik Valley Grape Packers',  type: 'Fruit packing',    city: 'Nashik', state: 'Maharashtra', fin: 55, flood: 40, heat: 68, water: 82, assessed: '2026-09-25', context: 'Depends on irrigation-linked supply from partner farms.' },
    { id: 'b07', name: 'Chakan Auto Components',       type: 'Auto parts',       city: 'Pune',   state: 'Maharashtra', fin: 35, flood: 45, heat: 38, water: 30, assessed: '2026-10-01', context: 'Established units with steady order books and moderate site exposure.' },
    { id: 'b08', name: 'Varachha Diamond Polishing',   type: 'Gem polishing',    city: 'Surat',  state: 'Gujarat',     fin: 78, flood: 90, heat: 60, water: 55, assessed: '2026-10-05', context: 'High-value inventory is held in a flood-prone locality with a thin margin.' },
    { id: 'b09', name: 'Nagpur Masala Mills',          type: 'Spice milling',    city: 'Nagpur', state: 'Maharashtra', fin: 40, flood: 30, heat: 72, water: 48, assessed: '2026-09-30', context: 'Grinding and storage areas are poorly ventilated in summer.' },
    { id: 'b10', name: 'Wardha Road Print House',      type: 'Printing',         city: 'Nagpur', state: 'Maharashtra', fin: 22, flood: 20, heat: 35, water: 18, assessed: '2026-09-22' }, // no context: demonstrates missing-value handling
    { id: 'b11', name: 'Panchavati Dairy Cooperative', type: 'Dairy',            city: 'Nashik', state: 'Maharashtra', fin: 60, flood: 50, heat: 82, water: 70, assessed: '2026-10-03', context: 'Milk quality and yield are sensitive to heat; fodder supply depends on rainfall.' },
    { id: 'b12', name: 'Pandesara Embroidery Cluster', type: 'Embroidery',       city: 'Surat',  state: 'Gujarat',     fin: 80, flood: 92, heat: 74, water: 70, assessed: '2026-10-04', context: 'Several small units share a flood-prone site and have weak savings buffers.' },
    { id: 'b13', name: 'Hinjewadi IT Services',        type: 'IT services',      city: 'Pune',   state: 'Maharashtra', fin: 18, flood: 30, heat: 25, water: 15, assessed: '2026-10-08', context: 'Office-based operations with remote-work fallback.' }
  ];

  // Demo alerts reference business ids, so alert counts always match the table.
  const ALERTS = [
    { id: 'a1', hazard: 'heat',  level: 'elevated', title: 'Elevated heat exposure — Nagpur',        region: 'Nagpur, Maharashtra', summary: 'Sample scenario: sustained high temperatures stress refrigeration and ventilation in heat-sensitive units.', businessIds: ['b04', 'b09'] },
    { id: 'a2', hazard: 'flood', level: 'moderate', title: 'Heavy-rainfall monitoring — Surat',      region: 'Surat, Gujarat',      summary: 'Sample scenario: heavy rainfall is being monitored for low-lying industrial clusters near the river.',     businessIds: ['b03', 'b08', 'b12'] },
    { id: 'a3', hazard: 'water', level: 'moderate', title: 'Water-scarcity watch — Nashik',          region: 'Nashik, Maharashtra', summary: 'Sample scenario: reduced reservoir levels may affect water-dependent processing and farm supply.',         businessIds: ['b02', 'b06', 'b11'] }
  ];

  const PLACEHOLDERS = {
    assess: {
      title: 'Assess a Business',
      text: 'A guided workflow for entering a new MSME and generating an assessment will be added in a later step.',
      planned: ['Business profile and financial inputs', 'Location-based hazard lookup', 'Score, explanation and mitigation output'],
      actions: [{ label: 'Browse sample assessments', view: 'assessments' }]
    },
    simulator: {
      title: 'Risk Simulator',
      text: 'Scenario testing (for example, "what if flood severity doubles?") will be implemented in a later step.',
      planned: ['Adjustable hazard scenarios', 'Before / after score comparison', 'Portfolio-level impact view'],
      actions: [{ label: 'Browse sample assessments', view: 'assessments' }]
    },
    reports: {
      title: 'Reports',
      text: 'Exportable assessment and portfolio reports will be implemented in a later step. Nothing is generated or downloaded from this screen.',
      planned: ['Single-business assessment summary', 'Portfolio risk overview', 'Export options'],
      actions: [{ label: 'View climate intelligence', view: 'climate' }]
    },
    settings: {
      title: 'Settings',
      text: 'Workspace, scoring and notification preferences will be implemented in a later step. This prototype has no stored settings.',
      planned: ['Scoring-weight configuration', 'Notification preferences', 'Data-source management'],
      actions: [{ label: 'Back to overview', view: 'overview' }]
    }
  };

  const VIEWS = {
    overview:    { nav: 'overview',    title: 'Risk Overview',        subtitle: 'Illustrative climate-vulnerability snapshot of sample MSME borrowers.' },
    assessments: { nav: 'assessments', title: 'Business Assessments', subtitle: 'Search, filter and open sample MSME assessments.' },
    climate:     { nav: 'climate',     title: 'Climate Intelligence', subtitle: 'Illustrative hazard exposure across sample locations.' },
    simulator:   { nav: 'simulator',   title: 'Risk Simulator',       subtitle: 'Scenario testing — planned for a later step.' },
    alerts:      { nav: 'alerts',      title: 'Alerts',               subtitle: 'Demo alerts built from sample data — not live weather warnings.' },
    reports:     { nav: 'reports',     title: 'Reports',              subtitle: 'Reporting — planned for a later step.' },
    settings:    { nav: 'settings',    title: 'Settings',             subtitle: 'Preferences — planned for a later step.' },
    assess:      { nav: 'assessments', title: 'Assess a Business',    subtitle: 'New assessment workflow — planned for a later step.' }
  };

  /* =====================================================================
   * 2. Derived data and helpers
   * ===================================================================== */

  const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : null);

  function bandOf(score) {
    if (num(score) === null) return null;
    return score >= 70 ? BANDS[3] : score >= 50 ? BANDS[2] : score >= 30 ? BANDS[1] : BANDS[0];
  }

  function enrich(b) {
    const values = HAZARD_KEYS.map(k => num(b[k])).filter(v => v !== null);
    const exposure = values.length ? Math.round(values.reduce((a, c) => a + c, 0) / values.length) : null;
    const fin = num(b.fin);
    const score = fin !== null && exposure !== null ? Math.round(WEIGHTS.fin * fin + WEIGHTS.climate * exposure) : null;
    return {
      ...b,
      fin, exposure, score,
      flood: num(b.flood), heat: num(b.heat), water: num(b.water),
      band: bandOf(score),
      location: [b.city, b.state].filter(Boolean).join(', '),
      alerts: ALERTS.filter(a => a.businessIds.includes(b.id))
    };
  }

  const BUSINESSES = RAW_BUSINESSES.map(enrich);
  const byId = id => BUSINESSES.find(b => b.id === id);

  function computeStats() {
    const scored = BUSINESSES.filter(b => b.score !== null);
    const alertedIds = new Set(ALERTS.flatMap(a => a.businessIds));
    const counts = Object.fromEntries(BANDS.map(b => [b.key, scored.filter(x => x.band.key === b.key).length]));
    const avg = scored.length ? Math.round(scored.reduce((s, b) => s + b.score, 0) / scored.length) : null;

    const hazards = HAZARD_KEYS.map(k => {
      const vals = BUSINESSES.map(b => b[k]).filter(v => v !== null);
      const bandCounts = Object.fromEntries(BANDS.map(b => [b.key, vals.filter(v => bandOf(v).key === b.key).length]));
      return { key: k, n: vals.length, avg: vals.length ? Math.round(vals.reduce((a, c) => a + c, 0) / vals.length) : null, bandCounts };
    });

    const cities = [...new Set(BUSINESSES.map(b => b.city))];
    return {
      total: BUSINESSES.length,
      assessed: scored.length,
      high: counts.high,
      alerted: BUSINESSES.filter(b => alertedIds.has(b.id)).length,
      avg, counts, hazards, cities,
      types: new Set(BUSINESSES.map(b => b.type)).size
    };
  }
  const STATS = computeStats();

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const show = v => (num(v) === null ? '—' : String(v));
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T00:00:00Z');
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }

  function badge(band) {
    const b = band || { key: 'none', label: 'Not scored' };
    return `<span class="badge b-${b.key}"><span class="badge-dot" aria-hidden="true"></span>${esc(b.label)}</span>`;
  }

  // Number + word + bar, so meaning never depends on colour alone.
  function meterCell(value) {
    const band = bandOf(value);
    if (!band) return '<span class="muted">—</span>';
    return `<div class="meter-cell b-${band.key}">
      <div class="meter-top"><span class="meter-num">${value}</span><span class="meter-word">${band.label}</span></div>
      <div class="meter" aria-hidden="true"><i style="width:${value}%"></i></div>
    </div>`;
  }

  /* =====================================================================
   * 3. State and DOM references
   * ===================================================================== */

  const state = { view: 'overview', query: '', risk: 'all', sort: 'score-desc' };
  const $ = id => document.getElementById(id);
  const els = {
    app: $('app'), sidebar: $('sidebar'), menuBtn: $('menuBtn'), scrim: $('scrim'),
    title: $('pageTitle'), subtitle: $('pageSubtitle'),
    globalSearch: $('globalSearch'), tableSearch: $('tableSearch'), riskFilter: $('riskFilter'), sortSelect: $('sortSelect'),
    resultCount: $('resultCount'), tableMount: $('tableMount'), tblSub: $('tblSub'),
    drawer: $('drawer'), drawerTitle: $('drawerTitle'), drawerMeta: $('drawerMeta'), drawerBody: $('drawerBody'), drawerClose: $('drawerClose'),
    main: $('main')
  };
  let lastFocus = null;

  /* =====================================================================
   * 4. Rendering
   * ===================================================================== */

  function renderMetrics() {
    const avgBand = bandOf(STATS.avg);
    const cards = [
      { cls: 'is-neutral', label: 'Businesses assessed', value: STATS.assessed, sub: `${STATS.cities.length} locations · ${STATS.types} sectors` },
      { cls: 'is-high',    label: 'High-risk businesses', value: STATS.high, sub: `${pct(STATS.high, STATS.assessed)}% of assessed` },
      { cls: 'is-alert',   label: 'With climate alerts', value: STATS.alerted, sub: `${ALERTS.length} demo alerts · ${pct(STATS.alerted, STATS.assessed)}% of assessed` },
      { cls: 'is-avg',     label: 'Average risk score', value: show(STATS.avg), suffix: '/100', sub: avgBand ? badge(avgBand) + '<span>illustrative</span>' : '' }
    ];
    $('metricCards').innerHTML = cards.map(c => `
      <article class="card metric ${c.cls}">
        <div class="metric-top"><span class="metric-label">${c.label}</span><span class="tag-demo">Demo</span></div>
        <div class="metric-value">${c.value}${c.suffix ? `<small>${c.suffix}</small>` : ''}</div>
        <div class="metric-sub">${c.sub}</div>
      </article>`).join('');
    $('notifCount').textContent = ALERTS.length;
    $('notifBtn').setAttribute('aria-label', `Notifications: ${ALERTS.length} demo alerts`);
  }

  function renderLegend() {
    $('legend').innerHTML = `<span class="legend-title">Risk categories (score 0–100)</span>` +
      BANDS.map(b => `<span class="legend-item b-${b.key}"><span class="sw" aria-hidden="true"></span><strong>${b.label}</strong> ${b.range}</span>`).join('') +
      `<span>Applies to overall risk and to each vulnerability or exposure sub-score. Illustrative, not validated.</span>`;
  }

  function renderDistribution() {
    $('distSub').textContent = `Overall risk category · ${STATS.assessed} sample businesses`;
    if (!STATS.assessed) { $('distChart').innerHTML = '<div class="empty">No scored businesses.</div>'; return; }

    const R = 48, C = 2 * Math.PI * R, gap = 2;
    let offset = 0;
    const segs = BANDS.map(b => {
      const n = STATS.counts[b.key];
      if (!n) return '';
      const len = (n / STATS.assessed) * C;
      const draw = Math.max(len - gap, 0.5);
      const svg = `<circle class="seg b-${b.key}" cx="60" cy="60" r="${R}" stroke-dasharray="${draw.toFixed(2)} ${(C - draw).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}"><title>${b.label}: ${n} of ${STATS.assessed} businesses (${pct(n, STATS.assessed)}%)</title></circle>`;
      offset += len;
      return svg;
    }).join('');

    const rows = BANDS.map(b => `
      <button type="button" class="dist-row b-${b.key}" data-filter-risk="${b.key}" title="Filter the table to ${b.label} risk">
        <span class="sw" aria-hidden="true"></span>
        <span class="name">${b.label}<small>Score ${b.range}</small></span>
        <span class="count">${STATS.counts[b.key]}</span>
        <span class="pct">${pct(STATS.counts[b.key], STATS.assessed)}%</span>
      </button>`).join('');

    $('distChart').innerHTML = `
      <div class="dist">
        <svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Donut chart of ${STATS.assessed} businesses by overall risk category">
          <circle class="track" cx="60" cy="60" r="${R}"/>
          <g transform="rotate(-90 60 60)">${segs}</g>
          <text class="d-total" x="60" y="62">${STATS.assessed}</text>
          <text class="d-label" x="60" y="75">businesses</text>
        </svg>
        <div class="dist-list">${rows}</div>
      </div>
      <p class="hint">Select a category to filter the assessment table.</p>`;
  }

  function renderHazards() {
    const rows = STATS.hazards.map(h => {
      const info = FACTOR_INFO[h.key];
      const band = bandOf(h.avg);
      const segs = BANDS.filter(b => h.bandCounts[b.key]).map(b =>
        `<i class="b-${b.key}" style="flex:${h.bandCounts[b.key]}" title="${info.label}: ${h.bandCounts[b.key]} of ${h.n} businesses at ${b.label} exposure"></i>`).join('');
      const caption = BANDS.map(b => `<span class="b-${b.key}"><span class="sw" aria-hidden="true"></span>${b.label} <b>${h.bandCounts[b.key]}</b></span>`).join('');
      return `<div>
        <div class="haz-head">
          <span class="haz-name">${info.label}</span>
          <span class="haz-avg">Average <strong>${show(h.avg)}</strong> ${band ? badge(band) : ''}</span>
        </div>
        <div class="stack" role="img" aria-label="${info.label}: ${BANDS.map(b => `${h.bandCounts[b.key]} ${b.label}`).join(', ')}">${segs}</div>
        <div class="stack-caption">${caption}</div>
      </div>`;
    }).join('');

    const top = [...STATS.hazards].filter(h => h.avg !== null).sort((a, b) => b.avg - a.avg)[0];
    const insight = top ? `<p class="insight">In this sample, <strong>${FACTOR_INFO[top.key].label.toLowerCase()}</strong> has the highest average (${top.avg}). Illustrative only.</p>` : '';
    $('hazardChart').innerHTML = `<div class="haz-list">${rows}</div>${insight}`;
  }

  function renderLocations() {
    const avg = (arr, k) => {
      const v = arr.map(b => b[k]).filter(x => x !== null);
      return v.length ? Math.round(v.reduce((a, c) => a + c, 0) / v.length) : null;
    };
    const rows = STATS.cities.map(city => {
      const list = BUSINESSES.filter(b => b.city === city);
      const sc = avg(list, 'score');
      return `<tr>
        <td class="cell-name" data-label="Location"><span class="biz-name">${esc(city)}</span></td>
        <td data-label="Businesses" class="num">${list.length}</td>
        <td data-label="Flood">${meterCell(avg(list, 'flood'))}</td>
        <td data-label="Heat">${meterCell(avg(list, 'heat'))}</td>
        <td data-label="Water scarcity">${meterCell(avg(list, 'water'))}</td>
        <td data-label="Avg risk score">${sc === null ? '—' : `<span class="score-pair">${badge(bandOf(sc))}<span class="muted num">Score ${sc}</span></span>`}</td>
      </tr>`;
    }).join('');
    $('locationTable').innerHTML = `<div class="table-wrap"><table class="data-table">
      <caption class="sr-only">Average illustrative exposure by location</caption>
      <thead><tr><th scope="col">Location</th><th scope="col">Businesses</th><th scope="col">Flood</th><th scope="col">Heat</th><th scope="col">Water scarcity</th><th scope="col">Avg risk score</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  // Search + category filter + sort, applied to the one dataset.
  function visibleBusinesses() {
    const terms = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const rows = BUSINESSES.filter(b => {
      if (state.risk !== 'all' && (!b.band || b.band.key !== state.risk)) return false;
      const hay = [b.name, b.type, b.city, b.state].join(' ').toLowerCase();
      return terms.every(t => hay.includes(t));
    });
    const nullsLast = (a, b, dir) => (a === null ? 1 : b === null ? -1 : dir * (a - b));
    const sorters = {
      'score-desc': (a, b) => nullsLast(a.score, b.score, -1),
      'score-asc':  (a, b) => nullsLast(a.score, b.score, 1),
      'name':       (a, b) => a.name.localeCompare(b.name),
      'date':       (a, b) => (b.assessed || '').localeCompare(a.assessed || '')
    };
    return rows.sort(sorters[state.sort] || sorters['score-desc']);
  }

  function renderTable() {
    const rows = visibleBusinesses();
    els.tblSub.textContent = `${STATS.total} fictional MSMEs · illustrative scores, not validated`;
    els.resultCount.textContent = `Showing ${rows.length} of ${STATS.total} sample businesses`;

    if (!rows.length) {
      const q = state.query.trim();
      els.tableMount.innerHTML = `<div class="empty">
        <strong>No businesses match</strong>
        <span>${q ? `Nothing matches “${esc(q)}”` : 'Nothing matches the selected filters'}${state.risk !== 'all' ? ` in the ${esc(BANDS.find(b => b.key === state.risk).label)} risk category` : ''}.</span>
        <button type="button" class="btn btn-sm" data-clear-filters>Clear search and filters</button>
      </div>`;
      return;
    }

    const body = rows.map(b => `<tr>
      <td class="cell-name" data-label="Business">
        <span class="biz-name">${esc(b.name)}</span>
        ${b.alerts.length ? `<span class="biz-alert">${b.alerts.length} demo alert${b.alerts.length > 1 ? 's' : ''}</span>` : ''}
      </td>
      <td data-label="Type">${esc(b.type || '—')}</td>
      <td data-label="Location">${esc(b.location || '—')}</td>
      <td data-label="Financial vulnerability">${meterCell(b.fin)}</td>
      <td data-label="Climate exposure">${meterCell(b.exposure)}</td>
      <td data-label="Overall risk"><span class="score-pair">${badge(b.band)}<span class="muted num">Score ${show(b.score)}</span></span></td>
      <td data-label="Last assessed" class="num">${fmtDate(b.assessed)}</td>
      <td data-label=""><button type="button" class="btn btn-sm" data-detail="${esc(b.id)}" aria-label="View details for ${esc(b.name)}">View details</button></td>
    </tr>`).join('');

    els.tableMount.innerHTML = `<div class="table-wrap"><table class="data-table">
      <caption class="sr-only">Sample MSME climate-risk assessments (fictional demo data)</caption>
      <thead><tr>
        <th scope="col">Business name</th><th scope="col">Business type</th><th scope="col">Location</th>
        <th scope="col">Financial vulnerability</th><th scope="col">Climate exposure</th><th scope="col">Overall risk</th>
        <th scope="col">Last assessed</th><th scope="col"><span class="sr-only">Action</span></th>
      </tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function renderAlerts() {
    $('alertList').innerHTML = ALERTS.map(a => {
      const band = BANDS.find(b => b.key === a.level);
      const biz = a.businessIds.map(byId).filter(Boolean)
        .map(b => `<button type="button" class="link-btn" data-detail="${esc(b.id)}">${esc(b.name)}</button>`).join('');
      return `<li class="alert b-${a.level}">
        <div class="alert-top">${badge(band)}<span class="tag-demo">Demo alert · not live</span></div>
        <p class="alert-title">${esc(a.title)}</p>
        <p class="alert-meta">${esc(a.region)} · ${esc(FACTOR_INFO[a.hazard].label)}</p>
        <p>${esc(a.summary)}</p>
        <div class="alert-biz"><span>Affected sample businesses (${a.businessIds.length}):</span>${biz}</div>
      </li>`;
    }).join('');
  }

  function renderPlaceholder(key) {
    const p = PLACEHOLDERS[key];
    if (!p) { $('placeholder').innerHTML = ''; return; }
    $('placeholder').innerHTML = `<div class="card placeholder">
      <p class="eyebrow">Planned for a later step</p>
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.text)}</p>
      <div class="planned"><h3>Planned scope</h3><ul>${p.planned.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      <p>This is a placeholder only. No data is created, saved, sent or generated from this screen.</p>
      <div class="placeholder-actions">${p.actions.map(a => `<button type="button" class="btn btn-primary" data-goto="${a.view}">${esc(a.label)}</button>`).join('')}</div>
    </div>`;
  }

  /* ---------- Business detail panel ---------- */

  function rankFactors(b) {
    const nHaz = HAZARD_KEYS.filter(k => b[k] !== null).length;
    const items = [];
    if (b.fin !== null) items.push({ key: 'fin', value: b.fin, pts: WEIGHTS.fin * b.fin });
    HAZARD_KEYS.forEach(k => { if (b[k] !== null) items.push({ key: k, value: b[k], pts: (WEIGHTS.climate / nHaz) * b[k] }); });
    return items.sort((a, c) => c.pts - a.pts).slice(0, 3);
  }

  function renderDetail(b) {
    const factors = rankFactors(b);
    const score = b.score;
    const band = b.band;

    const scale = score === null ? '' : `
      <div class="scale" aria-hidden="true">
        <span class="b-low" style="flex:30"></span><span class="b-moderate" style="flex:20"></span>
        <span class="b-elevated" style="flex:20"></span><span class="b-high" style="flex:30"></span>
        <span class="scale-marker" style="left:${score}%"></span>
      </div>
      <div class="scale-labels" aria-hidden="true">
        <span style="left:0">0</span><span style="left:30%">30</span><span style="left:50%">50</span><span style="left:70%">70</span><span style="left:100%">100</span>
      </div>`;

    const meterRow = (key, value) => {
      const bd = bandOf(value);
      return `<div class="meter-row ${bd ? 'b-' + bd.key : 'b-none'}">
        <span class="lbl">${FACTOR_INFO[key].label}</span>
        <span class="val"><span class="meter-num">${show(value)}</span><span class="meter-word">${bd ? bd.label : 'No data'}</span></span>
        <div class="meter" aria-hidden="true"><i style="width:${value ?? 0}%"></i></div>
      </div>`;
    };

    const explanation = score === null
      ? 'There are not enough sample inputs to compute an illustrative score for this business.'
      : `${b.name} receives an illustrative score of ${score}/100 (${band.label}). The score combines financial vulnerability (${b.fin}, weighted 40%) with the average of its available climate-exposure values (${b.exposure}, weighted 60%). ` +
        (factors.length >= 2 ? `The largest contributors are ${FACTOR_INFO[factors[0].key].label.toLowerCase()} and ${FACTOR_INFO[factors[1].key].label.toLowerCase()}. ` : '') +
        (b.context ? b.context : 'No additional business context is recorded in the sample data.');

    const factorHtml = factors.length ? factors.map(f => `
      <li class="factor"><div><strong>${FACTOR_INFO[f.key].short} · ${f.value}/100</strong>
        <span>≈ ${f.pts.toFixed(1)} of the ${score ?? '—'} points. Possible effect: ${FACTOR_INFO[f.key].impact}</span></div></li>`).join('')
      : '<li class="muted">No contributing factors available.</li>';

    const mitigations = factors.map(f => FACTOR_INFO[f.key].mitigation)
      .concat('Commission a validated, site-level hazard assessment before relying on these illustrative figures.');

    const alertsHtml = b.alerts.length ? `
      <section class="d-section"><h3>Linked demo alerts</h3>
        <ul class="d-list">${b.alerts.map(a => `<li>${esc(a.title)} <span class="muted">(demo, not live)</span></li>`).join('')}</ul>
      </section>` : '';

    els.drawerTitle.textContent = b.name;
    els.drawerMeta.textContent = [b.type, b.location].filter(Boolean).join(' · ') || '—';
    els.drawerBody.innerHTML = `
      <div class="notice">${icon('info')}<span>Illustrative assessment based on fictional sample data. It is not scientifically validated and must not be used for lending decisions.</span></div>

      <section class="d-section" aria-label="Overall illustrative risk score">
        <div class="score-block ${band ? 'b-' + band.key : 'b-none'}">
          <div class="score-big">${show(score)}<small>/100</small></div>
          <div class="score-caption">${badge(band)}<span>Illustrative overall risk score</span></div>
        </div>
        ${scale}
      </section>

      <section class="d-section"><h3>Vulnerability and hazard exposure</h3>
        <div class="meter-rows">${meterRow('fin', b.fin)}${meterRow('flood', b.flood)}${meterRow('heat', b.heat)}${meterRow('water', b.water)}</div>
      </section>

      <section class="d-section"><h3>Top contributing risk factors</h3><ol class="factor-list">${factorHtml}</ol></section>
      <section class="d-section"><h3>Why this score</h3><p class="d-text">${esc(explanation)}</p></section>
      <section class="d-section"><h3>Suggested mitigation actions (illustrative)</h3><ul class="d-list">${mitigations.map(m => `<li>${esc(m)}</li>`).join('')}</ul></section>
      ${alertsHtml}

      <section class="d-section"><h3>Illustrative vs validated</h3>
        <div class="compare">
          <div class="is-ill"><strong>Illustrative</strong><p>Risk score, categories, sub-scores, contributing factors and mitigation ideas on this panel.</p></div>
          <div class="is-val"><strong>Validated measurements</strong><p>None. No hazard maps, financial statements, site inspections or live data are connected in this prototype.</p></div>
        </div>
      </section>`;
  }


  /* =====================================================================
   * 5. Interactions
   * ===================================================================== */

  function setView(name, opts = {}) {
    const view = VIEWS[name] ? name : 'overview';
    state.view = view;
    document.body.dataset.view = view;

    document.querySelectorAll('[data-views]').forEach(el => {
      el.hidden = !el.dataset.views.split(/\s+/).includes(view);
    });
    document.querySelectorAll('.nav-link').forEach(btn => {
      if (btn.dataset.nav === VIEWS[view].nav) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });

    els.title.textContent = VIEWS[view].title;
    els.subtitle.textContent = VIEWS[view].subtitle;
    document.title = `ClimateShield AI — ${VIEWS[view].title} (demo data)`;
    renderPlaceholder(view);
    closeNav();
    window.scrollTo(0, 0);
    if (opts.focus) els.main.focus({ preventScroll: true });
  }

  function openNav() {
    els.sidebar.classList.add('is-open');
    els.menuBtn.setAttribute('aria-expanded', 'true');
    els.scrim.hidden = false;
    els.scrim.dataset.for = 'nav';
  }
  function closeNav() {
    els.sidebar.classList.remove('is-open');
    els.menuBtn.setAttribute('aria-expanded', 'false');
    if (els.scrim.dataset.for === 'nav') { els.scrim.hidden = true; els.scrim.dataset.for = ''; }
  }

  function openDetail(id, trigger) {
    const b = byId(id);
    if (!b) return;
    lastFocus = trigger || document.activeElement;
    closeNav();
    renderDetail(b);
    els.drawer.hidden = false;
    els.scrim.hidden = false;
    els.scrim.dataset.for = 'drawer';
    els.app.inert = true; // keep keyboard focus inside the dialog
    document.body.classList.add('no-scroll');
    els.drawerBody.scrollTop = 0;
    els.drawerClose.focus();
  }

  function closeDetail() {
    if (els.drawer.hidden) return;
    els.drawer.hidden = true;
    els.scrim.hidden = true;
    els.scrim.dataset.for = '';
    els.app.inert = false;
    document.body.classList.remove('no-scroll');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  function syncControls() {
    els.globalSearch.value = state.query;
    els.tableSearch.value = state.query;
    els.riskFilter.value = state.risk;
    els.sortSelect.value = state.sort;
  }

  function setQuery(value, source) {
    state.query = value;
    if (source !== els.globalSearch) els.globalSearch.value = value;
    if (source !== els.tableSearch) els.tableSearch.value = value;
    // Searching from the header while on a page without the table jumps to the table.
    if (source === els.globalSearch && value.trim() && !['overview', 'assessments'].includes(state.view)) setView('assessments');
    renderTable();
  }

  function filterByRisk(key) {
    state.risk = key;
    syncControls();
    renderTable();
    if (state.view === 'overview') $('assessmentsCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    els.riskFilter.innerHTML = '<option value="all">All categories</option>' +
      BANDS.map(b => `<option value="${b.key}">${b.label} (${STATS.counts[b.key]})</option>`).join('');

    renderMetrics();
    renderLegend();
    renderDistribution();
    renderHazards();
    renderLocations();
    renderAlerts();
    renderTable();
    syncControls();
    setView('overview');

    els.globalSearch.addEventListener('input', e => setQuery(e.target.value, els.globalSearch));
    els.tableSearch.addEventListener('input', e => setQuery(e.target.value, els.tableSearch));
    els.riskFilter.addEventListener('change', e => { state.risk = e.target.value; renderTable(); });
    els.sortSelect.addEventListener('change', e => { state.sort = e.target.value; renderTable(); });

    $('notifBtn').addEventListener('click', () => setView('alerts', { focus: true }));
    els.menuBtn.addEventListener('click', () => (els.sidebar.classList.contains('is-open') ? closeNav() : openNav()));
    els.drawerClose.addEventListener('click', closeDetail);
    els.scrim.addEventListener('click', () => (els.scrim.dataset.for === 'drawer' ? closeDetail() : closeNav()));

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (!els.drawer.hidden) closeDetail();
      else closeNav();
    });

    // One delegated handler for all data-* actions
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-nav],[data-goto],[data-detail],[data-filter-risk],[data-clear-filters]');
      if (!t) return;
      if (t.dataset.nav) setView(t.dataset.nav, { focus: true });
      else if (t.dataset.goto) setView(t.dataset.goto, { focus: true });
      else if (t.dataset.detail) openDetail(t.dataset.detail, t);
      else if (t.dataset.filterRisk) filterByRisk(t.dataset.filterRisk);
      else if (t.hasAttribute('data-clear-filters')) {
        state.query = ''; state.risk = 'all';
        syncControls(); renderTable();
      }
    });
  }

  init();
})();