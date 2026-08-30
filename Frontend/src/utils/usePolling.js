import { useEffect, useState, useCallback, useRef } from "react";

// Calls fetchFn immediately, then every intervalMs. Returns { data, loading, error, refetch }.
// refetch() lets a caller force an immediate re-fetch (e.g. right after an action
// like resolving an event) instead of waiting for the next scheduled poll.
export function usePolling(fetchFn, intervalMs = 5000, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const run = useCallback(async () => {
    try {
      const result = await fetchFnRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run();
    const interval = setInterval(run, intervalMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: run };
}