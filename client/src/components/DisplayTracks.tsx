import React from "react";
import { Track } from "../types";
import { Box, List } from "@mui/material";

import DisplayTrack from "./DisplayTrack";

function DisplayTracks({
  tracks,
  onClose,
}: {
  tracks: Track[];
  onClose: () => void;
}) {
  const trackUris = tracks.map((track) => track.uri);
  return (
    <Box sx={{ width: "400px" }}>
      <List component="nav" aria-label="tracks list">
        {tracks.map((track: Track, index: number) => {
          return (
            <DisplayTrack
              track={track}
              trackUris={trackUris}
              currentIndex={index}
              onClose={onClose}
              key={track.id}
            />
          );
        })}
      </List>
    </Box>
  );
}

export default DisplayTracks;
