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
  const ctx = React.useContext(AuthContext);
  const handleSave = async (
    id: string,
    image: string,
    name: string,
    tracks: PlaylistTrack[]
  ) => {
    //1. Get the tracks
    let offset = 0;
    let totalTracks: Track[] = [];

    while (true) {
      let responseData = await axios(
        `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + ctx.spotifyToken,
          },
        }
      );
      if (responseData.data.items.length > 0) {
        totalTracks = totalTracks.concat(responseData.data.items);
        offset += 50; // prepare for the next iteration
      } else {
        break; // no more playlists, stop the loop
      }
    }

    const trackIds = totalTracks.map((item: any) => item.track.id);

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
              playlist.tracks
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
      )}
      <Divider />
    </>
  );
}

export default DisplayPlaylist;
