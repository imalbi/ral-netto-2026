// Shapes of the three globals the page exposes. Declared here so the source
// files stay plain JavaScript: no build step, but `npx tsc --noEmit` still
// checks the calculation.

interface RateSource {
  label: string;
  url: string;
  norm: string;
  updated: string;
}

interface FundOption {
  id: string;
  label: string;
  employeeRate: number;
  scheme: string;
  sourceOverride?: string;
}

interface Bracket {
  upTo: number;
  rate: number;
}

/** One line of the gross-to-net waterfall, as rendered by the page. */
interface Step {
  key: string;
  label: string;
  amount: number;
  /** -1 subtracted, +1 added, 0 subtotal. */
  sign: number;
  detail?: string;
  sourceKey?: string;
  emphasis?: boolean;
  total?: boolean;
}

interface CalculationResult {
  grossAnnual: number;
  taxableIncome: number;
  irpefGross: number;
  irpefNet: number;
  totalDeductions: number;
  regional: number;
  municipal: number;
  netAnnual: number;
  totalTaxes: number;
  totalContributions: number;
  firstYear: boolean;
  totalWithheld: number;
  effectiveRate: number;
  monthly: Record<number, number>;
  steps: Step[];
}

interface CalculatorOptions {
  contractType?: string;
  companySize?: string;
  firstYear?: boolean;
}

declare var RATES: any;
declare var SOURCES: Record<string, RateSource>;
declare var Calculator: {
  compute(grossAnnual: number, options?: CalculatorOptions): CalculationResult;
  fmt(value: number): string;
  pct(rate: number, decimals: number): string;
  truncate(value: number, decimals: number): number;
  applyBrackets(amount: number, brackets: Bracket[]): number;
};

interface Window {
  RATES: any;
  SOURCES: Record<string, RateSource>;
  Calculator: typeof Calculator;
}
