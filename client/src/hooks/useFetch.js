import { useState, useEffect } from "react";
import API from "../services/api";

function useFetch(url) {
  const [data, setData] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(url);

        setData(response.data);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
}

export default useFetch;