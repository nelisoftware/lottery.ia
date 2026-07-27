import { useEffect, useState } from "react";

/**
 * @example await db.get<City>(apiAddress('cities'));
 *
 * @param string url
 * @returns data
 */
export function useFetchGet<T = unknown>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          throw json;
        }

        setData(json);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [url]);

  return { data, isFetching, error };
}
