import React, { useEffect } from "react";
import { useSpotifyAuth } from "../hooks/spotify-auth";
import { Link, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/auth-context";

const code = new URLSearchParams(window.location.search).get("code");

function SpotifyConnection() {
  let navigate = useNavigate();
  const ctx = React.useContext(AuthContext);
  const tokens = useSpotifyAuth(code as string);

  useEffect(() => {
    // if (tokens.accessToken !== undefined) {
    //   localStorage.setItem(
    //     "SpotifyUser",
    //     JSON.stringify({
    //       tokenSpoty: tokens.accessToken,
    //       refreshSpoti: tokens.refreshToken,
    //     })
    //   );
    // }
    const getUserData = async () => {
      try {
        const responseData = await axios({
          url: "https://api.spotify.com/v1/me",
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokens.accessToken,
          },
        });
        if (
          tokens.accessToken !== undefined &&
          tokens.refreshToken !== undefined
        ) {
          ctx.onSpotiAuth(
            tokens.refreshToken,
            tokens.accessToken,
            responseData.data.id
          );
        }
        //
      } catch (error) {
        console.log(error);
      }
    };
    if (tokens.accessToken !== undefined && tokens.refreshToken !== undefined) {
      // ctx.onSpotiAuth(tokens.refreshToken, tokens.accessToken);
      getUserData();
      navigate("/playlists");
    }
  }, [tokens.accessToken, tokens.refreshToken, navigate]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 5,
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#1DB954" }} />
        <Typography>Loading Spotify Data</Typography>
      </Box>
    </>
  );
}

export default SpotifyConnection;
