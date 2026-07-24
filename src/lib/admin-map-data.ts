import type { FeatureCollection, Point } from "geojson";

import { adminIssues, type AdminIssue } from "@/lib/admin-issues";

export type MapIssueProperties = AdminIssue & {
  severityScore: number;
};

const severityScore = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export function createIssueMapData(issues: AdminIssue[]): FeatureCollection<Point, MapIssueProperties> {
  return {
    type: "FeatureCollection",
    features: issues
      .filter((issue) => issue.longitude != null && issue.latitude != null)
      .map((issue) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [issue.longitude as number, issue.latitude as number],
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
