"use client";

import { AlertTriangle, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: "10px",
  color: "#e2e8f0",
  fontSize: "11px",
};

type ChartStateProps = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function ResolutionChart({
  data,
  loading = false,
  error,
  onRetry,
}: {
  data: Array<{ day: string; opened: number; resolved: number }>;
} & ChartStateProps) {
  if (loading) {
    return <ChartState loading title="Loading resolution performance" />;
  }

  if (error) {
    return (
      <ChartState
        title="Resolution data unavailable"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  const validData = data.filter(
    (item) =>
      Number.isFinite(item.opened) &&
      Number.isFinite(item.resolved),
  );
  const openedTotal = validData.reduce((total, item) => total + item.opened, 0);
  const resolvedTotal = validData.reduce(
    (total, item) => total + item.resolved,
    0,
  );

  if (!validData.length || openedTotal + resolvedTotal === 0) {
    return (
      <ChartState
        empty
        title="No seven-day activity yet"
        message="Opened and resolved report activity will appear here once records are available."
      />
    );
  }

  return (
    <div
      className="h-60 px-2 pb-3 pt-4"
      role="img"
      aria-label={`Resolution performance for the last seven days: ${openedTotal} reports opened and ${resolvedTotal} resolved.`}
    >
      <div className="size-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={validData} margin={{ top: 8, right: 14, left: -18, bottom: 0 }}>
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
    </div>
  );
}

export function CategoryChart({
  data,
  loading = false,
  error,
  onRetry,
}: {
  data: Array<{ name: string; value: number; color: string }>;
} & ChartStateProps) {
  if (loading) {
    return <ChartState loading title="Loading category distribution" />;
  }

  if (error) {
    return (
      <ChartState
        title="Category data unavailable"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  const validData = data.filter(
    (item) => Number.isFinite(item.value) && item.value > 0,
  );
  const total = validData.reduce((sum, item) => sum + item.value, 0);

  if (!validData.length) {
    return (
      <ChartState
        empty
        title="No category data yet"
        message="Category distribution will appear after reports have been classified."
      />
    );
  }

  const categorySummary = validData
    .map((item) => `${item.name}: ${item.value}`)
    .join(", ");

  return (
    <div
      className="grid min-h-60 grid-cols-[45%_55%] items-center px-4 py-3"
      role="img"
      aria-label={`Issue category distribution across ${total} reports. ${categorySummary}.`}
    >
      <div className="h-44" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={validData} dataKey="value" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none">
              {validData.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-3" aria-hidden="true">
        {validData.map((item) => (
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

function ChartState({
  loading = false,
  empty = false,
  title,
  message,
  onRetry,
}: {
  loading?: boolean;
  empty?: boolean;
  title: string;
  message?: string;
  onRetry?: () => void;
}) {
  const role = loading || empty ? "status" : "alert";
  const Icon = loading ? Loader2 : empty ? BarChart3 : AlertTriangle;

  return (
    <div className="grid min-h-60 place-items-center px-6 py-10 text-center" role={role} aria-live="polite">
      <div className="max-w-sm">
        <Icon
          className={loading ? "mx-auto size-5 animate-spin text-teal-300" : empty ? "mx-auto size-5 text-slate-600" : "mx-auto size-5 text-red-300"}
          aria-hidden="true"
        />
        <p className="mt-3 text-xs font-semibold text-slate-200">{title}</p>
        {message ? <p className="mt-1 text-[10px] leading-4 text-slate-500">{message}</p> : null}
        {!loading && !empty && onRetry ? (
          <Button size="sm" variant="ghost" className="mt-3 text-slate-400 hover:bg-white/5 hover:text-white" onClick={onRetry}>
            <RefreshCw />
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
