import React from "react";
import List from "@mui/material/List";

import { Box } from "@mui/material";

import { Playlist } from "../types";
import DisplayPlaylist from "./DisplayPlaylist";

interface DisplayPlaylistsProps {
  playlists: Playlist[];
  onAddPlaylist: (newPlaylist: any) => void;
}

function DisplayPlaylists({ playlists, onAddPlaylist }: DisplayPlaylistsProps) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        height: 300,
        overflow: "auto",
        bgcolor: "background.paper",
      }}
    >
      <List component="nav" aria-label="playlist list">
        {playlists.map((playlist: Playlist) => {
          return (
            <DisplayPlaylist
              playlist={playlist}
              onAddPlaylist={onAddPlaylist}
              key={playlist.id}
            />
          );
        })}
      </List>
    </Box>
  );
}

export default DisplayPlaylists;
