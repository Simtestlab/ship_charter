"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface Props {
  revenue: number;
  expenses: number;
  profit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val: number = payload[0].value;
    const negative = val < 0;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="font-semibold text-slate-300 mb-1">{label}</p>
        <p className={negative ? "text-red-400" : "text-cyan-300"}>
          ₹{val.toFixed(2)} Cr
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ revenue, expenses, profit }: Props) {
  const data = [
    { name: "Revenue", value: revenue },
    { name: "Expenses", value: expenses },
    { name: "Profit", value: profit },
  ];

  const barColors: Record<string, string> = {
    Revenue: "#22d3ee",
    Expenses: "#fb923c",
    Profit: profit < 0 ? "#f87171" : "#34d399",
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `₹${v}Cr`}
        />
        <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={72}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={barColors[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
