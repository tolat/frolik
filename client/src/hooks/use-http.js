import { useCallback, useState } from "react";
import httpFetch from "../utils/http-fetch";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, handleResponse) => {
    setIsLoading(true);
    setError(null);

    const handleError = (err) => {
      setError(err.message || "Something Went Wrong!");
    };

    await httpFetch(requestConfig, handleResponse, handleError);

    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
