import type { FeatureCollection, Point } from "geojson";

type CivicHeatProperties = {
  city: string;
  issueCount: number;
  severity: number;
};

const civicIssueClusters: Array<{
  city: string;
  coordinates: [number, number];
  issueCount: number;
  severity: number;
}> = [
  { city: "Dhaka", coordinates: [90.4125, 23.8103], issueCount: 286, severity: 1 },
  { city: "Gazipur", coordinates: [90.4203, 24.0023], issueCount: 112, severity: 0.72 },
  { city: "Narayanganj", coordinates: [90.4974, 23.6238], issueCount: 98, severity: 0.7 },
  { city: "Chattogram", coordinates: [91.7832, 22.3569], issueCount: 174, severity: 0.92 },
  { city: "Cumilla", coordinates: [91.1809, 23.4607], issueCount: 76, severity: 0.58 },
  { city: "Cox's Bazar", coordinates: [91.971, 21.4272], issueCount: 68, severity: 0.64 },
  { city: "Sylhet", coordinates: [91.8687, 24.8949], issueCount: 82, severity: 0.62 },
  { city: "Mymensingh", coordinates: [90.4074, 24.7471], issueCount: 64, severity: 0.51 },
  { city: "Rajshahi", coordinates: [88.6042, 24.3745], issueCount: 91, severity: 0.6 },
  { city: "Rangpur", coordinates: [89.2752, 25.7439], issueCount: 55, severity: 0.45 },
  { city: "Bogura", coordinates: [89.3701, 24.8465], issueCount: 58, severity: 0.48 },
  { city: "Khulna", coordinates: [89.5403, 22.8456], issueCount: 87, severity: 0.57 },
  { city: "Jashore", coordinates: [89.2167, 23.1667], issueCount: 49, severity: 0.42 },
  { city: "Barishal", coordinates: [90.3535, 22.701], issueCount: 71, severity: 0.55 },
  { city: "Noakhali", coordinates: [91.0995, 22.8696], issueCount: 46, severity: 0.4 },
];

export const bangladeshHeatmapData: FeatureCollection<
  Point,
  CivicHeatProperties
> = {
  type: "FeatureCollection",
  features: civicIssueClusters.map((cluster) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: cluster.coordinates,
    },
    properties: {
      city: cluster.city,
      issueCount: cluster.issueCount,
      severity: cluster.severity,
    },
  })),
};
