"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  FullscreenControl,
  Layer,
  NavigationControl,
  ScaleControl,
  Source,
  type LayerProps,
  type MapMouseEvent,
  type MapRef,
} from "react-map-gl/mapbox";
import {
  AlertTriangle,
  ChevronDown,
  Filter,
  Layers3,
  ListFilter,
  LocateFixed,
  MapPin,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { SeverityBadge, StatusBadge } from "@/components/shared/issue-badges";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-reports";
import { createIssueMapData } from "@/lib/admin-map-data";
import { issueCategories, issueSeverities, issueStatuses, type AdminIssue } from "@/lib/admin-issues";
import { cn } from "@/lib/utils";

type MapMode = "heat" | "markers" | "clusters" | "districts" | "severity";
type SelectedContext = { kind: "issue"; issue: AdminIssue } | { kind: "cluster"; count: number; longitude: number; latitude: number };

const heatLayer: LayerProps = {
  id: "live-heat",
  type: "heatmap",
  maxzoom: 11,
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "severityScore"], 1, 0.25, 4, 1],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.9, 9, 2.6],
    "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(6,182,212,0)", 0.18, "rgba(34,211,238,.5)", 0.42, "rgba(16,185,129,.72)", 0.65, "rgba(245,158,11,.84)", 0.84, "rgba(249,115,22,.93)", 1, "rgba(239,68,68,1)"],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 24, 9, 58],
    "heatmap-opacity": 0.92,
  },
};

const markerLayer: LayerProps = {
  id: "live-markers",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": 7,
    "circle-color": "#2dd4bf",
    "circle-stroke-color": "#f8fafc",
    "circle-stroke-width": 2,
    "circle-opacity": 0.9,
  },
};

const severityLayer: LayerProps = {
  id: "live-severity",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["get", "severityScore"], 1, 6, 4, 13],
    "circle-color": ["match", ["get", "severity"], "Critical", "#ef4444", "High", "#f97316", "Medium", "#f59e0b", "#22d3ee"],
    "circle-stroke-color": "#f8fafc",
    "circle-stroke-width": 1.5,
    "circle-opacity": 0.88,
  },
};

const clusterLayer: LayerProps = {
  id: "live-clusters",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": ["step", ["get", "point_count"], "#22d3ee", 5, "#f59e0b", 10, "#ef4444"],
    "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 10, 30],
    "circle-stroke-color": "rgba(255,255,255,.75)",
    "circle-stroke-width": 2,
  },
};

const clusterCountLayer: LayerProps = {
  id: "live-cluster-count",
  type: "symbol",
  filter: ["has", "point_count"],
  layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 11 },
  paint: { "text-color": "#07111f" },
};

const districtLayer: LayerProps = {
  id: "live-districts",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 15, 9, 28],
    "circle-color": "rgba(20,184,166,.22)",
    "circle-stroke-color": "#2dd4bf",
    "circle-stroke-width": 1.5,
  },
};

const districtLabelLayer: LayerProps = {
  id: "live-district-labels",
  type: "symbol",
  filter: ["!", ["has", "point_count"]],
  layout: { "text-field": ["get", "district"], "text-size": 10, "text-offset": [0, 2.1] },
  paint: { "text-color": "#ccfbf1", "text-halo-color": "#0f172a", "text-halo-width": 1 },
};

const modes: Array<{ id: MapMode; label: string; icon: typeof Layers3 }> = [
  { id: "heat", label: "Heatmap", icon: Layers3 },
  { id: "markers", label: "Markers", icon: MapPin },
  { id: "clusters", label: "Clusters", icon: LocateFixed },
  { id: "districts", label: "Districts", icon: ListFilter },
  { id: "severity", label: "Severity", icon: ShieldAlert },
];

