import {
  Avatar,
  Backdrop,
  CircularProgress,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Playlist } from "../types";

import { useHandleSavePlaylist } from "../hooks/handle-save-playlist";
import { useState } from "react";

interface DisplayPlaylistProps {
  playlist: Playlist;
  onAddPlaylist: (newPlaylist: any) => void;
  isDropdown?: boolean;
}

function DisplayPlaylist({
  playlist,
  onAddPlaylist,
  isDropdown = false,
}: DisplayPlaylistProps) {
  const { handleSave, errorMessage, isLoading, clearError } =
    useHandleSavePlaylist();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  return (
    <>
      {isDropdown && (
        <ListItem
          key={playlist.id}
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={() => {
            handleSave(
              playlist.id,
              playlist.images?.[0]?.url,
              playlist.name,
              onAddPlaylist
            );
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt={`Avatar ${playlist.name}`}
              src={
                playlist.images?.[0]?.url ||
                "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
              }
              // For ChatGPT Only if isDropdown=== true
              sx={{ width: 25, height: 25 }}
            />
          </ListItemAvatar>
          <ListItemText secondary={playlist.name} />
        </ListItem>
      )}
      {!isDropdown && (
        <ListItem
          key={playlist.id}
          secondaryAction={
            // https://www.youtube.com/watch?v=KTRFoouGzvY&t=128s&ab_channel=CodeLikePro
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => {
                handleSave(
                  playlist.id,
                  playlist.images?.[0]?.url,
                  playlist.name,
                  onAddPlaylist
                );
                setOpenSnackbar(true);
                console.log(errorMessage);
              }}
            >
              <AddCircleIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar
              alt={`Avatar ${playlist.name}`}
              src={
                playlist.images?.[0]?.url ||
                "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
              }
            />
          </ListItemAvatar>
          <ListItemText primary={playlist.name} />
        </ListItem>
      )}
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        message="Hello"
        // action={action}
      /> */}
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {errorMessage && (
        <div>
          <p>An error occurred: {errorMessage.message}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default DisplayPlaylist;
