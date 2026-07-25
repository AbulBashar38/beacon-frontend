"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { AttributionControl, Layer, NavigationControl, Source, type LayerProps, type MapRef } from "react-map-gl/mapbox";
import { AlertTriangle, Layers3, LoaderCircle, MapPin } from "lucide-react";

import {
  createIssueMapData,
  getIssueMapExclusionCounts,
} from "@/lib/admin-map-data";
import type { AdminIssue } from "@/lib/admin-issues";
import { cn } from "@/lib/utils";

const heatLayer = {
  id: "admin-issue-heat",
  type: "heatmap",
  maxzoom: 12,
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "severityScore"], 1, 0.25, 4, 1],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.85, 9, 2.4],
    "heatmap-color": [
      "interpolate", ["linear"], ["heatmap-density"],
      0, "rgba(8,145,178,0)",
      0.18, "rgba(34,211,238,0.5)",
      0.42, "rgba(16,185,129,0.7)",
      0.66, "rgba(245,158,11,0.82)",
      0.84, "rgba(249,115,22,0.92)",
      1, "rgba(239,68,68,1)",
    ],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 22, 9, 54],
    "heatmap-opacity": 0.9,
  },
} satisfies LayerProps;

const markerLayer = {
  id: "admin-issue-markers",
  type: "circle",
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["get", "severityScore"], 1, 5, 4, 14],
    "circle-color": ["match", ["get", "severity"], "Critical", "#ef4444", "High", "#f97316", "Medium", "#f59e0b", "#22d3ee"],
    "circle-opacity": 0.82,
    "circle-stroke-color": "#f8fafc",
    "circle-stroke-width": 1.5,
  },
} satisfies LayerProps;

export function OverviewMap({ issues }: { issues: AdminIssue[] }) {
  const mapRef = useRef<MapRef>(null);
  const [mode, setMode] = useState<"heat" | "markers">("markers");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const style = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "mapbox://styles/mapbox/dark-v11";
  const mapData = useMemo(() => createIssueMapData(issues), [issues]);
  const excluded = useMemo(() => getIssueMapExclusionCounts(issues), [issues]);

  useEffect(() => {
    if (!loaded || !mapData.features.length) return;
    const points = mapData.features.map((feature) => feature.geometry.coordinates);
    if (points.length === 1) {
      mapRef.current?.easeTo({ center: points[0] as [number, number], zoom: 9, duration: 700 });
      return;
    }
    const longitudes = points.map(([longitude]) => longitude);
    const latitudes = points.map(([, latitude]) => latitude);
    mapRef.current?.fitBounds(
      [[Math.min(...longitudes), Math.min(...latitudes)], [Math.max(...longitudes), Math.max(...latitudes)]],
      { padding: 60, maxZoom: 9, duration: 700 },
    );
  }, [loaded, mapData]);

  if (!token || failed) {
    return (
      <div className="grid min-h-[420px] place-items-center bg-slate-950 p-8 text-center">
        <div className="max-w-xs">
          <AlertTriangle className="mx-auto size-7 text-amber-300" />
          <p className="mt-3 text-sm font-semibold text-white">{token ? "Map connection failed" : "Mapbox token required"}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Add a valid public token in NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN and reload the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[420px] overflow-hidden">
      {!loaded && <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950"><span className="flex items-center gap-2 text-xs text-slate-400"><LoaderCircle className="size-4 animate-spin text-teal-300" />Loading operational map</span></div>}
      {loaded && !mapData.features.length ? <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950/75 p-8 text-center"><p className="max-w-sm text-xs leading-5 text-slate-400">No submitted reports currently contain usable Bangladesh coordinates. Reports appear here after a citizen selects a valid map location.</p></div> : null}
      <div aria-label="Overview map display" className="absolute left-4 top-4 z-10 flex rounded-lg border border-white/10 bg-slate-950/90 p-1 shadow-lg backdrop-blur">
        <MapModeButton active={mode === "heat"} onClick={() => setMode("heat")} icon={<Layers3 className="size-3.5" />} label="Heat" />
        <MapModeButton active={mode === "markers"} onClick={() => setMode("markers")} icon={<MapPin className="size-3.5" />} label="Markers" />
      </div>
      <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 backdrop-blur">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {mapData.features.length} mapped
          {excluded.missingCoordinates ? ` · ${excluded.missingCoordinates} without coordinates` : ""}
          {excluded.outsideBangladesh ? ` · ${excluded.outsideBangladesh} outside Bangladesh` : ""}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
          <span>{mode === "heat" ? "Low density" : "Low"}</span><span className="h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500" /><span>{mode === "heat" ? "High density" : "Critical"}</span>
        </div>
      </div>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{ longitude: 90.35, latitude: 23.75, zoom: 5.65 }}
        minZoom={5}
        maxZoom={12}
        maxBounds={[[87.6, 19.8], [93.2, 27.1]]}
        mapStyle={style}
        attributionControl={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{ width: "100%", height: 420 }}
      >
        <AttributionControl compact position="bottom-right" />
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="dashboard-issues" type="geojson" data={mapData}>
          <Layer
            {...heatLayer}
            layout={{ visibility: mode === "heat" ? "visible" : "none" }}
          />
          <Layer
            {...markerLayer}
            layout={{ visibility: mode === "markers" ? "visible" : "none" }}
          />
        </Source>
      </Map>
    </div>
  );
}

function MapModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={cn("flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-teal-300/60", active ? "bg-teal-400/15 text-teal-300" : "text-slate-500 hover:text-slate-200")}>{icon}{label}</button>;
}
