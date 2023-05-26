import { useEffect, useState } from "react";
import { useHttpClient } from "./http-hook";

export const useSpotifyAuth = (code: string) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState<number>();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getTokens = async () => {
      const responseData = await sendRequest(
        "http://localhost:4080/api/spotify/login",
        "POST",
        JSON.stringify({ code: code }),
        { "Content-Type": "application/json" }
      );
      setAccessToken(responseData.spotiAccessToken);
      setRefreshToken(responseData.spotiRefreshToken);
      setExpiresIn(responseData.spotiExpiresIn);
      // setExpiresIn(5);
    };

    try {
      getTokens();
    } catch (error) {
      console.log(error);
    }

    // window.history.pushState({}, null, "/");
  }, [code, sendRequest]);

  // useEffect(() => {
  //   if (!refreshToken || !expiresIn) return;
  //   const interval = setInterval(async () => {
  //     try {
  //       const responseData = await sendRequest(
  //         "http://localhost:4080/api/spotify/refresh",
  //         "POST",
  //         JSON.stringify({ refreshToken: refreshToken }),
  //         { "Content-Type": "application/json" }
  //       );
  //       setAccessToken(responseData.spotiAccessToken);
  //       setExpiresIn(responseData.spotiExpiresIn);
  //       // setExpiresIn(5);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, (expiresIn - 60) * 1000);

  //   return () => clearInterval(interval);
  // }, [refreshToken, expiresIn, sendRequest]);

  return { accessToken, refreshToken, expiresIn };
};
