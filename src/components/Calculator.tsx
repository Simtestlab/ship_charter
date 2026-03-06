"use client";

import { useState, useMemo } from "react";
import {
  Ship,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Printer,
  Anchor,
  Fuel,
  Wrench,
  Building2,
  Globe,
  Package,
} from "lucide-react";
import RevenueChart from "./RevenueChart";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Inputs {
  noOfContainers: string;
  costPerContainer: string;
  tripsPerYear: string;
  portCharges: string;
  fuelCost: string;
  operatingCost: string;
  fixedExpensePerYear: string;
  usdExchangeRate: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const toCrores = (val: number) => (val / 10_000_000).toFixed(2);
const toUSDM = (val: number, rate: number) =>
  (val / rate / 1_000_000).toFixed(2);
const fmt = (n: string) =>
  Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function InputGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cyan-400">{icon}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  prefix,
  placeholder,
}: {
  label: string;
  name: keyof Inputs;
  value: string;
  onChange: (name: keyof Inputs, val: string) => void;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min="0"
          value={value}
          placeholder={placeholder ?? "0"}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full rounded-lg bg-slate-800 border border-slate-700 text-slate-100
            text-sm py-2.5 pr-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
            transition-colors ${prefix ? "pl-7" : "pl-3"}`}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  inrCrores: string;
  usdMillion: string;
  icon: React.ReactNode;
  color: string;
  isProfit?: boolean;
}

function StatCard({
  title,
  inrCrores,
  usdMillion,
  icon,
  color,
  isProfit,
}: StatCardProps) {
  const negative = isProfit && Number(usdMillion) < 0;
  return (
    <div
      className={`print-card rounded-xl border bg-slate-800/60 backdrop-blur p-5 flex flex-col gap-3
        ${negative ? "border-red-500/40" : `border-${color}-500/30`}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <span className={`text-${color}-400`}>{icon}</span>
      </div>
      <div>
        <p
          className={`text-2xl font-bold ${
            negative ? "text-red-400" : `text-${color}-300`
          }`}
        >
          ${usdMillion}M USD
        </p>
        <p className="text-sm text-slate-400 mt-0.5">
          ₹{inrCrores} Cr
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>({
    noOfContainers: "600",
    costPerContainer: "600",
    tripsPerYear: "18",
    portCharges: "30000",
    fuelCost: "55000",
    operatingCost: "3600",
    fixedExpensePerYear: "279000",
    usdExchangeRate: "91.59",
  });

  const handleChange = (name: keyof Inputs, val: string) => {
    setInputs((prev) => ({ ...prev, [name]: val }));
  };

  // ── Calculations ───────────────────────────
  const results = useMemo(() => {
    const n = (key: keyof Inputs) => parseFloat(inputs[key]) || 0;
    const rate = n("usdExchangeRate") || 91.59;

    // Inputs are in USD — convert to INR for calculations
    const annualRevenue =
      n("noOfContainers") * (n("costPerContainer") * rate) * n("tripsPerYear");

    const variablePerTrip =
      (n("portCharges") + n("fuelCost") + n("operatingCost")) * rate;

    const totalAnnualExpenses =
      variablePerTrip * n("tripsPerYear") + n("fixedExpensePerYear") * rate * 12;

    const annualProfit = annualRevenue - totalAnnualExpenses;

    const profitInUSD = annualProfit / rate;
    const profitMargin =
      profitInUSD !== 0
        ? ((5_500_000 / profitInUSD) * 100).toFixed(1)
        : "0.0";

    const costRecoveryYears =
      profitInUSD > 0 ? (5_500_000 / profitInUSD).toFixed(2) : "—";

    return {
      annualRevenue,
      totalAnnualExpenses,
      annualProfit,
      profitMargin,
      costRecoveryYears,
      rate,
    };
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* ── Header ── */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Ship className="text-cyan-400" size={28} />
          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Ship Charter
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Profitability Calculator
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          <Printer size={16} />
          Print / Export PDF
        </button>
      </header>

      {/* ── Body ── */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ══ LEFT: INPUTS ══ */}
        <section className="no-print space-y-2">
          <h2 className="text-base font-semibold text-slate-300 mb-4">
            Configure Your Voyage
          </h2>

          {/* Global Settings */}
          <InputGroup label="Global Settings" icon={<Globe size={16} />}>
            <Field
              label="USD Exchange Rate (₹ per $1)"
              name="usdExchangeRate"
              value={inputs.usdExchangeRate}
              onChange={handleChange}
              prefix="₹"
              placeholder="91.59"
            />
          </InputGroup>

          {/* Trip Details */}
          <InputGroup label="Trip Details" icon={<Package size={16} />}>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="No. of Containers"
                name="noOfContainers"
                value={inputs.noOfContainers}
                onChange={handleChange}
                placeholder="100"
              />
              <Field
                label="Trips Per Year"
                name="tripsPerYear"
                value={inputs.tripsPerYear}
                onChange={handleChange}
                placeholder="12"
              />
            </div>
            <Field
              label="Cost Per Container ($)"
              name="costPerContainer"
              value={inputs.costPerContainer}
              onChange={handleChange}
              prefix="$"
              placeholder="600"
            />
          </InputGroup>

          {/* Operating Expenses */}
          <InputGroup
            label="Operating Expenses (Per Trip)"
            icon={<Wrench size={16} />}
          >
            <Field
              label="Port Charges ($)"
              name="portCharges"
              value={inputs.portCharges}
              onChange={handleChange}
              prefix="$"
            />
            <Field
              label="Fuel Cost ($)"
              name="fuelCost"
              value={inputs.fuelCost}
              onChange={handleChange}
              prefix="$"
            />
            <Field
              label="Other Operating Cost ($)"
              name="operatingCost"
              value={inputs.operatingCost}
              onChange={handleChange}
              prefix="$"
            />
          </InputGroup>

          {/* Fixed Expenses */}
          <InputGroup label="Fixed Expenses" icon={<Building2 size={16} />}>
            <Field
              label="Monthly Rental ($)"
              name="fixedExpensePerYear"
              value={inputs.fixedExpensePerYear}
              onChange={handleChange}
              prefix="$"
              placeholder="23250"
            />
          </InputGroup>

          {/* Quick Summary */}
          <div className="mt-2 rounded-xl bg-slate-800 border border-slate-700 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Quick Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-400">Variable Cost / Trip</span>
              <span className="text-right font-medium text-slate-200">
                ${fmt(String((parseFloat(inputs.portCharges) || 0) + (parseFloat(inputs.fuelCost) || 0) + (parseFloat(inputs.operatingCost) || 0)))}
              </span>
              <span className="text-slate-400">Fixed Expenses / Year</span>
              <span className="text-right font-medium text-slate-200">
                ${fmt(String((parseFloat(inputs.fixedExpensePerYear) || 0) * 12))}
              </span>
              <span className="text-slate-400">Containers / Year</span>
              <span className="text-right font-medium text-slate-200">
                {fmt(String((parseFloat(inputs.noOfContainers) || 0) * (parseFloat(inputs.tripsPerYear) || 0)))}
              </span>
            </div>
          </div>
        </section>

        {/* ══ RIGHT: RESULTS ══ */}
        <section className="space-y-6">
          <h2 className="text-base font-semibold text-slate-300">
            Annual Financials
          </h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Total Annual Revenue"
              inrCrores={toCrores(results.annualRevenue)}
              usdMillion={toUSDM(results.annualRevenue, results.rate)}
              icon={<DollarSign size={20} />}
              color="cyan"
            />
            <StatCard
              title="Total Annual Expenses"
              inrCrores={toCrores(results.totalAnnualExpenses)}
              usdMillion={toUSDM(results.totalAnnualExpenses, results.rate)}
              icon={<TrendingDown size={20} />}
              color="orange"
            />
            <StatCard
              title="Net Annual Profit"
              inrCrores={toCrores(results.annualProfit)}
              usdMillion={toUSDM(results.annualProfit, results.rate)}
              icon={<TrendingUp size={20} />}
              color="emerald"
              isProfit
            />
            <div className="print-card rounded-xl border border-violet-500/30 bg-slate-800/60 backdrop-blur p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cost Recovery %
                </span>
                <span className="text-violet-400">
                  <Percent size={20} />
                </span>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${
                    Number(results.profitMargin) < 0
                      ? "text-red-400"
                      : "text-violet-300"
                  }`}
                >
                  {results.profitMargin}%
                </p>
                <p className="text-sm text-slate-400 mt-0.5">
                  $5.5M USD as % of annual profit
                </p>
              </div>
            </div>
            <div className="print-card rounded-xl border border-sky-500/30 bg-slate-800/60 backdrop-blur p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cost Recovery Years
                </span>
                <span className="text-sky-400">
                  <Anchor size={20} />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-300">
                  {results.costRecoveryYears} yrs
                </p>
                <p className="text-sm text-slate-400 mt-0.5">
                  Years to recover $5.5M USD
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="print-card rounded-xl bg-slate-800 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Anchor size={16} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">
                Financial Breakdown
              </h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-700">
                {[
                  {
                    label: "Annual Revenue",
                    val: results.annualRevenue,
                    cls: "text-cyan-300",
                  },
                  {
                    label: "Variable Expenses (Annual)",
                    val:
                      ((parseFloat(inputs.portCharges) || 0) +
                        (parseFloat(inputs.fuelCost) || 0) +
                        (parseFloat(inputs.operatingCost) || 0)) *
                      results.rate *
                      (parseFloat(inputs.tripsPerYear) || 0),
                    cls: "text-orange-300",
                  },
                  {
                    label: "Fixed Expenses (Annual)",
                    val: (parseFloat(inputs.fixedExpensePerYear) || 0) * results.rate * 12,
                    cls: "text-orange-300",
                  },
                  {
                    label: "Total Expenses",
                    val: results.totalAnnualExpenses,
                    cls: "text-orange-400 font-semibold",
                  },
                  {
                    label: "Net Profit",
                    val: results.annualProfit,
                    cls:
                      results.annualProfit < 0
                        ? "text-red-400 font-bold"
                        : "text-emerald-400 font-bold",
                  },
                ].map(({ label, val, cls }) => (
                  <tr key={label} className="py-2">
                    <td className="py-2 text-slate-400">{label}</td>
                    <td className={`py-2 text-right ${cls}`}>
                      ${toUSDM(val, results.rate)}M
                    </td>
                    <td className="py-2 text-right text-slate-500 pl-3">
                      ₹{toCrores(val)} Cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="print-card rounded-xl bg-slate-800 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">
                Revenue vs Expenses
              </h3>
              <span className="ml-auto text-xs text-slate-500">₹ Crores</span>
            </div>
            <RevenueChart
              revenue={parseFloat(toCrores(results.annualRevenue))}
              expenses={parseFloat(toCrores(results.totalAnnualExpenses))}
              profit={parseFloat(toCrores(results.annualProfit))}
            />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="no-print text-center py-6 text-xs text-slate-600 border-t border-slate-800">
        Ship Charter Profitability Calculator · All values in INR Crores &amp; USD Millions
      </footer>
    </div>
  );
}
