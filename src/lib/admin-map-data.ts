import type { FeatureCollection, Point } from "geojson";

import { adminIssues, type AdminIssue } from "@/lib/admin-issues";

export type MapIssueProperties = AdminIssue & {
  severityScore: number;
};

export type DistrictMapProperties = {
  district: string;
  division: string;
  issueCount: number;
  criticalCount: number;
  severityScore: number;
};

const severityScore: Record<AdminIssue["severity"], number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const districtCenters: Record<string, [longitude: number, latitude: number]> = {
  Dhaka: [90.4125, 23.8103],
  Gazipur: [90.4203, 24.0023],
  Narayanganj: [90.4974, 23.6238],
  Chattogram: [91.7832, 22.3569],
  Cumilla: [91.1809, 23.4607],
  Sylhet: [91.8687, 24.8949],
  Mymensingh: [90.4074, 24.7471],
  Rajshahi: [88.6042, 24.3745],
  Rangpur: [89.2752, 25.7439],
  Bogura: [89.3701, 24.8465],
  Khulna: [89.5403, 22.8456],
  Barishal: [90.3535, 22.701],
};

export type IssueMapExclusionCounts = {
  missingCoordinates: number;
  outsideBangladesh: number;
};

export function isInsideBangladesh([longitude, latitude]: [number, number]) {
  return longitude >= 88 && longitude <= 92.7 && latitude >= 20.5 && latitude <= 26.7;
}

function hasFiniteCoordinates(issue: AdminIssue): issue is AdminIssue & {
  longitude: number;
  latitude: number;
} {
  return (
    issue.longitude != null &&
    issue.latitude != null &&
    Number.isFinite(issue.longitude) &&
    Number.isFinite(issue.latitude)
  );
}

export function getIssueMapExclusionCounts(
  issues: AdminIssue[],
): IssueMapExclusionCounts {
  return issues.reduce<IssueMapExclusionCounts>(
    (counts, issue) => {
      if (!hasFiniteCoordinates(issue)) {
        counts.missingCoordinates += 1;
      } else if (!isInsideBangladesh([issue.longitude, issue.latitude])) {
        counts.outsideBangladesh += 1;
      }
      return counts;
    },
    { missingCoordinates: 0, outsideBangladesh: 0 },
  );
}

export function createIssueMapData(issues: AdminIssue[]): FeatureCollection<Point, MapIssueProperties> {
  return {
    type: "FeatureCollection",
    features: issues
      .filter(
        (issue): issue is AdminIssue & { longitude: number; latitude: number } =>
          hasFiniteCoordinates(issue) &&
          isInsideBangladesh([issue.longitude, issue.latitude]),
      )
      .map((issue) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [issue.longitude, issue.latitude],
          },
          properties: {
            ...issue,
            severityScore: severityScore[issue.severity],
          },
        };
      }),
  };
}

export function createDistrictMapData(
  issues: AdminIssue[],
): FeatureCollection<Point, DistrictMapProperties> {
  const districts = new Map<string, {
    district: string;
    division: string;
    longitudeTotal: number;
    latitudeTotal: number;
    issueCount: number;
    criticalCount: number;
    severityScore: number;
  }>();

  for (const issue of issues) {
    if (
      issue.longitude == null ||
      issue.latitude == null ||
      issue.district === "Not specified"
    ) {
      continue;
    }

    const current = districts.get(issue.district) ?? {
      district: issue.district,
      division: issue.division,
      longitudeTotal: 0,
      latitudeTotal: 0,
      issueCount: 0,
      criticalCount: 0,
      severityScore: 0,
    };

    current.longitudeTotal += issue.longitude;
    current.latitudeTotal += issue.latitude;
    current.issueCount += 1;
    current.criticalCount += issue.severity === "Critical" ? 1 : 0;
    current.severityScore = Math.max(
      current.severityScore,
      severityScore[issue.severity],
    );
    districts.set(issue.district, current);
  }

  return {
    type: "FeatureCollection",
    features: Array.from(districts.values()).flatMap((district) => {
      const reportCentroid: [number, number] = [
        district.longitudeTotal / district.issueCount,
        district.latitudeTotal / district.issueCount,
      ];
      const coordinates = districtCenters[district.district] ?? reportCentroid;

      if (!isInsideBangladesh(coordinates)) return [];

      return [{
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates,
        },
        properties: {
          district: district.district,
          division: district.division,
          issueCount: district.issueCount,
          criticalCount: district.criticalCount,
          severityScore: district.severityScore,
        },
      }];
    }),
  };
}

export const allIssueMapData = createIssueMapData(adminIssues);
