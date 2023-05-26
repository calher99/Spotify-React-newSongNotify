import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

interface PlaylistSaved {
  id: string;
  name: string;
  image: string;
  songs: string[];
  soptifyId: string;
  user: string;
}

function SavedPlaylists({ playlists }: { playlists: PlaylistSaved[] }) {
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
        {playlists.map((playlist: PlaylistSaved) => {
          return (
            <ListItem
              key={playlist.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => {
                    console.log("refresh");
                  }}
                >
                  <CachedIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar ${playlist.name}`}
                  src={
                    playlist.image ||
                    "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
                  }
                />
              </ListItemAvatar>
              <ListItemText primary={playlist.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default SavedPlaylists;
