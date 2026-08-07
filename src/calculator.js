// @ts-check
/**
 * Gross-to-net calculation for the 2026 tax year.
 *
 * The chain is deliberately written one step per function, named after the
 * payslip item it produces, so that every number on screen can be traced to
 * the function that made it and from there to the source in rates-2026.js.
 *
 * Order of the chain (see README):
 *   RAL - social security = taxable income
 *   taxable income -> gross IRPEF -> deductions -> net IRPEF
 *   surcharges: computed on income, but due only if IRPEF is due after deductions
 *   net = taxable income - net IRPEF - surcharges + integrative payments
 */
(function (global) {
  'use strict';

  const R = global.RATES;

  /**
   * TUIR art. 13 comma 6: the ratio is taken to its first four decimals.
   * @param {number} value
   * @param {number} decimals
   * @returns {number}
   */
  function truncate(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  }

  /**
   * Applies a progressive bracket table to an amount.
   * @param {number} amount
   * @param {Bracket[]} brackets
   * @returns {number}
   */
  function applyBrackets(amount, brackets) {
    let tax = 0;
    let previousCeiling = 0;
    for (const bracket of brackets) {
      if (amount <= previousCeiling) break;
      const slice = Math.min(amount, bracket.upTo) - previousCeiling;
      tax += slice * bracket.rate;
      previousCeiling = bracket.upTo;
    }
    return tax;
  }

  /**
   * Employee social security: base rate, plus 1% above the first band.
   * @param {number} grossAnnual
   * @returns {{base: number, extra: number, total: number}}
   */
  function socialSecurity(grossAnnual) {
    const t = R.inpsThresholds;
    const base = Math.min(grossAnnual, t.contributionCap) * R.inps.employeeRate;
    const excess = Math.max(
      0,
      Math.min(grossAnnual, t.contributionCap) - t.extraRateThreshold
    );
    return { base, extra: excess * t.extraRate, total: base + excess * t.extraRate };
  }

  /**
   * Employee share of the wage guarantee fund, driven by company headcount.
   * @param {number} grossAnnual
   * @param {string} [sizeId]
   * @returns {{option: FundOption, amount: number}}
   */
  function wageGuaranteeShare(grossAnnual, sizeId) {
    const w = R.wageGuaranteeFunds;
    const option =
      w.options.find((/** @type {FundOption} */ o) => o.id === sizeId) ||
      w.options.find((/** @type {FundOption} */ o) => o.id === w.defaultOption);
    return { option, amount: grossAnnual * option.employeeRate };
  }

  /**
   * TUIR art. 13 comma 1 and 1.1.
   * @param {number} income
   * @param {string} contractType
   * @returns {{theoretical: number, bonus: number, total: number}}
   */
  function employmentDeduction(income, contractType) {
    const d = R.employmentDeduction;
    let theoretical;

    if (income <= 15000) {
      const floor = contractType === 'determinato' ? d.minFixedTerm : d.minPermanent;
      theoretical = Math.max(d.flatUpTo15k, floor);
    } else if (income <= 28000) {
      const ratio = truncate((28000 - income) / d.band2Span, d.ratioDecimals);
      theoretical = d.band2Base + d.band2Coefficient * ratio;
    } else if (income <= 50000) {
      const ratio = truncate((50000 - income) / d.band3Span, d.ratioDecimals);
      theoretical = d.band3Base * ratio;
    } else {
      theoretical = 0;
    }

    const bonus =
      income > d.midIncomeFrom && income <= d.midIncomeTo ? d.midIncomeBonus : 0;

    return { theoretical, bonus, total: theoretical + bonus };
  }

  /**
   * Ulteriore detrazione for incomes between 20.000 and 40.000.
   * @param {number} income
   * @returns {number}
   */
  function additionalDeduction(income) {
    const a = R.additionalDeduction;
    if (income <= a.fromIncome || income > a.phaseOutTo) return 0;
    if (income <= a.fullUpTo) return a.amount;
    return a.amount * ((a.phaseOutTo - income) / a.phaseOutSpan);
  }

  /**
   * Somma integrativa for incomes up to 20.000. Does not form taxable income.
   * @param {number} income
   * @param {number} employmentIncome
   * @returns {number}
   */
  function integrativeSum(income, employmentIncome) {
    const s = R.integrativeSum;
    if (income > s.incomeCeiling) return 0;
    const tier = s.tiers.find((/** @type {Bracket} */ t) => employmentIncome <= t.upTo);
    return employmentIncome * tier.rate;
  }

  /**
   * Trattamento integrativo (d.l. 3/2020), capienza check included.
   * @param {number} income
   * @param {number} grossIrpef
   * @param {number} employmentDeductionTheoretical
   * @returns {number}
   */
  function integrativeTreatment(income, grossIrpef, employmentDeductionTheoretical) {
    const t = R.integrativeTreatment;
    if (income > t.incomeCeiling) return 0;
    const threshold = employmentDeductionTheoretical - t.safeguardClause;
    return grossIrpef > threshold ? t.maxAmount : 0;
  }

  /**
   * @param {number} income
   * @returns {number}
   */
  function regionalSurcharge(income) {
    return applyBrackets(income, R.regionalSurcharge.brackets);
  }

  /**
   * Milan: flat rate, and the exemption is not an allowance.
   * @param {number} income
   * @returns {number}
   */
  function municipalSurcharge(income) {
    const m = R.municipalSurcharge;
    if (income <= m.exemptionUpTo) return 0;
    return income * m.rate;
  }

  /**
   * Runs the whole chain and returns both the final figures and the ordered
   * breakdown the UI renders.
   * @param {number} grossAnnual
   * @param {CalculatorOptions} [options]
   * @returns {CalculationResult}
   */
  function compute(grossAnnual, options) {
    const opts = options || {};
    const contractType = opts.contractType || 'indeterminato';

    const inps = socialSecurity(grossAnnual);
    const fund = wageGuaranteeShare(grossAnnual, opts.companySize);
    const contributions = inps.total + fund.amount;
    const taxableIncome = grossAnnual - contributions;

    // No other income and no deductible charges in the standard case, so the
    // taxable income doubles as the "reddito complessivo" the deductions and
    // the surcharges are measured against.
    const totalIncome = taxableIncome;

    const irpefGross = applyBrackets(taxableIncome, R.irpefBrackets.brackets);
    const workDeduction = employmentDeduction(totalIncome, contractType);
    const extraDeduction = additionalDeduction(totalIncome);
    const deductions = workDeduction.total + extraDeduction;
    const irpefNet = Math.max(0, irpefGross - deductions);

    // Surcharges are due only if IRPEF is still due once deductions are applied.
    // In the first year of employment they are not withheld at all: they are
    // paid the following year, in instalments (advance from March, balance
    // after the year-end adjustment).
    const firstYear = Boolean(opts.firstYear);
    const surchargesDue = irpefNet > 0 && !firstYear;
    const regional = surchargesDue ? regionalSurcharge(totalIncome) : 0;
    const municipal = surchargesDue ? municipalSurcharge(totalIncome) : 0;

    const bonusSum = integrativeSum(totalIncome, taxableIncome);
    const bonusTreatment = integrativeTreatment(
      totalIncome,
      irpefGross,
      workDeduction.theoretical
    );

    const netAnnual =
      taxableIncome - irpefNet - regional - municipal + bonusSum + bonusTreatment;

    /** @type {Step[]} */
    const steps = [
      {
        key: 'gross',
        label: 'Retribuzione annua lorda',
        amount: grossAnnual,
        sign: 0,
        detail: 'Comprende tredicesima e quattordicesima.',
      },
      {
        key: 'inps',
        label: 'Contributi INPS a carico del dipendente',
        amount: inps.total,
        sign: -1,
        detail:
          `Aliquota IVS ${pct(R.inps.employeeRate, 2)}` +
          (inps.extra > 0
            ? `, più l’1% sulla quota oltre ${fmt(R.inpsThresholds.extraRateThreshold)}`
            : ''),
        sourceKey: 'inps_ivs',
      },
      {
        key: 'fund',
        label: 'Contributo ' + (fund.option.id === 'over15' ? 'CIGS' : 'FIS') + ' a carico del dipendente',
        amount: fund.amount,
        sign: -1,
        detail: fund.option.scheme,
        sourceKey: fund.option.sourceOverride || 'inps_fis',
      },
      {
        key: 'taxable',
        label: 'Imponibile fiscale',
        amount: taxableIncome,
        sign: 0,
        emphasis: true,
        detail: 'I contributi obbligatori non concorrono a formare il reddito (art. 51 TUIR).',
      },
      {
        key: 'irpefGross',
        label: 'IRPEF lorda',
        amount: irpefGross,
        sign: -1,
        detail: 'Aliquote 23 / 33 / 43% applicate per scaglioni.',
        sourceKey: 'ade_irpef',
      },
      {
        key: 'workDeduction',
        label: 'Detrazione da lavoro dipendente',
        amount: workDeduction.total,
        sign: 1,
        detail:
          workDeduction.bonus > 0
            ? `Art. 13 comma 1, più i ${fmt(workDeduction.bonus)} del comma 1.1 per i redditi medi.`
            : 'Art. 13 comma 1 TUIR.',
        sourceKey: 'tuir_art13',
      },
    ];

    if (extraDeduction > 0) {
      steps.push({
        key: 'extraDeduction',
        label: 'Ulteriore detrazione',
        amount: extraDeduction,
        sign: 1,
        detail: 'Spetta per i redditi complessivi tra 20.000 e 40.000 euro.',
        sourceKey: 'ade_circ4',
      });
    }

    steps.push({
      key: 'irpefNet',
      label: 'IRPEF netta',
      amount: irpefNet,
      sign: 0,
      emphasis: true,
      detail: irpefNet === 0 ? 'Le detrazioni assorbono per intero l’imposta lorda.' : '',
    });

    steps.push({
      key: 'regional',
      label: 'Addizionale regionale ' + R.regionalSurcharge.region,
      amount: regional,
      sign: -1,
      detail: surchargesDue
        ? 'Per scaglioni progressivi sul reddito complessivo.'
        : firstYear
          ? 'Primo anno: si versa dall’anno prossimo, in acconto e saldo.'
          : 'Non dovuta: non risulta IRPEF dovuta dopo le detrazioni.',
      sourceKey: 'mef_lombardia',
    });

    steps.push({
      key: 'municipal',
      label: 'Addizionale comunale ' + R.municipalSurcharge.municipality,
      amount: municipal,
      sign: -1,
      detail: firstYear
        ? 'Primo anno: si versa dall’anno prossimo, in acconto e saldo.'
        : !surchargesDue
        ? 'Non dovuta: non risulta IRPEF dovuta dopo le detrazioni.'
        : municipal === 0
          ? `Esente: imponibile entro ${fmt(R.municipalSurcharge.exemptionUpTo)}.`
          : `Aliquota ${pct(R.municipalSurcharge.rate, 1)} sull’intero imponibile, l’esenzione non è una franchigia.`,
      sourceKey: 'milano',
    });

    if (bonusSum > 0) {
      steps.push({
        key: 'integrativeSum',
        label: 'Somma integrativa',
        amount: bonusSum,
        sign: 1,
        detail: 'Spetta fino a 20.000 euro di reddito complessivo.',
        sourceKey: 'ade_circ4',
      });
    }
    if (bonusTreatment > 0) {
      steps.push({
        key: 'integrativeTreatment',
        label: 'Trattamento integrativo',
        amount: bonusTreatment,
        sign: 1,
        detail: 'Spetta fino a 15.000 euro, verificata la capienza dell’imposta lorda.',
        sourceKey: 'ade_circ4',
      });
    }

    steps.push({
      key: 'net',
      label: 'Netto annuo',
      amount: netAnnual,
      sign: 0,
      emphasis: true,
      total: true,
    });

    /** @type {Record<number, number>} */
    const monthly = {};
    R.payments.options.forEach((/** @type {number} */ n) => {
      monthly[n] = netAnnual / n;
    });

    return {
      grossAnnual,
      taxableIncome,
      irpefGross,
      irpefNet,
      totalDeductions: deductions,
      regional,
      municipal,
      netAnnual,
      // The brief asks for "quanto sono le tasse che deve pagare" as a figure
      // of its own, so taxes and social security are reported separately
      // rather than lumped into one withholding total.
      totalTaxes: irpefNet + regional + municipal,
      totalContributions: contributions,
      firstYear,
      totalWithheld: grossAnnual - netAnnual,
      effectiveRate: grossAnnual > 0 ? (grossAnnual - netAnnual) / grossAnnual : 0,
      monthly,
      steps,
    };
  }

  /**
   * @param {number} value
   * @returns {string}
   */
  function fmt(value) {
    return value.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // Italian groups thousands only from 10.000 up. In a column of figures
      // that reads as an inconsistency, so grouping is forced.
      useGrouping: 'always',
    });
  }

  /**
   * @param {number} rate
   * @param {number} decimals
   * @returns {string}
   */
  function pct(rate, decimals) {
    return rate.toLocaleString('it-IT', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  global.Calculator = { compute, fmt, pct, truncate, applyBrackets };
})(window);
