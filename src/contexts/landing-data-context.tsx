"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { reportApi, type PublicLandingData } from "@/lib/api/report-api";

const LandingDataContext = createContext<PublicLandingData | null>(null);

export function LandingDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PublicLandingData | null>(null);

  useEffect(() => {
    let active = true;

    const load = () => {
      void reportApi.publicLanding()
        .then((result) => {
          if (active) setData(result);
        })
        .catch(() => {
          if (active) setData(null);
        });
    };

    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return <LandingDataContext.Provider value={data}>{children}</LandingDataContext.Provider>;
}

export function useLandingData() {
  return useContext(LandingDataContext);
}
