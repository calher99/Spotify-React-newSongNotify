import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { PlayerContext } from "../context/player-context";

interface PlayerProps {
  accessToken: string;
  trackUris: string[];
  offset: number;
}

function Player({ accessToken, trackUris, offset }: PlayerProps) {
  const [play, setPlay] = useState(false);
  // const [isReady, setIsReady] = useState(false);
  const playerCtx = React.useContext(PlayerContext);

  useEffect(() => {
    setPlay(true);
  }, [trackUris]);

  if (!accessToken) return null;
  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 10 }}>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state: any) => {
          // if (!state.isPlaying) {
          //   console.log("Change to pause the play button in DisplayTrack");
          // }

          if (state.track?.uri) {
            playerCtx.setTrackPlaying(state.track.id);
          }
        }}
        offset={offset}
        play={play}
        // uris={trackUris ? trackUris : []}
        uris={trackUris}
      />
    </Box>
  );
}

export default Player;
