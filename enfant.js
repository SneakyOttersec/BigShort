(() => {
  'use strict';

  // Rates are deliberately separate: ordinary AV did not receive the 2026 PS increase.
  const TAX = Object.freeze({ checked: '2026-10-24', avSocial: .172, ctoSocial: .186, income: .128, avReduced: .075, premiumThreshold: 150000 });
  const FUNDS = Object.freeze({
    bnp: Object.freeze({ name: 'BNP Paribas Easy MSCI World UCITS ETF EUR C', isin: 'IE000A0GH076', ongoing: .0005, internal: .0005,
      source: 'https://www.bnpparibas-am.com/en-nl/fundsheet/equity/bnp-paribas-easy-msci-world-ucits-etf-ucits-etf-eur-c-ie000a0gh076/',
      factsheet: 'https://docfinder.bnpparibas-am.com/api/files/1c0c2d9e-492e-48f6-b79c-bf5fbed21927/512',
      availability: 'https://support.linxea.com/fr/articles/746251-quels-sont-les-etf-disponibles-sur-les-contrats-spirica',
      note: 'Frais courants estimés 0,05 % + transactions internes estimées 0,05 % (données émetteur au 31/12/2025). Référencé dans le catalogue Spirica du 24/07/2026. Le plafond de 3 % du marché primaire n’est pas assimilé au courtage d’un achat en bourse ; les conditions particulières de l’assureur restent à vérifier avant souscription.' }),
    amundi: Object.freeze({ name: 'Amundi Core MSCI World UCITS ETF Acc', isin: 'IE000BI8OT95', ongoing: .0012, internal: .0001,
      source: 'https://www.amundietf.fr/pdfDocuments/kid-priips/IE000BI8OT95/FRA/FRA',
      factsheet: 'https://www.amundietf.fr/pdfDocuments/monthly-factsheet/IE000BI8OT95/FRA/FRA/RETAIL/ETF',
      availability: 'https://app.lucya.com/asv/nos-fonds/opcvm/IE000BI8OT95/0P0001S8XB',
      note: 'DIC Amundi du 28/04/2026 : 0,12 % de frais de gestion et autres frais administratifs/d’exploitation, plus 0,01 % de transactions internes estimées. Le seul taux de gestion de 0,08 % affiché par certains outils ne représente pas tous les frais courants. Les anciennes annexes de contrat peuvent afficher des données historiques différentes.' })
  });
  const OFFERS = Object.freeze([
    Object.freeze({ id: 'linxea', type: 'AV', name: 'Linxea Spirit 2', fund: 'bnp', wrapper: .005, trade: .0006, minInitial: 500, minBuy: 100, color: '#cc2a41', eligible: true,
      source: 'https://www.linxea.com/assurance-vie/linxea-spirit-2/', note: 'Gestion libre, 0,50 %/an sur UC ; 0,06 % par investissement/désinvestissement ETF selon l’annonce Linxea du 16/07/2026. Minimum initial 500 €, versements programmés 100 €/mois. Les petits budgets sont accumulés hors contrat puis versés à partir de 100 €.' }),
    Object.freeze({ id: 'lucya', type: 'AV', name: 'Lucya Cardif', fund: 'amundi', wrapper: .005, trade: .001, minInitial: 500, minBuy: 50, color: '#8b4278', eligible: true,
      source: 'https://lucya.com/assurance-vie/lucya-cardif/', note: 'Gestion libre : 0,50 %/an sur UC, 0,10 % à l’investissement ETF. À la sortie totale, la notice (encadré frais et art. 11) limite les 0,10 % de désinvestissement aux 10 premières années : le modèle retient 0 % à compter du 10e anniversaire. Minimum initial 500 €, versements programmés 50 €/mois.' }),
    Object.freeze({ id: 'fortuneo', type: 'CTO', name: 'Fortuneo · Starter', fund: 'amundi', wrapper: 0, minInitial: 100, minBuy: 0, color: '#567c77', eligible: true,
      source: 'https://www.fortuneo.fr/datas/files/tarifs_fortuneo.pdf', note: 'Euronext Paris : premier ordre du mois ≤ 500 € gratuit, sinon 0,35 %, achat comme vente. Le versement initial peut consommer l’ordre gratuit du mois. Aucune promotion ETF temporaire appliquée. Encours d’ouverture minimum 100 €. CTO mineur explicitement accepté avec signature des représentants légaux. Achat en fractions de parts théoriques : vérifier la taille d’une part et le référencement du titre avant ordre.' }),
    Object.freeze({ id: 'bourso', type: 'CTO', name: 'BoursoBank · Découverte', fund: 'amundi', wrapper: 0, minInitial: 0, minBuy: 100, color: '#956b0d', eligible: false,
      source: 'https://www.boursobank.com/content/brochure_tarifaire/boursorama_bt.pdf', note: 'Référence tarifaire uniquement : éligibilité du CTO au nom d’un mineur non confirmée dans les sources publiques consultées ; hors classement et hors sélection automatique. Découverte : 1,99 € jusqu’à 500 € de montant d’ordre, puis 0,60 %. Minimum d’achat ETF 100 € hors frais. Garde, abonnement Découverte et inactivité : 0 €. Ne pas confondre l’offre d’assurance-vie mineur avec l’ouverture d’un CTO.' })
  ]);
  const $ = id => document.getElementById(id);
  const euro = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  const exact = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const pct = value => new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const date = value => new Date(`${value}T12:00:00`);
  const iso = value => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  const dayNumber = value => Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / 86400000;
  const yearsBetween = (a, b) => (dayNumber(b) - dayNumber(a)) / 365.2425;
  const anniversary = (origin, years) => new Date(origin.getFullYear() + years, origin.getMonth(), Math.min(origin.getDate(), new Date(origin.getFullYear() + years, origin.getMonth() + 1, 0).getDate()), 12);
  const isAtLeast = (origin, end, years) => end >= anniversary(origin, years);
  const monthKey = value => `${value.getFullYear()}-${value.getMonth()}`;

  function monthEnds(start, end) {
    const result = [];
    for (let month = 0; month <= 601; month++) {
      const next = new Date(start.getFullYear(), start.getMonth() + month + 1, 0, 12);
      if (next > end) break;
      if (next > start) result.push(next);
    }
    return result;
  }

  function taxFor(type, gain, years8, premiums, p) {
    const g = Math.max(0, gain);
    const rates = p.taxRates || TAX;
    const allowance = type === 'AV' && years8 ? Math.min(g, p.allowance) : 0;
    let ir;
    let lowGain = 0;
    if (p.regime === 'scale') ir = (g - allowance) * p.tmi;
    else if (type === 'CTO' || !years8) ir = g * rates.income;
    else {
      const post2017 = premiums + p.otherPremiums;
      const total = post2017 + p.oldPremiums;
      const fraction = total <= rates.premiumThreshold ? 1 : Math.max(0, Math.min(1, (rates.premiumThreshold - p.oldPremiums) / Math.max(post2017, 1)));
      lowGain = g * fraction;
      // The abatement is applied first to products taxed at 7.5%, then to 12.8%.
      const lowTaxable = Math.max(0, lowGain - allowance);
      const highTaxable = Math.max(0, g - lowGain - Math.max(0, allowance - lowGain));
      ir = lowTaxable * rates.avReduced + highTaxable * rates.income;
    }
    const social = g * (type === 'AV' ? rates.avSocial : rates.ctoSocial);
    return { ir, social, total: ir + social, gain: g, allowance, lowGain };
  }

  function brokerage(offer, notional, count) {
    if (notional <= 0) return 0;
    if (offer.id === 'bourso') return notional <= 500 ? 1.99 : notional * .006;
    return count === 0 && notional <= 500 ? 0 : notional * .0035;
  }

  function buyNotional(budget, offer, count, spread) {
    // Binary search also respects the discontinuous Bourso tariff at 500 €.
    let lo = 0, hi = budget;
    for (let n = 0; n < 64; n++) {
      const mid = (lo + hi) / 2;
      if (mid + brokerage(offer, mid, count) + mid * spread <= budget) lo = mid; else hi = mid;
    }
    return lo;
  }

  function simulate(offer, p) {
    // Explicit calculation switch for invariant tests; never enabled by the UI.
    const chargeFees = p.feesEnabled !== false;
    const fund = chargeFees ? (p.fundOverride || FUNDS[offer.fund]) : { ongoing: 0, internal: 0 };
    const wrapperRate = chargeFees ? offer.wrapper : 0;
    const executionRate = chargeFees ? p.spread : 0;
    const fees = { fund: 0, internal: 0, wrapper: 0, buy: 0, sell: 0, execution: 0 };
    const orders = new Map();
    const deposits = [];
    let invested = 0, cash = 0, basis = 0, paid = 0;
    let previous = p.now;
    const eligible = offer.eligible && p.initial >= offer.minInitial;

    function grow(until) {
      const years = yearsBetween(previous, until);
      invested *= Math.pow(1 + p.gross, years);
      for (const [key, rate] of [['fund', fund.ongoing], ['internal', fund.internal], ['wrapper', wrapperRate]]) {
        const cost = invested * (1 - Math.pow(1 - rate, years));
        invested -= cost;
        fees[key] += cost;
      }
      previous = until;
    }

    function deposit(amount, when, initial) {
      cash += amount;
      paid += amount;
      if (cash <= 0) return;
      const min = initial ? offer.minInitial : offer.minBuy;
      if (cash + 1e-8 < min) return;
      if (offer.type === 'AV') {
        // Amounts below the opening minimum remain cash in this ineligible scenario.
        if (!deposits.length && cash < offer.minInitial) return;
        const trade = chargeFees ? cash * offer.trade : 0;
        const execution = cash * executionRate;
        basis += cash;
        deposits.push({ when, amount: cash });
        invested += cash - trade - execution;
        fees.buy += trade;
        fees.execution += execution;
        cash = 0;
      } else {
        const key = monthKey(when);
        const count = orders.get(key) || 0;
        const notional = chargeFees ? buyNotional(cash, offer, count, executionRate) : cash;
        if (notional + 1e-8 < offer.minBuy || notional < 1e-8) return;
        const trade = chargeFees ? brokerage(offer, notional, count) : 0;
        const execution = notional * executionRate;
        const spent = notional + trade + execution;
        invested += notional;
        basis += spent;
        fees.buy += trade;
        fees.execution += execution;
        cash = Math.max(0, cash - spent);
        orders.set(key, count + 1);
      }
    }

    deposit(p.initial, p.now, true);
    for (const end of monthEnds(p.now, p.exit)) {
      grow(end);
      deposit(p.monthly, end, false);
    }
    grow(p.exit);
    const saleRate = !chargeFees || offer.id === 'lucya' && isAtLeast(p.now, p.exit, 10) ? 0 : offer.trade;
    fees.sell = !chargeFees ? 0 : offer.type === 'AV' ? invested * saleRate : Math.min(invested, brokerage(offer, invested, orders.get(monthKey(p.exit)) || 0));
    const finalExecution = invested * executionRate;
    fees.execution += finalExecution;
    const proceeds = Math.max(0, invested - fees.sell - finalExecution);
    const premiumsPrior = deposits.filter(d => d.when.getFullYear() < p.exit.getFullYear()).reduce((sum, d) => sum + d.amount, 0);
    const tax = taxFor(offer.type, proceeds - basis, isAtLeast(p.now, p.exit, 8), premiumsPrior, p);
    const net = cash + proceeds - tax.total;
    return { offer, eligible, invested, cash, basis, paid, fees, totalFees: Object.values(fees).reduce((a, b) => a + b, 0), tax, net, gain: net - paid, saleRate, premiumsPrior };
  }

  function checkpoints(start, exit) {
    const points = [start];
    for (let year = 1; anniversary(start, year) < exit; year++) points.push(anniversary(start, year));
    if (exit > start) points.push(exit);
    return points;
  }

  const state = { results: [], selected: 'linxea', params: null, points: [], history: {}, visible: new Set(), auto: true, index: 0, plot: null };

  function params() {
    const now = date(iso(new Date()));
    if (!$('child-form').checkValidity()) throw new Error('Renseignez des dates et montants valides. Les montants ne peuvent pas être négatifs.');
    const birth = date($('birth-date').value);
    const exit = date($('child-exit').value);
    if (birth > now) throw new Error('La naissance ne peut pas être postérieure à aujourd’hui.');
    if (isAtLeast(birth, now, 18)) throw new Error('Ce module concerne une ouverture pour un enfant actuellement mineur.');
    if (exit <= now) throw new Error('La date de disponibilité doit être postérieure à aujourd’hui.');
    if (exit > anniversary(now, 50)) throw new Error('Choisissez un horizon de 50 ans maximum.');
    const number = id => Number($(id).value);
    const p = { now, birth, exit, initial: number('child-initial'), monthly: number('child-monthly'), gross: number('child-return') / 100,
      allowance: number('child-allowance'), oldPremiums: number('child-old-premiums'), otherPremiums: number('child-other-premiums'),
      regime: $('child-regime').value, tmi: number('child-tmi') / 100, spread: number('child-spread') / 100 };
    if (p.initial + p.monthly <= 0) throw new Error('Prévoyez au moins un versement initial ou mensuel.');
    return p;
  }

  function bestCurves() {
    state.visible = new Set(['AV', 'CTO'].map(type => state.results.filter(r => r.eligible && r.offer.type === type).sort((a, b) => b.net - a.net)[0]?.offer.id).filter(Boolean));
  }

  function calculate() {
    $('child-tmi-label').hidden = $('child-regime').value !== 'scale';
    hideTooltip();
    try {
      const p = params();
      state.params = p;
      state.results = OFFERS.map(offer => simulate(offer, p));
      state.points = checkpoints(p.now, p.exit);
      state.history = Object.fromEntries(OFFERS.map(offer => [offer.id, state.points.map(exit => simulate(offer, { ...p, exit }).net)]));
      state.index = state.points.length - 1;
      if (state.auto) bestCurves();
      $('child-status').textContent = '';
      $('child-results').hidden = false;
      $('child-history-section').hidden = false;
      const months = monthEnds(p.now, p.exit).length;
      let age = p.exit.getFullYear() - p.birth.getFullYear();
      if (p.exit < anniversary(p.birth, age)) age--;
      $('child-horizon').textContent = `Ouverture le ${dateFormat.format(p.now)} · ${months} versements mensuels · sortie vers ${age} ans · durée ${yearsBetween(p.now, p.exit).toFixed(1).replace('.', ',')} ans.`;
      renderResults();
      renderGraph();
    } catch (error) {
      $('child-status').textContent = error.message;
      $('child-results').hidden = true;
      $('child-history-section').hidden = true;
      $('child-horizon').textContent = '';
    }
  }

  function renderResults() {
    const ranked = [...state.results].sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.net - a.net);
    const valid = ranked.filter(r => r.eligible);
    const best = valid[0];
    const bestAv = valid.find(r => r.offer.type === 'AV');
    const bestCto = valid.find(r => r.offer.type === 'CTO');
    $('child-best').textContent = best ? euro(best.net) : '—';
    $('child-best-name').textContent = best ? best.offer.name : 'Aucune offre éligible avec le versement initial choisi.';
    $('child-paid').textContent = euro(state.results[0].paid);
    $('child-gap').textContent = bestAv && bestCto ? euro(Math.abs(bestAv.net - bestCto.net)) : '—';
    $('child-gap-label').textContent = bestAv && bestCto ? `en faveur de ${bestAv.net >= bestCto.net ? bestAv.offer.name : bestCto.offer.name}` : 'Comparaison AV/CTO indisponible : vérifiez les minima initiaux.';
    const messages = ['BoursoBank : ouverture d’un CTO mineur non confirmée ; calcul tarifaire indicatif, exclu du classement et du choix automatique des courbes.'];
    if (state.params.initial < 500) messages.push('AV Linxea et Lucya : versement initial minimum de 500 € non respecté, offres hors classement.');
    if (state.params.initial < 100) messages.push('CTO Fortuneo : minimum d’ouverture de 100 € non respecté, offre hors classement.');
    if (!isAtLeast(state.params.birth, state.params.exit, 18)) messages.push('Sortie pendant la minorité : les opérations restent soumises aux règles de représentation et de gestion des biens du mineur.');
    if (state.params.regime === 'scale') messages.push('Barème approximé par une TMI constante : un rachat important peut changer de tranche. Le résultat n’est pas un calcul complet de l’IR.');
    $('eligibility-note').textContent = messages.join(' ');
    $('child-rows').innerHTML = ranked.map(r => `<tr class="${state.selected === r.offer.id ? 'selected' : ''}"><td><button type="button" class="offer-button" data-child-select="${r.offer.id}">${r.offer.type} · ${r.offer.name}</button><small>${r.offer.id === 'bourso' ? 'Mineur : à confirmer · hors classement' : r.eligible ? 'Ouverture mineur documentée' : `Minimum initial ${euro(r.offer.minInitial)} non respecté`}</small>${!r.eligible ? '<span class="badge">Chiffres théoriques · non classés</span>' : ''}</td><td>${pct(FUNDS[r.offer.fund].ongoing)}<small>+ ${pct(FUNDS[r.offer.fund].internal)} transactions internes estimées</small></td><td>${pct(r.offer.wrapper)}<small>${r.offer.type === 'AV' ? 'gestion libre UC' : 'garde / tenue : 0 €'}</small></td><td>${euro(r.paid)}</td><td>${euro(r.totalFees)}</td><td>${euro(r.tax.total)}</td><td><strong>${euro(r.net)}</strong></td><td>${euro(r.gain)}</td></tr>`).join('');
    renderDetail();
  }

  function renderDetail() {
    const r = state.results.find(item => item.offer.id === state.selected) || state.results[0];
    const offer = r.offer, fund = FUNDS[offer.fund];
    $('child-detail-title').textContent = `Fiche descriptive — ${offer.type} ${offer.name}`;
    $('child-fund').innerHTML = `<strong>${fund.name}</strong> · ${fund.isin}<br><a href="${fund.source}" target="_blank" rel="noreferrer">Frais officiels / DIC ↗</a> · <a href="${fund.factsheet}" target="_blank" rel="noreferrer">Fiche ETF ↗</a> · <a href="${fund.availability}" target="_blank" rel="noreferrer">${offer.type === 'AV' ? 'Référencement dans le catalogue' : 'Fiche du support (ne vaut pas confirmation de négociabilité chez ce courtier)'} ↗</a><br>${fund.note}`;
    const buyTariff = offer.type === 'AV' ? pct(offer.trade) : offer.id === 'fortuneo' ? '1er ordre du mois ≤ 500 € : 0 €, sinon 0,35 %' : '1,99 € ≤ 500 €, sinon 0,60 %';
    const sellTariff = offer.type === 'AV' ? offer.id === 'lucya' ? `${pct(r.saleRate)} à la date choisie (0,10 % avant 10 ans)` : pct(r.saleRate) : buyTariff;
    const rows = [
      ['Frais courants du fonds', `${pct(fund.ongoing)} / an`, r.fees.fund],
      ['Transactions internes du fonds', `${pct(fund.internal)} / an estimés`, r.fees.internal],
      ['Gestion du contrat / enveloppe', `${pct(offer.wrapper)} / an`, r.fees.wrapper],
      ['Investissements / courtage achats', buyTariff, r.fees.buy],
      ['Désinvestissement / vente finale', sellTariff, r.fees.sell],
      ['Supplément d’exécution', `${pct(state.params.spread)} par achat/vente`, r.fees.execution],
      ['Entrée, dossier, versement hors ETF', '0 € dans le scénario retenu', 0],
      ['Garde, tenue, inactivité', offer.type === 'CTO' ? '0 € au tarif sélectionné' : 'Inclus dans la gestion du contrat', 0],
      ['Total des frais modélisés', 'Somme, sans double comptage', r.totalFees]
    ];
    $('child-fee-rows').innerHTML = rows.map(([label, tariff, value]) => `<tr><td>${label}</td><td>${tariff}</td><td>${exact(value)}</td></tr>`).join('');
    const metrics = [['Budget versé', r.paid], ['Base fiscale des versements investis', r.basis], ['Cash en attente non rémunéré', r.cash], ['Gains imposables avant abattement', r.tax.gain], ['Abattement AV utilisé à cette sortie', r.tax.allowance], ['Impôt sur le revenu', r.tax.ir], ['Prélèvements sociaux', r.tax.social], ['Capital net disponible', r.net], ['Gain net après frais et impôts', r.gain]];
    $('child-tax-detail').innerHTML = metrics.map(([name, value]) => `<div class="metric"><span>${name}</span><strong>${exact(value)}</strong></div>`).join('');
    $('child-offer-note').innerHTML = `${offer.note} <a href="${offer.source}" target="_blank" rel="noreferrer">Source du contrat / barème ↗</a>`;
  }

  function renderGraph() {
    hideTooltip();
    if (!state.params || $('child-results').hidden) return;
    const last = state.points.length - 1;
    state.index = Math.min(state.index, last);
    $('child-year').max = last;
    $('child-year').value = state.index;
    renderLegend();
    const visible = OFFERS.filter(offer => state.visible.has(offer.id));
    $('child-empty').hidden = visible.length > 0;
    $('child-frame').hidden = !visible.length;
    if (!visible.length) { state.plot = null; return; }
    const windowYears = Number($('child-window').value);
    const cutoff = windowYears ? anniversary(state.params.exit, -windowYears) : state.params.now;
    let first = state.points.findIndex(point => point >= cutoff);
    first = Math.max(0, first - (first > 0 ? 1 : 0));
    const indexes = state.points.map((_, i) => i).filter(i => i >= first);
    const width = $('child-graph').clientWidth || 1000, height = $('child-graph').clientHeight || 430;
    const left = width < 500 ? 74 : 100, right = 18, top = 24, bottom = 56;
    const values = visible.flatMap(offer => indexes.map(i => state.history[offer.id][i]));
    let min = $('child-scale').value === 'zero' ? 0 : Math.min(...values), max = Math.max(...values);
    const span = Math.max(max - min, Math.max(Math.abs(max) * .03, 10));
    if ($('child-scale').value !== 'zero') min = Math.max(0, min - span * .08);
    max += span * .08;
    const rough = Math.max((max - min) / 5, 1);
    const power = Math.pow(10, Math.floor(Math.log10(rough)));
    const fraction = rough / power;
    const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * power;
    min = Math.floor(min / step) * step;
    max = Math.ceil(max / step) * step;
    if (max <= min) max = min + step;
    const x0 = dayNumber(state.points[first]), x1 = dayNumber(state.params.exit);
    const x = i => left + (dayNumber(state.points[i]) - x0) / Math.max(1, x1 - x0) * (width - left - right);
    const y = value => top + (max - value) / (max - min) * (height - top - bottom);
    const ticks = [];
    for (let value = min; value <= max + step * .01; value += step) ticks.push(value);
    const grid = ticks.map(value => `<line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="#e6e6e6"/><text x="${left - 10}" y="${y(value) + 4}" text-anchor="end" fill="#666" font-size="11">${euro(value)}</text>`).join('');
    const tickStride = Math.max(1, Math.ceil((indexes.length - 1) / Math.max(2, Math.floor((width - left - right) / 95))));
    const xTicks = indexes.filter((i, n) => n % tickStride === 0 && (i === last || x(last) - x(i) > 60));
    if (!xTicks.includes(last)) xTicks.push(last);
    const axis = xTicks.map(i => `<text x="${x(i)}" y="${height - 20}" text-anchor="${i === last ? 'end' : 'middle'}" fill="#666" font-size="11">${state.points[i].getFullYear()}</text>`).join('');
    const lines = visible.map(offer => `<polyline points="${indexes.map(i => `${x(i)},${y(state.history[offer.id][i])}`).join(' ')}" fill="none" stroke="${offer.color}" stroke-width="2.5" ${offer.id === 'lucya' || offer.id === 'bourso' ? 'stroke-dasharray="7 4"' : ''}/>${indexes.map(i => `<circle cx="${x(i)}" cy="${y(state.history[offer.id][i])}" r="3" fill="${offer.color}"/>`).join('')}`).join('');
    const inspection = state.index >= first ? `<line x1="${x(state.index)}" y1="${top}" x2="${x(state.index)}" y2="${height - bottom}" stroke="#999" stroke-dasharray="3 4"/>` : '';
    $('child-graph').innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Capital net après frais et fiscalité aux dates anniversaires. Montants disponibles dans la légende et avec le curseur d’année.">${grid}${axis}${inspection}${lines}</svg>`;
    state.plot = { visible, indexes, x, y, left, right: width - right, top, bottom: height - bottom, width, height };
  }

  function renderLegend() {
    $('child-year-date').textContent = dateFormat.format(state.points[state.index]);
    $('child-legend').innerHTML = OFFERS.map(offer => `<button type="button" data-child-curve="${offer.id}" aria-pressed="${state.visible.has(offer.id)}" aria-label="${state.visible.has(offer.id) ? 'Masquer' : 'Afficher'} ${offer.type} ${offer.name}"><span class="swatch" style="--curve:${offer.color}"></span><span class="legend-name">${offer.type} · ${offer.name}${offer.eligible ? '' : ' (indicatif)'}</span><strong>${euro(state.history[offer.id][state.index])}</strong></button>`).join('');
  }

  function hideTooltip() { $('child-tooltip').hidden = true; }
  function showTooltip(event) {
    const plot = state.plot;
    if (!plot) return;
    const rect = $('child-graph').getBoundingClientRect();
    const px = event.clientX - rect.left, py = event.clientY - rect.top;
    if (px < plot.left || px > plot.right || py < plot.top || py > plot.bottom) { hideTooltip(); return; }
    const index = plot.indexes.reduce((nearest, i) => Math.abs(plot.x(i) - px) < Math.abs(plot.x(nearest) - px) ? i : nearest, plot.indexes[0]);
    const nearest = plot.visible.reduce((a, b) => Math.abs(plot.y(state.history[a.id][index]) - py) < Math.abs(plot.y(state.history[b.id][index]) - py) ? a : b);
    const tooltip = $('child-tooltip');
    tooltip.innerHTML = `<span>${dateFormat.format(state.points[index])}</span><br>${nearest.type} · ${nearest.name}<strong>${euro(state.history[nearest.id][index])}</strong>Capital net après frais et fiscalité`;
    tooltip.hidden = false;
    tooltip.style.left = `${Math.max(8, Math.min(px + 14, rect.width - tooltip.offsetWidth - 8))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(py + 14, rect.height - tooltip.offsetHeight - 8))}px`;
    state.index = index;
    $('child-year').value = index;
    renderLegend();
  }

  $('child-form').addEventListener('submit', e => e.preventDefault());
  $('child-form').addEventListener('input', calculate);
  $('child-form').addEventListener('change', calculate);
  document.querySelectorAll('[data-return]').forEach(button => button.addEventListener('click', () => { $('child-return').value = button.dataset.return; calculate(); }));
  $('exit-at-18').addEventListener('click', () => { if ($('birth-date').value) $('child-exit').value = iso(anniversary(date($('birth-date').value), 18)); calculate(); });
  $('child-rows').addEventListener('click', e => { const button = e.target.closest('[data-child-select]'); if (button) { state.selected = button.dataset.childSelect; renderResults(); $('child-rows').querySelector(`[data-child-select="${state.selected}"]`).focus({ preventScroll: true }); } });
  $('child-legend').addEventListener('click', e => {
    const button = e.target.closest('[data-child-curve]');
    if (!button) return;
    const id = button.dataset.childCurve;
    state.auto = false;
    if (state.visible.has(id)) state.visible.delete(id); else state.visible.add(id);
    renderGraph();
    $('child-legend').querySelector(`[data-child-curve="${id}"]`).focus({ preventScroll: true });
  });
  $('child-best-curves').addEventListener('click', () => { state.auto = true; bestCurves(); renderGraph(); });
  $('child-all-curves').addEventListener('click', () => { state.auto = false; state.visible = new Set(OFFERS.map(offer => offer.id)); renderGraph(); });
  $('child-window').addEventListener('change', renderGraph);
  $('child-scale').addEventListener('change', renderGraph);
  $('child-year').addEventListener('input', e => { state.index = Number(e.target.value); renderGraph(); });
  $('child-graph').addEventListener('pointermove', showTooltip);
  $('child-graph').addEventListener('pointerdown', showTooltip);
  $('child-graph').addEventListener('pointerleave', hideTooltip);
  $('child-graph').addEventListener('pointercancel', hideTooltip);
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#child-graph')) hideTooltip(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTooltip(); });
  window.addEventListener('resize', renderGraph);

  const today = date(iso(new Date()));
  $('birth-date').value = iso(today);
  $('birth-date').max = iso(today);
  $('child-exit').value = iso(anniversary(today, 18));
  $('child-exit').min = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12));
  calculate();
  window.BigShortChild = Object.freeze({ TAX, FUNDS, OFFERS, simulate, taxFor, brokerage, buyNotional, monthEnds, anniversary, checkpoints });
})();
