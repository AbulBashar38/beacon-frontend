"use client";

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "11px",
};

export function ResolutionChart({ data }: { data: Array<{ day: string; opened: number; resolved: number }> }) {
  return (
    <div className="h-60 px-2 pb-3 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 14, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="resolvedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.28} /><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,.08)" }} />
          <Area type="monotone" dataKey="opened" stroke="#64748b" strokeWidth={1.5} fill="transparent" />
          <Area type="monotone" dataKey="resolved" stroke="#2dd4bf" strokeWidth={2} fill="url(#resolvedFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  return (
    <div className="grid min-h-60 grid-cols-[45%_55%] items-center px-4 py-3">
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none">
              {data.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-3">
        {data.map((item) => (
          <li key={item.name} className="flex items-center gap-2 text-[11px]">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="flex-1 text-slate-400">{item.name}</span>
            <span className="font-mono font-semibold text-slate-200">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
