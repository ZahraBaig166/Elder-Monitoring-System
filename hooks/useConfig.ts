import { useState, useEffect } from "react";

interface ConfigResponse {
  apiBaseUrl: string;
}

const useConfig = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(""); // Ensure type is string
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`http://10.46.42.129:4000/config`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ConfigResponse = await response.json();
        setApiBaseUrl(data.apiBaseUrl); // Now TypeScript knows data.apiBaseUrl is a string
        setLoading(false);
      } catch (err) {
        setError(err as Error); // Type assertion for error
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { apiBaseUrl, loading, error };
};

export default useConfig;