export function LiveMapWorkspace() {
  const { reports, loading: reportsLoading, error: reportsError, reload } = useReports({ limit: 100, sortBy: "createdAt", sortOrder: "desc" }, 15_000);
  const mapRef = useRef<MapRef>(null);
  const shouldFitAfterFilter = useRef(false);
  const [mode, setMode] = useState<MapMode>("heat");
  const [filterOpen, setFilterOpen] = useState(true);
  const [selected, setSelected] = useState<SelectedContext | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState("All categories");
  const [severity, setSeverity] = useState("All severities");
  const [status, setStatus] = useState("All statuses");
  const [division, setDivision] = useState("All divisions");
  const [district, setDistrict] = useState("All districts");
  const [department, setDepartment] = useState("All departments");

  const filteredIssues = useMemo(() => reports.filter((issue) =>
    (category === "All categories" || issue.category === category) &&
    (severity === "All severities" || issue.severity === severity) &&
    (status === "All statuses" || issue.status === status) &&
    (division === "All divisions" || issue.division === division) &&
    (district === "All districts" || issue.district === district) &&
    (department === "All departments" || issue.department === department)
  ), [category, department, district, division, reports, severity, status]);
  const geojson = useMemo(() => createIssueMapData(filteredIssues), [filteredIssues]);
  const divisions = useMemo(() => ["All divisions", ...Array.from(new Set(reports.map((issue) => issue.division))).sort()], [reports]);
  const districts = useMemo(() => ["All districts", ...Array.from(new Set(reports.map((issue) => issue.district))).sort()], [reports]);
  const departments = useMemo(() => ["All departments", ...Array.from(new Set(reports.map((issue) => issue.department))).sort()], [reports]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const style = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "mapbox://styles/mapbox/dark-v11";
  const interactiveIds = mode === "clusters" ? ["live-clusters", "live-markers"] : mode === "heat" ? [] : [mode === "severity" ? "live-severity" : mode === "districts" ? "live-districts" : "live-markers"];

  useEffect(() => {
    if (!shouldFitAfterFilter.current || !loaded || !geojson.features.length) return;
    shouldFitAfterFilter.current = false;

    const coordinates = geojson.features.map((feature) => feature.geometry.coordinates);
    if (coordinates.length === 1) {
      mapRef.current?.easeTo({
        center: coordinates[0] as [number, number],
        zoom: 8.4,
        duration: 850,
      });
      return;
    }

    const longitudes = coordinates.map(([longitude]) => longitude);
    const latitudes = coordinates.map(([, latitude]) => latitude);
    mapRef.current?.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      {
        padding: {
          top: 130,
          bottom: 120,
          left: filterOpen ? 340 : 60,
          right: 60,
        },
        maxZoom: 9,
        duration: 900,
      },
    );
  }, [filterOpen, geojson, loaded]);

  function resetFilters() {
    shouldFitAfterFilter.current = true;
    setCategory("All categories"); setSeverity("All severities"); setStatus("All statuses"); setDivision("All divisions"); setDistrict("All districts"); setDepartment("All departments"); setSelected(null);
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    shouldFitAfterFilter.current = true;
    setSelected(null);
    setter(value);
  }

  function handleMapClick(event: MapMouseEvent) {
    const feature = event.features?.[0];
    if (!feature?.properties) return;
    if (feature.properties.cluster) {
      const count = Number(feature.properties.point_count ?? 0);
      setSelected({ kind: "cluster", count, longitude: event.lngLat.lng, latitude: event.lngLat.lat });
      mapRef.current?.easeTo({ center: [event.lngLat.lng, event.lngLat.lat], zoom: Math.min((mapRef.current.getZoom() ?? 5) + 1.7, 11), duration: 700 });
      return;
    }
    const issue = filteredIssues.find((item) => item.id === feature.properties?.id);
    if (issue) setSelected({ kind: "issue", issue });
  }

  if (!token || failed) {
    return <MapFailure hasToken={Boolean(token)} />;
  }

  return (
    <main className="relative h-[calc(100vh-4rem)] min-h-[620px] overflow-hidden bg-slate-950">
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{ longitude: 90.35, latitude: 23.75, zoom: 5.65 }}
        minZoom={5}
        maxZoom={13}
        maxBounds={[[87.5, 19.7], [93.3, 27.2]]}
        mapStyle={style}
        attributionControl={false}
        interactiveLayerIds={interactiveIds}
        onClick={handleMapClick}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        cursor={interactiveIds.length ? "pointer" : "grab"}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" showCompass />
        <FullscreenControl position="bottom-right" />
        <ScaleControl position="bottom-left" unit="metric" />
        <Source id="live-issues" type="geojson" data={geojson} cluster={mode === "clusters" || mode === "districts"} clusterMaxZoom={10} clusterRadius={54}>
          {mode === "heat" && <Layer {...heatLayer} />}
          {mode === "markers" && <Layer {...markerLayer} />}
          {mode === "severity" && <Layer {...severityLayer} />}
          {mode === "clusters" && <><Layer {...clusterLayer} /><Layer {...clusterCountLayer} /><Layer {...markerLayer} /></>}
          {mode === "districts" && <><Layer {...clusterLayer} /><Layer {...clusterCountLayer} /><Layer {...districtLayer} /><Layer {...districtLabelLayer} /></>}
        </Source>
      </Map>

      {!loaded && <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950"><div className="text-center"><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" /><p className="mt-3 text-xs text-slate-400">Connecting to national issue grid…</p></div></div>}
      {reportsError && <div role="alert" className="absolute left-1/2 top-28 z-40 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-red-300/15 bg-slate-950/95 px-4 py-3 text-xs text-red-300 shadow-2xl"><span>{reportsError}</span><button onClick={() => void reload()} className="font-semibold text-white hover:text-teal-300">Retry</button></div>}
      {reportsLoading && loaded && <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-1.5 text-[10px] text-teal-300 shadow-lg">Syncing live reports…</div>}

      <header className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4">
        <div className="pointer-events-auto rounded-xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-50" /><span className="relative size-2 rounded-full bg-teal-400" /></span><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300">Live national map</p></div>
          <p className="mt-1 font-heading text-base font-bold text-white">{filteredIssues.length} visible infrastructure issues</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Updated 40 seconds ago · 64 districts online</p>
        </div>
        <Button variant="outline" className="pointer-events-auto border-white/10 bg-slate-950/90 text-slate-300 shadow-xl backdrop-blur hover:bg-slate-900 hover:text-white" onClick={() => setFilterOpen((value) => !value)}><Filter /> Filters</Button>
      </header>

      <div className="absolute bottom-6 left-1/2 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/92 p-1.5 shadow-2xl backdrop-blur-xl">
        {modes.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => { setMode(item.id); setSelected(null); }} className={cn("flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium transition", mode === item.id ? "bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-300/10" : "text-slate-500 hover:bg-white/5 hover:text-white")}><Icon className="size-3.5" />{item.label}</button>;
        })}
      </div>

      <MapLegend mode={mode} />
      {filterOpen && <MapFilters category={category} severity={severity} status={status} division={division} district={district} department={department} divisions={divisions} districts={districts} departments={departments} setCategory={(value) => updateFilter(setCategory, value)} setSeverity={(value) => updateFilter(setSeverity, value)} setStatus={(value) => updateFilter(setStatus, value)} setDivision={(value) => updateFilter(setDivision, value)} setDistrict={(value) => updateFilter(setDistrict, value)} setDepartment={(value) => updateFilter(setDepartment, value)} onReset={resetFilters} onClose={() => setFilterOpen(false)} resultCount={filteredIssues.length} />}
      {selected && <IntelligenceDrawer selected={selected} visibleIssues={filteredIssues} onClose={() => setSelected(null)} />}
    </main>
  );
}

