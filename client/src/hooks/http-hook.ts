import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  //used so that if we change pages while http request is done we dont try to update the state in a component
  //that is not in the screen anymore
  //useRef is used so that data does not reinitialize when the function is called again
  const activeHttpRequests = useRef<AbortController[]>([]);

  //useCallback to avoid infinite loop if the component where it is recreated calls it again
  const sendRequest = useCallback(
    async (
      url: string,
      method: string = "GET",
      body: string | null = null,
      headers = {}
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        //remove controller for the request that we did
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
        throw err; //when you throw an error all the app knows there is an error so that we can use a catch in
        //the component that uses the hook
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };
  //when the component unmounts the clean up function runs
  //It will close all the processes if we leave the compponent fast.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
