import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";
import { Playlist, PlaylistTrack, Track } from "../types";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { useHandleSavePlaylist } from "../hooks/handle-save-playlist";

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
  const handleSave = useHandleSavePlaylist();
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
      {/* <Divider /> */}
    </>
  );
}

export default DisplayPlaylist;
