import type { FeatureCollection, Point } from "geojson";

import { adminIssues, type AdminIssue } from "@/lib/admin-issues";

const districtCoordinates: Record<string, [number, number]> = {
  Dhaka: [90.4125, 23.8103],
  Chattogram: [91.7832, 22.3569],
  Gazipur: [90.4203, 24.0023],
  Sylhet: [91.8687, 24.8949],
  Rajshahi: [88.6042, 24.3745],
  Khulna: [89.5403, 22.8456],
  Barishal: [90.3535, 22.701],
  Rangpur: [89.2752, 25.7439],
  Mymensingh: [90.4074, 24.7471],
  Cumilla: [91.1809, 23.4607],
  Narayanganj: [90.4974, 23.6238],
  Bogura: [89.3701, 24.8465],
};

const coordinateOffsets: Array<[number, number]> = [
  [0, 0],
  [0.025, 0.018],
  [-0.021, 0.014],
  [0.017, -0.023],
];

export type MapIssueProperties = AdminIssue & {
  severityScore: number;
};

const severityScore = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export function createIssueMapData(issues: AdminIssue[]): FeatureCollection<Point, MapIssueProperties> {
  return {
    type: "FeatureCollection",
    features: issues.map((issue, index) => {
      const base = districtCoordinates[issue.district] ?? [90.35, 23.75];
      const offset = coordinateOffsets[index % coordinateOffsets.length];
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [base[0] + offset[0], base[1] + offset[1]],
        },
        properties: {
          ...issue,
          severityScore: severityScore[issue.severity],
        },
      };
    }),
  };
}

export const allIssueMapData = createIssueMapData(adminIssues);
