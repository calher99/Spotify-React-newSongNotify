import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Avatar, Box, IconButton, ListItemAvatar } from "@mui/material";

import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { Playlist, PlaylistTrack } from "../types";

interface DisplayPlaylistsProps {
  playlists: Playlist[];
  onAddPlaylist: (newPlaylist: any) => void;
}

function DisplayPlaylists({ playlists, onAddPlaylist }: DisplayPlaylistsProps) {
  const ctx = React.useContext(AuthContext);

  const handleSave = async (
    id: string,
    image: string,
    name: string,
    tracks: PlaylistTrack[]
  ) => {
    //1. Get the tracks
    const responseData = await axios(
      `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + ctx.spotifyToken,
        },
      }
    );
    const trackIds = responseData.data.items.map((item: any) => item.track.id);

    const playlistObject = {
      id: id,
      image: image,
      name: name,
      songs: trackIds,
    };

    //2.send it to the db
    const responsePost = await axios({
      url: "http://localhost:4080/api/playlists/add",
      method: "POST",
      data: playlistObject,
      headers: {
        Authorization: "Bearer " + ctx.token,
      },
    });

    //3.Update the parent state with the new saved playlist
    onAddPlaylist(responsePost.data.playlist);
  };
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
            <ListItem
              key={playlist.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => {
                    handleSave(
                      playlist.id,
                      playlist.images?.[0]?.url,
                      playlist.name,
                      playlist.tracks
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
          );
        })}
      </List>
    </Box>
  );
}

export default DisplayPlaylists;
