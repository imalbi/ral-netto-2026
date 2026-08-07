// @ts-check
/**
 * Tax and social security parameters for the 2026 tax year.
 *
 * Every constant carries its own source, the date it was consulted and its
 * "kind":
 *
 *   - "annual"     the value is re-published every year. A source older than
 *                  the tax year is a bug.
 *   - "structural" the value is set by law and is not re-published annually.
 *                  Proof of validity is that no norm has amended it, not the
 *                  age of the document quoting it.
 *
 * The UI renders this metadata, so the page and the code cannot drift apart.
 */
(function (global) {
  'use strict';

  const SOURCES = {
    ade_irpef: {
      label: "Agenzia delle Entrate, scheda “Aliquote e calcolo dell'Irpef”",
      url: 'https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef',
      norm: 'Legge 199/2025 (Bilancio 2026), art. 1, commi 3-4',
      updated: '13 gennaio 2026',
    },
    tuir_art13: {
      label: 'Normattiva, TUIR art. 13, testo vigente dal 1-1-2025 al 31-12-2026',
      url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-08-06',
      norm: 'd.P.R. 917/1986, art. 13',
      updated: 'vigente al 6 agosto 2026',
    },
    ade_circ4: {
      label: 'Agenzia delle Entrate, circolare n. 4/E del 16 maggio 2025',
      url: 'https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91',
      norm: 'Legge di Bilancio 2025, commi 2, 3, 4 e seguenti',
      updated: '16 maggio 2025',
    },
    inps_circ6: {
      label: 'INPS, circolare n. 6 del 30 gennaio 2026',
      url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html',
      norm: 'd.l. 384/1992 art. 3-ter, conv. legge 438/1992',
      updated: '30 gennaio 2026',
    },
    inps_ivs: {
      label: 'INPS, circolare n. 82 del 14 luglio 2022 (ribadita dalla n. 101 del 29 novembre 2024)',
      url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2022.07.circolare-numero-82-del-14-07-2022_13885.html',
      norm: 'Aliquota IVS 33%: 23,81% datore + 9,19% lavoratore',
      updated: '14 luglio 2022',
    },
    inps_fis: {
      label: 'INPS, circolare n. 5 del 20 gennaio 2025',
      url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2025.01.circolare-numero-5-del-20-01-2025_14781.html',
      norm: 'Art. 29, comma 8, d.lgs. 148/2015: FIS ripartito 2/3 datore e 1/3 lavoratore',
      updated: '20 gennaio 2025',
    },
    inps_cigs: {
      label: 'INPS, circolare n. 18 del 1° febbraio 2022',
      url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa.html',
      norm: 'Contributo ordinario CIGS 0,90%: 0,60% datore, 0,30% lavoratore',
      updated: '1 febbraio 2022',
    },
    mef_lombardia: {
      label: 'MEF, Dipartimento delle Finanze, addizionale regionale - Lombardia',
      url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10',
      norm: 'Legge regionale Lombardia 14 luglio 2003, n. 10, art. 72 comma 1',
      updated: 'anno d’imposta 2026',
    },
    milano: {
      label: 'Comune di Milano, Addizionale comunale Irpef',
      url: 'https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef',
      norm: 'Delibera C.C. n. 36 del 21/10/2013 (aliquota), n. 46 del 28/09/2020 (esenzione)',
      updated: '12 maggio 2026',
    },
  };

  const RATES = {
    taxYear: 2026,

    // --- Social security, employee share -----------------------------------
    inps: {
      kind: 'structural',
      source: 'inps_ivs',
      employeeRate: 0.0919,
      note:
        'Sola quota IVS. A questa si somma la quota del fondo di integrazione ' +
        'salariale a carico del lavoratore, fra 0,17% e 0,30% secondo la ' +
        'dimensione aziendale: vedi wageGuaranteeFunds.',
    },
    inpsThresholds: {
      kind: 'annual',
      source: 'inps_circ6',
      extraRate: 0.01,
      extraRateThreshold: 56224.0, // prima fascia di retribuzione pensionabile
      contributionCap: 122295.0, // massimale annuo
      note:
        'L’1% aggiuntivo si applica alla quota eccedente la prima fascia e ' +
        'fino al massimale. Il massimale riguarda gli iscritti dopo il 31/12/1995.',
    },

    // --- Wage guarantee funds, employee share ------------------------------
    // Every non-executive employee funds either the FIS or the CIGS, so the
    // 9.19% IVS rate alone matches no real payslip. The share depends on the
    // company headcount, which is why this is a choice on the page.
    wageGuaranteeFunds: {
      kind: 'structural',
      source: 'inps_fis',
      options: [
        {
          id: 'upTo5',
          label: 'Fino a 5 dipendenti',
          employeeRate: 0.005 / 3,
          scheme: 'FIS 0,50%, un terzo a carico del lavoratore',
        },
        {
          id: 'over5',
          // The statutory rule is "more than 5", but above 15 the CIGS takes
          // over, so the label is bounded to keep the three options mutually
          // exclusive from the user's point of view.
          label: 'Da 6 a 15 dipendenti',
          employeeRate: 0.008 / 3,
          scheme: 'FIS 0,80%, un terzo a carico del lavoratore',
        },
        {
          id: 'over15',
          label: 'Oltre 15 dipendenti',
          employeeRate: 0.003,
          scheme: 'CIGS 0,90%, di cui 0,30% a carico del lavoratore',
          sourceOverride: 'inps_cigs',
        },
      ],
      defaultOption: 'over5',
      note:
        'Sopra i 15 dipendenti FIS e CIGS possono coesistere. Il prototipo ' +
        'applica la sola quota CIGS, che è la più alta delle due, e lo dichiara.',
    },

    // --- IRPEF -------------------------------------------------------------
    irpefBrackets: {
      kind: 'annual',
      source: 'ade_irpef',
      brackets: [
        { upTo: 28000, rate: 0.23 },
        { upTo: 50000, rate: 0.33 },
        { upTo: Infinity, rate: 0.43 },
      ],
      note: 'Progressive per scaglioni. Nel 2026 il secondo scaglione scende dal 35% al 33%.',
    },

    // --- Detrazione da lavoro dipendente (TUIR art. 13) --------------------
    employmentDeduction: {
      kind: 'structural',
      source: 'tuir_art13',
      flatUpTo15k: 1955,
      minPermanent: 690,
      minFixedTerm: 1380,
      band2Base: 1910,
      band2Coefficient: 1190,
      band2Span: 13000, // 28.000 - 15.000
      band3Base: 1910,
      band3Span: 22000, // 50.000 - 28.000
      midIncomeBonus: 65,
      midIncomeFrom: 25000,
      midIncomeTo: 35000,
      ratioDecimals: 4, // art. 13 comma 6
      note:
        'Comma 1.1: +65 euro se il reddito complessivo supera 25.000 ma non ' +
        '35.000. Comma 6: il rapporto si assume nelle prime quattro cifre decimali.',
    },

    // --- Ulteriore detrazione, fascia 20.000-40.000 ------------------------
    additionalDeduction: {
      kind: 'annual',
      source: 'ade_circ4',
      amount: 1000,
      fullUpTo: 32000,
      fromIncome: 20000,
      phaseOutTo: 40000,
      phaseOutSpan: 8000,
      note: 'Detrazione dall’imposta lorda, decresce da 32.000 fino ad azzerarsi a 40.000.',
    },

    // --- Somma integrativa, reddito fino a 20.000 --------------------------
    integrativeSum: {
      kind: 'annual',
      source: 'ade_circ4',
      incomeCeiling: 20000,
      tiers: [
        { upTo: 8500, rate: 0.071 },
        { upTo: 15000, rate: 0.053 },
        { upTo: Infinity, rate: 0.048 },
      ],
      note: 'Non concorre alla formazione del reddito complessivo.',
    },

    // --- Trattamento integrativo (d.l. 3/2020) -----------------------------
    integrativeTreatment: {
      kind: 'structural',
      source: 'ade_circ4',
      maxAmount: 1200,
      incomeCeiling: 15000,
      safeguardClause: 75,
      note:
        'Spetta se l’imposta lorda supera la detrazione dell’art. 13 comma 1 ' +
        'diminuita di 75 euro.',
    },

    // --- Addizionale regionale Lombardia -----------------------------------
    regionalSurcharge: {
      kind: 'annual',
      source: 'mef_lombardia',
      region: 'Lombardia',
      progressive: true,
      brackets: [
        { upTo: 15000, rate: 0.0123 },
        { upTo: 28000, rate: 0.0158 },
        { upTo: 50000, rate: 0.0172 },
        { upTo: Infinity, rate: 0.0173 },
      ],
      note: 'Per scaglioni progressivi, come l’IRPEF. Base: reddito complessivo.',
    },

    // --- Addizionale comunale Milano ---------------------------------------
    municipalSurcharge: {
      kind: 'annual',
      source: 'milano',
      municipality: 'Milano',
      rate: 0.008,
      exemptionUpTo: 23000,
      exemptionIsAllowance: false,
      note:
        'Aliquota unica. L’esenzione NON è una franchigia: superata la soglia ' +
        'l’aliquota si applica all’intero imponibile.',
    },

    // --- Contract ----------------------------------------------------------
    payments: {
      kind: 'structural',
      source: null,
      options: [12, 13, 14],
      defaultOption: 14,
      note:
        'CCNL Terziario Distribuzione e Servizi: 14 mensilità. Il numero di ' +
        'mensilità non cambia il netto annuo, cambia solo come viene diviso.',
    },
  };

  global.RATES = RATES;
  global.SOURCES = SOURCES;
})(window);
