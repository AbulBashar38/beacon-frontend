"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/client";
import { reportApi, type ReportStats } from "@/lib/api/report-api";

export function useReportStats() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await reportApi.stats());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load dashboard analytics."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void reportApi.stats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getApiErrorMessage(requestError, "Unable to load dashboard analytics."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { stats, loading, error, reload };
}
