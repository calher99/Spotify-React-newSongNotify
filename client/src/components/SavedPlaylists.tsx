import { Box, List } from "@mui/material";

import SavedPlaylistItem from "./SavedPlaylistItem";

interface PlaylistSaved {
  id: string;
  name: string;
  image: string;
  songs: string[];
  spotifyId: string;
  user: string;
}

function SavedPlaylists({ playlists }: { playlists: PlaylistSaved[] }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        overflow: "auto",
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <List component="nav" aria-label="playlist list" sx={{ width: "300px" }}>
        {playlists.map((playlist: PlaylistSaved) => {
          return <SavedPlaylistItem playlist={playlist} key={playlist.id} />;
        })}
      </List>
    </Box>
  );
}

export default SavedPlaylists;
