import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React from "react";
import { Playlist, PlaylistTrack } from "../types";
import axios from "axios";
import { AuthContext } from "../context/auth-context";

interface DisplayPlaylistProps {
  playlist: Playlist;
  onAddPlaylist: (newPlaylist: any) => void;
}

function DisplayPlaylist({ playlist, onAddPlaylist }: DisplayPlaylistProps) {
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
}

export default DisplayPlaylist;
