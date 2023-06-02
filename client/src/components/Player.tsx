import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface PlayerProps {
  accessToken: string;
  trackUris: string[];
  offset: number;
}

function Player({ accessToken, trackUris, offset }: PlayerProps) {
  const [play, setPlay] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setPlay(true);
    }
  }, [trackUris, isReady]);

  if (!accessToken) return null;
  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 10 }}>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state: any) => {
          if (!state.isPlaying) setPlay(false);
          if (state.type === "ready") setIsReady(true);
          if (state.type === "not_ready") setIsReady(false);
          if (state.status === "ERROR") console.log(state);
        }}
        offset={offset}
        play={play}
        uris={trackUris ? trackUris : []}
      />
    </Box>
  );
}

export default Player;
