import { useEffect, useState } from "react";
import { useHttpClient } from "./http-hook";
import axios from "axios";

export const useSpotifyAuth = (code: string) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState<number>();

  useEffect(() => {
    const getTokens = async () => {
      try {
        const responseData = await axios({
          url: "http://localhost:4080/api/spotify/login",
          method: "POST",
          data: { code: code },
          headers: {
            "Content-Type": "application/json",
          },
        });

        setAccessToken(responseData.data.spotiAccessToken);
        setRefreshToken(responseData.data.spotiRefreshToken);
        setExpiresIn(responseData.data.spotiExpiresIn);
        // setExpiresIn(5);
      } catch (error) {
        console.log(error);
      }
    };

    getTokens();
  }, [code]);

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
