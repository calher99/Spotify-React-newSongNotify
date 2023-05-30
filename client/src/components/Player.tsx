import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface PlayerProps {
  accessToken: string;
  trackUri: string;
}

function Player({ accessToken, trackUri }: PlayerProps) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 10 }}>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state: any) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
      />
    </Box>
  );
}

export default Player;