function MapFilters(props: {
  category: string; severity: string; status: string; division: string; district: string; department: string;
  divisions: string[]; districts: string[]; departments: string[];
  setCategory: (value: string) => void; setSeverity: (value: string) => void; setStatus: (value: string) => void; setDivision: (value: string) => void; setDistrict: (value: string) => void; setDepartment: (value: string) => void;
  onReset: () => void; onClose: () => void; resultCount: number;
}) {
  return (
    <aside className="absolute bottom-20 left-4 top-28 z-30 w-[300px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/94 shadow-2xl backdrop-blur-xl">
      <header className="flex items-start justify-between border-b border-white/8 px-4 py-3"><div><div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-teal-300" /><h2 className="text-sm font-semibold text-white">Map filters</h2></div><p className="mt-1 text-[10px] text-slate-500">{props.resultCount} reports match this view</p></div><button onClick={props.onClose} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Close map filters"><X className="size-4" /></button></header>
      <div className="max-h-[calc(100%-104px)] space-y-4 overflow-y-auto p-4">
        <FilterGroup label="Issue details">
          <MapSelect label="Category" value={props.category} options={issueCategories} onChange={props.setCategory} />
          <MapSelect label="Severity" value={props.severity} options={issueSeverities} onChange={props.setSeverity} />
          <MapSelect label="Status" value={props.status} options={issueStatuses} onChange={props.setStatus} />
        </FilterGroup>
        <FilterGroup label="Geography">
          <MapSelect label="Division" value={props.division} options={props.divisions} onChange={props.setDivision} />
          <MapSelect label="District" value={props.district} options={props.districts} onChange={props.setDistrict} />
        </FilterGroup>
        <FilterGroup label="Ownership">
          <MapSelect label="Department" value={props.department} options={props.departments} onChange={props.setDepartment} />
        </FilterGroup>
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-white/8 bg-slate-950 p-3"><Button variant="ghost" size="sm" className="w-full text-slate-400 hover:bg-white/5 hover:text-white" onClick={props.onReset}><RotateCcw /> Reset all filters</Button></div>
    </aside>
  );
}

