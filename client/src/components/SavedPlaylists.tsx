import { Box, List } from "@mui/material";

import SavedPlaylistItem from "./SavedPlaylistItem";

interface PlaylistSaved {
  id: string;
  name: string;
  image: string;
  songs: string[];
  spotifyId: string;
  user: string;
  updatedAt: Date;
  createdAt: Date;
}

function SavedPlaylists({
  playlists,
  onDelete,
  onUpdate,
}: {
  playlists: PlaylistSaved[];
  onDelete: (id: string) => void;
  onUpdate: (playlistId: string, songs: string[]) => void;
}) {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "auto",
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <List component="nav" aria-label="playlist list" sx={{}}>
        {playlists.map((playlist: PlaylistSaved) => {
          return (
            <SavedPlaylistItem
              playlist={playlist}
              key={playlist.id}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          );
        })}
      </List>
    </Box>
  );
}

export default SavedPlaylists;
