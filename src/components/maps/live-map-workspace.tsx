"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GeoJSONSource } from "mapbox-gl";
import Map, {
  AttributionControl,
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
import {
  createDistrictMapData,
  createIssueMapData,
  getIssueMapExclusionCounts,
} from "@/lib/admin-map-data";
import { issueCategories, issueSeverities, issueStatuses, type AdminIssue } from "@/lib/admin-issues";
import { cn } from "@/lib/utils";

type MapMode = "heat" | "markers" | "clusters" | "districts" | "severity";
type SelectedContext =
  | { kind: "issue"; issue: AdminIssue }
  | {
      kind: "cluster";
      clusterId: number;
      count: number;
      longitude: number;
      latitude: number;
      issues: AdminIssue[];
      loading: boolean;
      error: string | null;
    }
  | { kind: "district"; district: string; count: number; criticalCount: number };

const heatLayer = {
  id: "live-heat",
  type: "heatmap",
  maxzoom: 13,
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "severityScore"], 1, 0.25, 4, 1],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.9, 9, 2.6],
    "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(6,182,212,0)", 0.18, "rgba(34,211,238,.5)", 0.42, "rgba(16,185,129,.72)", 0.65, "rgba(245,158,11,.84)", 0.84, "rgba(249,115,22,.93)", 1, "rgba(239,68,68,1)"],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 24, 9, 58],
    "heatmap-opacity": 0.92,
  },
} satisfies LayerProps;

const markerLayer = {
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
} satisfies LayerProps;

const severityLayer = {
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
} satisfies LayerProps;

const clusterLayer = {
  id: "live-clusters",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": ["step", ["get", "point_count"], "#22d3ee", 5, "#f59e0b", 10, "#ef4444"],
    "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 10, 30],
    "circle-stroke-color": "rgba(255,255,255,.75)",
    "circle-stroke-width": 2,
  },
} satisfies LayerProps;

const clusterCountLayer = {
  id: "live-cluster-count",
  type: "symbol",
  filter: ["has", "point_count"],
  layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 11 },
  paint: { "text-color": "#07111f" },
} satisfies LayerProps;

const clusterPointLayer = {
  id: "live-cluster-points",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-radius": 7,
    "circle-color": "#2dd4bf",
    "circle-stroke-color": "#f8fafc",
    "circle-stroke-width": 2,
    "circle-opacity": 0.9,
  },
} satisfies LayerProps;

const districtLayer = {
  id: "live-districts",
  type: "circle",
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["get", "issueCount"], 1, 17, 10, 29, 50, 42],
    "circle-color": ["case", [">", ["get", "criticalCount"], 0], "rgba(239,68,68,.3)", "rgba(20,184,166,.25)"],
    "circle-stroke-color": "#2dd4bf",
    "circle-stroke-width": 2,
  },
} satisfies LayerProps;

const districtLabelLayer = {
  id: "live-district-labels",
  type: "symbol",
  layout: {
    "text-field": ["concat", ["get", "district"], " · ", ["to-string", ["get", "issueCount"]]],
    "text-size": 10,
    "text-offset": [0, 2.7],
  },
  paint: { "text-color": "#ccfbf1", "text-halo-color": "#0f172a", "text-halo-width": 1 },
} satisfies LayerProps;

const modes: Array<{ id: MapMode; label: string; icon: typeof Layers3 }> = [
  { id: "heat", label: "Heatmap", icon: Layers3 },
  { id: "markers", label: "Markers", icon: MapPin },
  { id: "clusters", label: "Clusters", icon: LocateFixed },
  { id: "districts", label: "Districts", icon: ListFilter },
  { id: "severity", label: "Severity", icon: ShieldAlert },
];

