/**
 * src/hooks/useSupportFeed.js
 *
 * Fetches 3 random inspirational quotes from dummyjson.com/quotes.
 * The API has 1,454 quotes and open CORS — no key required.
 *
 * Returns:
 *   quotes    — array of { id, quote, author }
 *   loading   — true while fetching
 *   error     — error message string or null
 *   refresh() — call to fetch a new random set
 */

import { useState, useEffect, useCallback } from "react";

const TOTAL_QUOTES = 1454;
const BATCH_SIZE   = 3;
const API_BASE     = "https://dummyjson.com/quotes";

/** Pick a random skip value so each refresh pulls a different set. */
const randomSkip = () =>
  Math.floor(Math.random() * (TOTAL_QUOTES - BATCH_SIZE));

const useSupportFeed = () => {
  const [quotes,  setQuotes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  // Incrementing this triggers a re-fetch via the useEffect dependency
  const [fetchKey, setFetchKey] = useState(0);

  const refresh = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;   // prevent state updates after unmount
    setLoading(true);
    setError(null);

    const skip = randomSkip();
    const url  = `${API_BASE}?limit=${BATCH_SIZE}&skip=${skip}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ quotes: data }) => {
        if (!cancelled) setQuotes(data);
      })
      .catch((err) => {
        if (!cancelled) setError("Could not load quotes. Check your connection.");
        console.error("useSupportFeed fetch error:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [fetchKey]);

  return { quotes, loading, error, refresh };
};

export default useSupportFeed;
