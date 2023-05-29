import React from "react";
import { Track } from "../types";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import { PlayerContext } from "../context/player-context";

function DisplayTracks({
  tracks,
  onClose,
}: {
  tracks: Track[];
  onClose: () => void;
}) {
  const ctx = React.useContext(PlayerContext);

  const playHandler = (uri: string) => {
    ctx.onPlay(uri);
  };
  return (
    //box with different background color
    //album picture , song artist and duration
    //Able to play the song
    //able to save it to a playlist
    //toggle button to hide the information
    <Box sx={{ width: "400px" }}>
      <IconButton
        onClick={() => {
          onClose();
          ctx.onPause();
        }}
      >
        <CloseIcon></CloseIcon>
      </IconButton>
      <List component="nav" aria-label="tracks list">
        {tracks.map((track: Track) => {
          return (
            <ListItem
              key={track.id}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Change this value to suit your theme
                },
              }}
            >
              <IconButton
                sx={{ ml: 1.5, mr: 1.5 }}
                onClick={() => {
                  playHandler(track.uri);
                }}
              >
                <PlayArrowIcon />
              </IconButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar ${track.name}`}
                  variant="square"
                  src={
                    track.album.images[0].url ||
                    "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={track.name}
                secondary={track.artists
                  .map((artist) => artist.name)
                  .join(" & ")}
              />
              <IconButton sx={{ ml: 1.5, mr: 1.5 }}>
                <AddCircleIcon />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default DisplayTracks;