export function LiveMapWorkspace() {
  const { reports, loading: reportsLoading, error: reportsError, reload } = useReports({ limit: 500, sortBy: "createdAt", sortOrder: "desc" }, 15_000);
  const mapRef = useRef<MapRef>(null);
  const shouldFitAfterFilter = useRef(false);
  const hasFitInitialData = useRef(false);
  const [mode, setMode] = useState<MapMode>("markers");
  const [filterOpen, setFilterOpen] = useState(false);
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
  const districtGeojson = useMemo(() => createDistrictMapData(filteredIssues), [filteredIssues]);
  const excluded = useMemo(() => getIssueMapExclusionCounts(filteredIssues), [filteredIssues]);
  const activeFilterCount = [
    category !== "All categories",
    severity !== "All severities",
    status !== "All statuses",
    division !== "All divisions",
    district !== "All districts",
    department !== "All departments",
  ].filter(Boolean).length;
  const visibleFeatureCount = mode === "districts"
    ? districtGeojson.features.length
    : geojson.features.length;
  const divisions = useMemo(() => ["All divisions", ...Array.from(new Set(reports.map((issue) => issue.division))).sort()], [reports]);
  const districts = useMemo(() => [
    "All districts",
    ...Array.from(new Set(
      reports
        .filter((issue) => division === "All divisions" || issue.division === division)
        .map((issue) => issue.district),
    )).sort(),
  ], [division, reports]);
  const departments = useMemo(() => ["All departments", ...Array.from(new Set(reports.map((issue) => issue.department))).sort()], [reports]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const style = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "mapbox://styles/mapbox/dark-v11";
  const interactiveIds = mode === "clusters"
    ? ["live-clusters", "live-cluster-points"]
    : mode === "heat"
      ? []
      : [mode === "severity" ? "live-severity" : mode === "districts" ? "live-districts" : "live-markers"];

  useEffect(() => {
    const needsInitialFit = !hasFitInitialData.current && geojson.features.length > 0;
    if ((!shouldFitAfterFilter.current && !needsInitialFit) || !loaded || !geojson.features.length) return;
    shouldFitAfterFilter.current = false;
    hasFitInitialData.current = true;

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
    const showDesktopFilterSpace = filterOpen && window.matchMedia("(min-width: 1024px)").matches;
    mapRef.current?.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      {
        padding: {
          top: 130,
          bottom: 120,
          left: showDesktopFilterSpace ? 340 : 60,
          right: 60,
        },
        maxZoom: 9,
        duration: 900,
      },
    );
  }, [filterOpen, geojson, loaded, mode]);

  useEffect(() => {
    if (!selected && !filterOpen) return;
    function closeTopOverlay(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (selected) {
        setSelected(null);
      } else {
        setFilterOpen(false);
      }
    }
    window.addEventListener("keydown", closeTopOverlay);
    return () => window.removeEventListener("keydown", closeTopOverlay);
  }, [filterOpen, selected]);

  function resetFilters() {
    shouldFitAfterFilter.current = true;
    setCategory("All categories"); setSeverity("All severities"); setStatus("All statuses"); setDivision("All divisions"); setDistrict("All districts"); setDepartment("All departments"); setSelected(null);
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    shouldFitAfterFilter.current = true;
    setSelected(null);
    setter(value);
  }

  function changeMode(nextMode: MapMode) {
    if (nextMode === mode) {
      setSelected(null);
      return;
    }
    if (nextMode === "clusters" || nextMode === "districts") {
      shouldFitAfterFilter.current = true;
    }
    setSelected(null);
    setMode(nextMode);
  }

  function prepareSelection() {
    setFilterOpen(false);
  }

  function handleMapClick(event: MapMouseEvent) {
    const feature = event.features?.[0];
    if (!feature?.properties) return;
    if (mode === "districts" && feature.properties.district) {
      prepareSelection();
      setSelected({
        kind: "district",
        district: String(feature.properties.district),
        count: Number(feature.properties.issueCount ?? 0),
        criticalCount: Number(feature.properties.criticalCount ?? 0),
      });
      return;
    }
    if (feature.properties.cluster) {
      const count = Number(feature.properties.point_count ?? 0);
      const clusterId = Number(feature.properties.cluster_id);
      const longitude = event.lngLat.lng;
      const latitude = event.lngLat.lat;
      const source = mapRef.current?.getSource("live-issue-clusters") as GeoJSONSource | undefined;

      prepareSelection();
      setSelected({
        kind: "cluster",
        clusterId,
        count,
        longitude,
        latitude,
        issues: [],
        loading: Boolean(source) && Number.isFinite(clusterId),
        error: source && Number.isFinite(clusterId)
          ? null
          : "Cluster details are temporarily unavailable.",
      });

      if (!source || !Number.isFinite(clusterId)) return;

      source.getClusterExpansionZoom(clusterId, (zoomError, zoom) => {
        if (zoomError || zoom == null) return;
        mapRef.current?.easeTo({
          center: [longitude, latitude],
          zoom: Math.min(zoom, 11),
          duration: 700,
        });
      });
      source.getClusterLeaves(clusterId, Math.max(count, 1), 0, (leavesError, features) => {
        if (leavesError || !features) {
          setSelected((current) => current?.kind === "cluster" && current.clusterId === clusterId
            ? {
                ...current,
                loading: false,
                error: "Unable to load the reports in this cluster.",
              }
            : current);
          return;
        }

        const issuesById = new globalThis.Map(filteredIssues.map((issue) => [issue.id, issue]));
        const clusterIssues = features.flatMap((leaf) => {
          const id = leaf.properties?.id;
          const issue = id == null ? undefined : issuesById.get(String(id));
          return issue ? [issue] : [];
        });
        setSelected((current) => current?.kind === "cluster" && current.clusterId === clusterId
          ? {
              ...current,
              issues: clusterIssues,
              loading: false,
              error: clusterIssues.length
                ? null
                : "No report details were returned for this cluster.",
            }
          : current);
      });
      return;
    }
    const issue = filteredIssues.find((item) => item.id === feature.properties?.id);
    if (issue) {
      prepareSelection();
      setSelected({ kind: "issue", issue });
    }
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
        scrollZoom={{ around: "center" }}
        touchZoomRotate={{ around: "center" }}
        mapStyle={style}
        attributionControl={false}
        interactiveLayerIds={interactiveIds}
        onClick={handleMapClick}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        cursor={interactiveIds.length ? "pointer" : "grab"}
        style={{ width: "100%", height: "100%" }}
      >
        <AttributionControl compact position="bottom-left" />
        <NavigationControl position="bottom-right" showCompass />
        <FullscreenControl position="bottom-right" />
        <ScaleControl position="bottom-left" unit="metric" />
        <Source id="live-issues" type="geojson" data={geojson}>
          <Layer {...heatLayer} layout={{ visibility: mode === "heat" ? "visible" : "none" }} />
          <Layer {...markerLayer} layout={{ visibility: mode === "markers" ? "visible" : "none" }} />
          <Layer {...severityLayer} layout={{ visibility: mode === "severity" ? "visible" : "none" }} />
        </Source>
        <Source id="live-issue-clusters" type="geojson" data={geojson} cluster clusterMaxZoom={10} clusterRadius={54}>
          <Layer {...clusterLayer} layout={{ visibility: mode === "clusters" ? "visible" : "none" }} />
          <Layer
            {...clusterCountLayer}
            layout={{ ...clusterCountLayer.layout, visibility: mode === "clusters" ? "visible" : "none" }}
          />
          <Layer {...clusterPointLayer} layout={{ visibility: mode === "clusters" ? "visible" : "none" }} />
        </Source>
        <Source id="live-district-summaries" type="geojson" data={districtGeojson}>
          <Layer {...districtLayer} layout={{ visibility: mode === "districts" ? "visible" : "none" }} />
          <Layer
            {...districtLabelLayer}
            layout={{ ...districtLabelLayer.layout, visibility: mode === "districts" ? "visible" : "none" }}
          />
        </Source>
      </Map>

      {!loaded && <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950"><div className="text-center"><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" /><p className="mt-3 text-xs text-slate-400">Connecting to national issue grid…</p></div></div>}
      {reportsError && <div role="alert" className="absolute left-1/2 top-28 z-40 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-red-300/15 bg-slate-950/95 px-4 py-3 text-xs text-red-300 shadow-2xl"><span>{reportsError}</span><button onClick={() => void reload()} className="font-semibold text-white hover:text-teal-300">Retry</button></div>}
      {reportsLoading && loaded && <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-1.5 text-[10px] text-teal-300 shadow-lg">Syncing live reports…</div>}
      {!reportsLoading && !reportsError && loaded && visibleFeatureCount === 0 && <div className="absolute left-1/2 top-28 z-30 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-amber-300/15 bg-slate-950/95 px-4 py-3 text-center text-xs text-amber-200 shadow-2xl">No reports with usable Bangladesh coordinates match this view. Adjust or reset the current filters.</div>}

      <header className="pointer-events-none absolute left-2 right-2 top-2 z-20 flex items-start justify-between gap-2 sm:left-4 sm:right-4 sm:top-4 sm:gap-4">
        <div className="pointer-events-auto min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:flex-none sm:px-4 sm:py-3">
          <div className="flex items-center gap-2"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-50" /><span className="relative size-2 rounded-full bg-teal-400" /></span><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300">Live national map</p></div>
          <p className="mt-1 truncate font-heading text-sm font-bold text-white sm:text-base">{filteredIssues.length} reports match the current view</p>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {geojson.features.length} mapped
            {excluded.missingCoordinates ? ` · ${excluded.missingCoordinates} missing coordinates` : ""}
            {excluded.outsideBangladesh ? ` · ${excluded.outsideBangladesh} outside Bangladesh` : ""}
          </p>
        </div>
        <Button
          variant="outline"
          className="pointer-events-auto h-11 shrink-0 border-white/10 bg-slate-950/90 px-3 text-slate-300 shadow-xl backdrop-blur hover:bg-slate-900 hover:text-white focus-visible:ring-teal-300/60"
          onClick={() => setFilterOpen((value) => !value)}
          aria-controls="map-filters"
          aria-expanded={filterOpen}
          aria-label={activeFilterCount ? `Map filters, ${activeFilterCount} active` : "Map filters"}
        >
          <Filter />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount ? <span className="grid min-w-5 place-items-center rounded-full bg-teal-300 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">{activeFilterCount}</span> : null}
        </Button>
      </header>

      <div aria-label="Map display mode" className="absolute bottom-3 left-1/2 z-20 flex max-w-[calc(100%-1rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/92 p-1.5 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:max-w-[calc(100%-2rem)]">
        {modes.map((item) => {
          const Icon = item.icon;
          return <button type="button" aria-label={`Show ${item.label.toLowerCase()} view`} aria-pressed={mode === item.id} title={item.label} key={item.id} onClick={() => changeMode(item.id)} className={cn("flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-teal-300/60 sm:h-10", mode === item.id ? "bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-300/10" : "text-slate-500 hover:bg-white/5 hover:text-white")}><Icon className="size-4" /><span className="hidden sm:inline">{item.label}</span></button>;
        })}
      </div>

      <MapLegend mode={mode} />
      {filterOpen && <MapFilters category={category} severity={severity} status={status} division={division} district={district} department={department} divisions={divisions} districts={districts} departments={departments} setCategory={(value) => updateFilter(setCategory, value)} setSeverity={(value) => updateFilter(setSeverity, value)} setStatus={(value) => updateFilter(setStatus, value)} setDivision={(value) => { shouldFitAfterFilter.current = true; setSelected(null); setDivision(value); setDistrict("All districts"); }} setDistrict={(value) => updateFilter(setDistrict, value)} setDepartment={(value) => updateFilter(setDepartment, value)} onReset={resetFilters} onClose={() => setFilterOpen(false)} resultCount={filteredIssues.length} />}
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
    <aside id="map-filters" aria-labelledby="map-filters-title" className="absolute bottom-20 left-2 right-2 z-30 h-[min(58vh,500px)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/96 shadow-2xl backdrop-blur-xl lg:bottom-20 lg:left-4 lg:right-auto lg:top-28 lg:h-auto lg:w-[300px]">
      <header className="flex items-start justify-between border-b border-white/8 px-4 py-3"><div><div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-teal-300" /><h2 id="map-filters-title" className="text-sm font-semibold text-white">Map filters</h2></div><p className="mt-1 text-[10px] text-slate-500">{props.resultCount} reports match this view</p></div><button onClick={props.onClose} className="grid size-11 place-items-center rounded-lg text-slate-500 outline-none hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-300/60" aria-label="Close map filters"><X className="size-4" /></button></header>
      <div className="h-[calc(100%-104px)] space-y-4 overflow-y-auto p-4">
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
      <div className="absolute inset-x-0 bottom-0 border-t border-white/8 bg-slate-950 p-3"><Button variant="ghost" size="sm" className="h-10 w-full text-slate-400 hover:bg-white/5 hover:text-white focus-visible:ring-teal-300/60" onClick={props.onReset}><RotateCcw /> Reset all filters</Button></div>
    </aside>
  );
}

