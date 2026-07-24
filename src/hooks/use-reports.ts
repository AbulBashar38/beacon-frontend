"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/client";
import { mapApiReportToAdminIssue } from "@/lib/api/report-mappers";
import { reportApi, type ApiMeta, type ReportQuery } from "@/lib/api/report-api";
import type { AdminIssue } from "@/lib/admin-issues";

export function useReports(query: ReportQuery = { limit: 100 }, refreshIntervalMs = 0) {
  const [reports, setReports] = useState<AdminIssue[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({ page: 1, limit: query.limit ?? 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryKey = JSON.stringify(query);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportApi.list(JSON.parse(queryKey) as ReportQuery);
      setReports(result.reports.map(mapApiReportToAdminIssue));
      setMeta(result.meta);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load reports."));
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    let active = true;

    void Promise.resolve()
      .then(() => {
        if (active) {
          setLoading(true);
          setError(null);
        }
        return reportApi.list(JSON.parse(queryKey) as ReportQuery);
      })
      .then((result) => {
        if (active) {
          setReports(result.reports.map(mapApiReportToAdminIssue));
          setMeta(result.meta);
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(getApiErrorMessage(requestError, "Unable to load reports."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryKey]);

  useEffect(() => {
    if (!refreshIntervalMs) return;
    const interval = window.setInterval(() => {
      void reload();
    }, refreshIntervalMs);
    return () => window.clearInterval(interval);
  }, [refreshIntervalMs, reload]);

  return { reports, meta, loading, error, reload };
}
