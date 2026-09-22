import { useEffect, useState } from "react";
// Raw CSV avoids gviz header and column-type inference.
const SHEET_IDS: Record<string, string> = {
  People: "0",
  Alumni: "825492908",
  News: "874971636",
};
const SHEET_EXPORT =
  "https://docs.google.com/spreadsheets/d/1Ji6d41RBSASJ6CPgB0OV_-XoevKH5qxCY_Xt_5u2tbA/export?format=csv&gid=";
const REFRESH_MS = 30_000;
export function useSheet<T>(
  sheet: string,
  initial: T,
  merge: (current: T, csv: string) => T,
): T {
  const [data, setData] = useState(initial);
  useEffect(() => {
    let stopped = false;
    let inFlight = false;
    let current = initial;
    let controller: AbortController | undefined;
    const refresh = async () => {
      if (stopped || inFlight || document.hidden) return;
      inFlight = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 15_000);
      try {
        const response = await fetch(
          `${SHEET_EXPORT}${SHEET_IDS[sheet]}&_=${Date.now()}`,
          {
            signal: controller.signal,
            cache: "no-store",
            credentials: "omit",
          },
        );
        if (!response.ok) throw new Error(`Sheet HTTP ${response.status}`);
        const csv = await response.text();
        if (/^\s*</.test(csv))
          throw new Error("Sheet requires public read access");
        const next = merge(current, csv);
        if (!stopped && JSON.stringify(next) !== JSON.stringify(current)) {
          current = next;
          setData(current);
        }
      } catch (error) {
        if (!stopped)
          console.warn(
            `${sheet} refresh failed; keeping the last available data.`,
            error,
          );
      } finally {
        window.clearTimeout(timeout);
        inFlight = false;
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_MS);
    const resume = () => void refresh();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => {
      stopped = true;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
    };
  }, [sheet, initial, merge]);
  return data;
}