function IntelligenceDrawer({ selected, visibleIssues, onClose }: { selected: SelectedContext; visibleIssues: AdminIssue[]; onClose: () => void }) {
  const selectedDistrict = selected.kind === "issue"
    ? selected.issue.district
    : selected.kind === "district"
      ? selected.district
      : null;
  const related = selected.kind === "cluster"
    ? selected.issues
    : selectedDistrict
      ? visibleIssues.filter((issue) => issue.district === selectedDistrict)
      : [];
  const title = selected.kind === "issue"
    ? selected.issue.title
    : selected.kind === "district"
      ? `${selected.district} district`
      : "Selected issue cluster";
  const contextSummary = selected.kind === "cluster"
    ? `${selected.count} reports in this cluster`
    : selected.kind === "district"
      ? `${selected.count} mapped reports · ${selected.criticalCount} critical`
      : `${selected.issue.location}, ${selected.issue.district} · ${related.length} district reports`;
  const recent = selected.kind === "issue"
    ? related.filter((issue) => issue.id !== selected.issue.id)
    : related;
  const clusterUnavailable = selected.kind === "cluster" && (selected.loading || selected.error);

  return (
    <aside role="dialog" aria-modal="false" aria-labelledby="map-intelligence-title" className="absolute bottom-20 left-2 right-2 z-30 h-[min(58vh,500px)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/96 shadow-2xl backdrop-blur-xl lg:bottom-4 lg:left-auto lg:right-4 lg:top-28 lg:h-auto lg:w-[380px]">
      <header className="border-b border-white/8 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-300">Location intelligence</p><h2 id="map-intelligence-title" className="mt-1 line-clamp-2 font-heading text-base font-bold text-white sm:text-lg">{title}</h2><p className="mt-1 text-[10px] leading-4 text-slate-500">{contextSummary}</p></div><button autoFocus onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-500 outline-none hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-300/60" aria-label="Close intelligence drawer"><X className="size-4" /></button></div></header>
      <div className="h-[calc(100%-105px)] overflow-y-auto">
        {selected.kind === "issue" ? (
          <div className="border-b border-white/8 p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Selected report</p>
            <IssueReportCard issue={selected.issue} emphasized />
          </div>
        ) : null}

        {clusterUnavailable ? (
          <div className="grid min-h-48 place-items-center p-6 text-center">
            {selected.kind === "cluster" && selected.loading ? (
              <div>
                <span className="mx-auto block size-6 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" />
                <p className="mt-3 text-xs text-slate-400">Loading this cluster&apos;s reports…</p>
              </div>
            ) : (
              <div>
                <AlertTriangle className="mx-auto size-6 text-amber-300" />
                <p className="mt-3 text-xs leading-5 text-slate-400">{selected.kind === "cluster" ? selected.error : null}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 p-4">
              <DrawerMetric label={selected.kind === "cluster" ? "Cluster total" : "District total"} value={related.length} />
              <DrawerMetric label="Critical" value={related.filter((issue) => issue.severity === "Critical").length} tone="text-red-300" />
              <DrawerMetric label="In progress" value={related.filter((issue) => issue.status === "In progress").length} tone="text-amber-300" />
            </div>
            <div className="border-y border-white/8 px-4 py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">Status breakdown</p>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/5">
                <span className="bg-cyan-400" style={{ width: `${percent(related, "New")}%` }} />
                <span className="bg-violet-400" style={{ width: `${percent(related, "Under review")}%` }} />
                <span className="bg-blue-400" style={{ width: `${percent(related, "Assigned")}%` }} />
                <span className="bg-amber-400" style={{ width: `${percent(related, "In progress")}%` }} />
                <span className="bg-emerald-400" style={{ width: `${percent(related, "Resolved")}%` }} />
                <span className="bg-slate-500" style={{ width: `${percent(related, "Rejected")}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500"><span>New {percent(related, "New")}%</span><span>Review {percent(related, "Under review")}%</span><span>Assigned {percent(related, "Assigned")}%</span><span>Active {percent(related, "In progress")}%</span><span>Resolved {percent(related, "Resolved")}%</span><span>Rejected {percent(related, "Rejected")}%</span></div>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">{selected.kind === "cluster" ? "Reports in this cluster" : "Recent district reports"}</p>
              {recent.length ? <div className="mt-2 space-y-2">{recent.slice(0, 5).map((issue) => <IssueReportCard issue={issue} key={issue.id} />)}</div> : <p className="mt-3 text-xs text-slate-500">{selected.kind === "issue" ? "No other reports match this district." : "No report details are available."}</p>}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function IssueReportCard({ issue, emphasized = false }: { issue: AdminIssue; emphasized?: boolean }) {
  return (
    <Link href={`/admin/issues/${issue.id}`} className={cn("mt-2 block rounded-xl border p-3 outline-none transition focus-visible:ring-2 focus-visible:ring-teal-300/60", emphasized ? "border-teal-300/20 bg-teal-400/[0.06] hover:bg-teal-400/[0.09]" : "border-white/7 bg-white/[0.025] hover:border-teal-300/20 hover:bg-white/[0.045]")}>
      <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] text-teal-400">{issue.trackingCode ?? issue.id}</span><SeverityBadge severity={issue.severity} /></div>
      <p className="mt-2 text-xs font-medium leading-relaxed text-slate-200">{issue.title}</p>
      <div className="mt-2 flex items-center justify-between gap-2"><span className="line-clamp-1 text-[9px] text-slate-500">{issue.location}</span><StatusBadge status={issue.status} /></div>
    </Link>
  );
}

function MapLegend({ mode }: { mode: MapMode }) {
  return (
    <div className="absolute bottom-20 right-4 z-20 hidden max-w-[260px] rounded-xl border border-white/10 bg-slate-950/92 px-3 py-2.5 shadow-xl backdrop-blur sm:block">
      {mode === "heat" ? (
        <>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">Issue density</p>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-400"><span>Low</span><span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500" /><span>High</span></div>
        </>
      ) : null}
      {mode === "markers" ? (
        <>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">Report locations</p>
          <div className="mt-2 text-[9px] text-slate-400"><LegendDot color="bg-teal-400" label="One mapped report" /></div>
        </>
      ) : null}
      {mode === "clusters" ? (
        <>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">Reports per cluster</p>
          <div className="mt-2 flex items-center gap-3 text-[9px] text-slate-400"><LegendDot color="bg-cyan-400" label="1–4" /><LegendDot color="bg-amber-400" label="5–9" /><LegendDot color="bg-red-500" label="10+" /></div>
        </>
      ) : null}
      {mode === "districts" ? (
        <>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">District summary</p>
          <div className="mt-2 flex items-center gap-3 text-[9px] text-slate-400"><LegendDot color="bg-teal-400" label="No critical" /><LegendDot color="bg-red-500" label="Has critical" /></div>
          <p className="mt-1.5 text-[8px] text-slate-500">Bubble size represents mapped issue volume.</p>
        </>
      ) : null}
      {mode === "severity" ? (
        <>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">Issue severity</p>
          <div className="mt-2 flex items-center gap-3 text-[9px] text-slate-400"><LegendDot color="bg-cyan-400" label="Low" /><LegendDot color="bg-amber-400" label="Medium" /><LegendDot color="bg-orange-500" label="High" /><LegendDot color="bg-red-500" label="Critical" /></div>
        </>
      ) : null}
    </div>
  );
}

function MapFailure({ hasToken }: { hasToken: boolean }) {
  return <main className="grid h-[calc(100vh-4rem)] min-h-[520px] place-items-center bg-slate-950 p-8 text-center"><div className="max-w-sm"><AlertTriangle className="mx-auto size-8 text-amber-300" /><h1 className="mt-4 font-heading text-lg font-bold text-white">{hasToken ? "Map connection failed" : "Mapbox token required"}</h1><p className="mt-2 text-xs leading-relaxed text-slate-500">Add a valid public token to NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN and reload the live map.</p></div></main>;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <fieldset className="space-y-2.5"><legend className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">{label}</legend>{children}</fieldset>;
}

function MapSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="relative block"><span className="mb-1 block text-[10px] text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-white/8 bg-white/[0.025] px-3 pr-8 text-[11px] text-slate-300 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-4 right-3 size-3 text-slate-600" /></label>;
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
