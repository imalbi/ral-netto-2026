#!/usr/bin/env python3
"""
Independent reference implementation of the reference case, used to check the
JavaScript calculator against a second, separately written model.

It starts from the raw rates in RICERCA.md rather than from the JS code, so a
modelling mistake shows up as a mismatch instead of being reproduced twice.

Output labels are Italian because they mirror the payslip items; identifiers
are English, as everywhere else in the project.
"""

GROSS_ANNUAL = 30_000.0

# Employee share of the wage guarantee fund, driven by company headcount:
#   'upTo5'  FIS 0.50% / 3      'over5'  FIS 0.80% / 3      'over15' CIGS 0.30%
COMPANY_SIZE = "over5"
FUND_EMPLOYEE_RATE = {"upTo5": 0.005 / 3, "over5": 0.008 / 3, "over15": 0.003}[
    COMPANY_SIZE
]

# First year of employment: surcharges are not withheld yet, they are paid the
# following year in advance and balance instalments.
FIRST_YEAR = False

IVS_RATE = 0.0919
MID_INCOME_BONUS = True  # art. 13 comma 1.1 TUIR


def truncate(value: float, decimals: int = 4) -> float:
    """Art. 13 comma 6 TUIR: the ratio is taken to its first four decimals."""
    factor = 10**decimals
    return int(value * factor) / factor


def gross_irpef(income: float) -> float:
    """Progressive brackets, 23 / 33 / 43 per cent."""
    tax = 0.0
    previous_ceiling = 0.0
    for ceiling, rate in ((28_000.0, 0.23), (50_000.0, 0.33), (float("inf"), 0.43)):
        if income > previous_ceiling:
            tax += (min(income, ceiling) - previous_ceiling) * rate
        previous_ceiling = ceiling
    return tax


def employment_deduction(income: float) -> float:
    """Art. 13 comma 1 lett. b) plus the comma 1.1 increase."""
    ratio = truncate((28_000 - income) / (28_000 - 15_000))
    deduction = 1_910 + 1_190 * ratio
    if MID_INCOME_BONUS and 25_000 < income <= 35_000:
        deduction += 65
    return deduction


def regional_surcharge(income: float) -> float:
    """Lombardia, progressive brackets."""
    total = 0.0
    for lower, upper, rate in (
        (0, 15_000, 0.0123),
        (15_000, 28_000, 0.0158),
        (28_000, 50_000, 0.0172),
        (50_000, float("inf"), 0.0173),
    ):
        if income > lower:
            total += (min(income, upper) - lower) * rate
    return total


def municipal_surcharge(income: float) -> float:
    """Milano: flat rate, and the exemption is not an allowance."""
    return income * 0.008 if income > 23_000 else 0.0


ivs = GROSS_ANNUAL * IVS_RATE
fund = GROSS_ANNUAL * FUND_EMPLOYEE_RATE
contributions = ivs + fund
taxable_income = GROSS_ANNUAL - contributions

irpef_gross = gross_irpef(taxable_income)
work_deduction = employment_deduction(taxable_income)
additional_deduction = 1_000.0  # income between 20.000 and 32.000
irpef_net = max(0.0, irpef_gross - work_deduction - additional_deduction)

regional = 0.0 if FIRST_YEAR else regional_surcharge(taxable_income)
municipal = 0.0 if FIRST_YEAR else municipal_surcharge(taxable_income)

net_annual = taxable_income - irpef_net - regional - municipal

print(f"IVS 9,19%                  {ivs:10,.2f}")
print(f"quota fondo {COMPANY_SIZE:<14}{fund:10,.2f}")
print(f"contributi totali          {contributions:10,.2f}")
print(f"imponibile fiscale         {taxable_income:10,.2f}")
print(f"IRPEF lorda                {irpef_gross:10,.2f}")
print(f"detrazione lavoro dip.     {work_deduction:10,.2f}")
print(f"ulteriore detrazione       {additional_deduction:10,.2f}")
print(f"IRPEF netta                {irpef_net:10,.2f}")
print(f"add. regionale Lombardia   {regional:10,.2f}")
print(f"add. comunale Milano       {municipal:10,.2f}")
print(f"NETTO ANNUO                {net_annual:10,.2f}")
for payments in (12, 13, 14):
    print(f"  netto su {payments} mensilita'   {net_annual / payments:10,.2f}")

withheld = GROSS_ANNUAL - net_annual
print(f"prelievo totale            {withheld:10,.2f}  ({withheld / GROSS_ANNUAL:.1%})")
