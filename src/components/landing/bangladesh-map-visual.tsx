"use client";

import { useEffect, useMemo, useState } from "react";
import Map, {
  Layer,
  NavigationControl,
  Source,
  type LayerProps,
} from "react-map-gl/mapbox";
import { AlertTriangle, LoaderCircle } from "lucide-react";

import { reportApi, type PublicMapReport } from "@/lib/api/report-api";
import { getApiErrorMessage } from "@/lib/api/client";

const heatmapLayer: LayerProps = {
  id: "civic-issue-heat",
  type: "heatmap",
  maxzoom: 11,
  paint: {
    "heatmap-weight": [
      "interpolate",
      ["linear"],
      ["get", "severityScore"],
      0,
      0.2,
      1,
      1,
    ],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.8, 9, 2.2],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(8,145,178,0)",
      0.2,
      "rgba(34,211,238,0.55)",
      0.45,
      "rgba(16,185,129,0.72)",
      0.68,
      "rgba(245,158,11,0.84)",
      0.86,
      "rgba(249,115,22,0.92)",
      1,
      "rgba(239,68,68,1)",
    ],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 18, 9, 46],
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.9, 11, 0.35],
  },
};

const hotspotLayer: LayerProps = {
  id: "civic-issue-centres",
  type: "circle",
  minzoom: 6.5,
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["get", "severityScore"], 0, 3, 1, 8],
    "circle-color": "#f8fafc",
    "circle-stroke-color": "#0f172a",
    "circle-stroke-width": 1.5,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 6.5, 0, 8, 0.95],
  },
};

export function BangladeshMapVisual() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const [reports, setReports] = useState<PublicMapReport[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapStyle =
    process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "mapbox://styles/mapbox/dark-v11";
  const mapData = useMemo(() => ({
    type: "FeatureCollection" as const,
    features: reports.map((report) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [report.longitude, report.latitude],
      },
      properties: {
        trackingCode: report.trackingCode,
        category: report.category,
        severity: report.severityLevel,
        severityScore: report.severityScore ?? 0.2,
        status: report.status,
      },
    })),
  }), [reports]);

  useEffect(() => {
    let active = true;
    const load = () => {
      void reportApi.publicMap()
        .then((data) => {
          if (active) {
            setReports(data);
            setDataError(null);
          }
        })
        .catch((reason) => {
          if (active) setDataError(getApiErrorMessage(reason, "Live report data is unavailable."));
        });
    };
    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (!accessToken) {
    return (
      <MapNotice
        title="Map token required"
        message="Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local to load the Bangladesh heatmap."
      />
    );
  }

  if (hasMapError) {
    return (
      <MapNotice
        title="Map unavailable"
        message="Check the Mapbox token and its allowed URLs, then reload this page."
      />
    );
  }

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-950"
      aria-label="Interactive heatmap of civic issue reports across Bangladesh"
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950">
          <div className="flex items-center gap-2 text-xs text-console-muted">
            <LoaderCircle className="size-4 animate-spin text-primary" />
            Loading national issue grid
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-slate-950/90 px-3 py-1.5 font-mono text-[10px] text-teal-300 backdrop-blur">
        {dataError ? "Live data unavailable" : `${reports.length} live mapped reports`}
      </div>

      <Map
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: 90.35,
          latitude: 23.75,
          zoom: 5.55,
        }}
        minZoom={5}
        maxZoom={12}
        maxBounds={[
          [87.6, 19.8],
          [93.2, 27.1],
        ]}
        mapStyle={mapStyle}
        attributionControl={false}
        reuseMaps
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasMapError(true)}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source id="bangladesh-civic-issues" type="geojson" data={mapData}>
          <Layer {...heatmapLayer} />
          <Layer {...hotspotLayer} />
        </Source>
      </Map>
    </div>
  );
}

function MapNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="grid aspect-[4/5] w-full place-items-center rounded-lg bg-slate-950 p-8 text-center">
      <div className="max-w-64">
        <AlertTriangle className="mx-auto mb-3 size-6 text-warning" aria-hidden="true" />
        <p className="text-sm font-semibold text-console-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-console-muted">{message}</p>
      </div>
    </div>
  );
}
