import axios from "axios";
import { useEffect, useState } from "react";

export function useGetAxios<T = unknown | undefined>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    axios.get(url)
      .then(response => response.data.json())
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

  return { data, error, isFetching };
}
