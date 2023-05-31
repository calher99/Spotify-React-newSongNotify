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
  return (
    <Box sx={{ width: "400px" }}>
      <List component="nav" aria-label="tracks list">
        {tracks.map((track: Track) => {
          return (
            <DisplayTrack track={track} onClose={onClose} key={track.id} />
          );
        })}
      </List>
    </Box>
  );
}

export default DisplayTracks;
