import React, { useEffect } from "react";
import { useSpotifyAuth } from "../hooks/spotify-auth";
import { Link, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const code = new URLSearchParams(window.location.search).get("code");

function SpotifyConnection() {
  let navigate = useNavigate();
  // const ctx = React.useContext(AuthContext);
  const tokens = useSpotifyAuth(code as string);

  useEffect(() => {
    if (tokens.accessToken !== undefined) {
      localStorage.setItem(
        "SpotifyUser",
        JSON.stringify({
          tokenSpoty: tokens.accessToken,
          refreshSpoti: tokens.refreshToken,
        })
      );

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