function IntelligenceDrawer({ selected, visibleIssues, onClose }: { selected: SelectedContext; visibleIssues: AdminIssue[]; onClose: () => void }) {
  const related = selected.kind === "issue" ? visibleIssues.filter((issue) => issue.district === selected.issue.district) : visibleIssues;
  const title = selected.kind === "issue" ? `${selected.issue.location}, ${selected.issue.district}` : "Selected issue cluster";
  return (
    <aside className="absolute bottom-4 right-4 top-28 z-30 w-[380px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
      <header className="border-b border-white/8 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-300">Location intelligence</p><h2 className="mt-1 font-heading text-lg font-bold text-white">{title}</h2><p className="mt-1 text-[10px] text-slate-500">{selected.kind === "cluster" ? `${selected.count} reports in this cluster` : `${related.length} reports in district`}</p></div><button onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Close intelligence drawer"><X className="size-4" /></button></div></header>
      <div className="h-[calc(100%-95px)] overflow-y-auto">
        <div className="grid grid-cols-3 gap-2 p-4">
          <DrawerMetric label="Total issues" value={related.length} />
          <DrawerMetric label="Critical" value={related.filter((issue) => issue.severity === "Critical").length} tone="text-red-300" />
          <DrawerMetric label="In progress" value={related.filter((issue) => issue.status === "In progress").length} tone="text-amber-300" />
        </div>
        <div className="border-y border-white/8 px-4 py-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">Status breakdown</p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/5"><span className="bg-cyan-400" style={{ width: `${percent(related, "New")}%` }} /><span className="bg-violet-400" style={{ width: `${percent(related, "Acknowledged")}%` }} /><span className="bg-amber-400" style={{ width: `${percent(related, "In progress")}%` }} /><span className="bg-emerald-400" style={{ width: `${percent(related, "Resolved")}%` }} /></div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500"><span>New {percent(related, "New")}%</span><span>Acknowledged {percent(related, "Acknowledged")}%</span><span>Active {percent(related, "In progress")}%</span><span>Resolved {percent(related, "Resolved")}%</span></div>
        </div>
        <div className="p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">Recent reports</p><div className="mt-2 space-y-2">{related.slice(0, 5).map((issue) => <div key={issue.id} className="rounded-xl border border-white/7 bg-white/[0.025] p-3"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] text-slate-600">{issue.id}</span><SeverityBadge severity={issue.severity} /></div><p className="mt-2 text-xs font-medium leading-relaxed text-slate-200">{issue.title}</p><div className="mt-2 flex items-center justify-between"><span className="text-[9px] text-slate-500">{issue.location}</span><StatusBadge status={issue.status} /></div></div>)}</div></div>
      </div>
    </aside>
  );
}

function MapLegend({ mode }: { mode: MapMode }) {
  return <div className="absolute bottom-20 right-4 z-20 hidden rounded-xl border border-white/10 bg-slate-950/92 px-3 py-2.5 shadow-xl backdrop-blur sm:block"><p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">{mode === "heat" ? "Issue density" : mode === "severity" ? "Severity" : "Report locations"}</p><div className="mt-2 flex items-center gap-2 text-[9px] text-slate-400">{mode === "heat" ? <><span>Low</span><span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500" /><span>Critical</span></> : <><LegendDot color="bg-cyan-400" label="Low" /><LegendDot color="bg-amber-400" label="Medium" /><LegendDot color="bg-red-500" label="Critical" /></>}</div></div>;
}

function MapFailure({ hasToken }: { hasToken: boolean }) {
  return <main className="grid h-[calc(100vh-4rem)] min-h-[520px] place-items-center bg-slate-950 p-8 text-center"><div className="max-w-sm"><AlertTriangle className="mx-auto size-8 text-amber-300" /><h1 className="mt-4 font-heading text-lg font-bold text-white">{hasToken ? "Map connection failed" : "Mapbox token required"}</h1><p className="mt-2 text-xs leading-relaxed text-slate-500">Add a valid public token to NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN and reload the live map.</p></div></main>;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <fieldset className="space-y-2.5"><legend className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">{label}</legend>{children}</fieldset>;
}

function MapSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="relative block"><span className="mb-1 block text-[10px] text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full appearance-none rounded-lg border border-white/8 bg-white/[0.025] px-3 pr-8 text-[11px] text-slate-300 outline-none focus:border-teal-400/40">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 size-3 text-slate-600" /></label>;
}

function DrawerMetric({ label, value, tone = "text-white" }: { label: string; value: number; tone?: string }) {
  return <div className="rounded-xl border border-white/7 bg-white/[0.025] p-3"><p className="text-[8px] uppercase tracking-wide text-slate-600">{label}</p><p className={cn("mt-1 font-heading text-xl font-bold", tone)}>{value}</p></div>;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-1"><span className={cn("size-1.5 rounded-full", color)} />{label}</span>;
}

function percent(issues: AdminIssue[], status: AdminIssue["status"]) {
  return issues.length ? Math.round((issues.filter((issue) => issue.status === status).length / issues.length) * 100) : 0;
}
