import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import React, { useState } from "react";
import { Track } from "../types";
import DisplayTracks from "./DisplayTracks";

interface PlaylistSaved {
  id: string;
  name: string;
  image: string;
  songs: string[];
  spotifyId: string;
  user: string;
}

function SavedPlaylistItem({ playlist }: { playlist: PlaylistSaved }) {
  const ctx = React.useContext(AuthContext);

  const [newTracks, setNewTracks] = useState<Track[]>([]);
  const [showTracks, setShowTracks] = useState<boolean>(false);

  const refreshPlaylistHandler = async (playlist: PlaylistSaved) => {
    //Get the current track on playlist
    const responseDataPlaylist = await axios(
      `https://api.spotify.com/v1/playlists/${playlist.spotifyId}/tracks?limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + ctx.spotifyToken,
        },
      }
    );
    //extract the new songs
    const extractedNewTrack = responseDataPlaylist.data.items.filter(
      (item: any) => !playlist.songs.includes(item.track.id)
    );
    setNewTracks(extractedNewTrack.map((track: any) => track.track));
    //Show the new songs beneatch
    if (newTracks) {
      setShowTracks(true);
    } else {
      //Shoudl show a modal or something
      console.log("nothing new since the last time!");
    }
  };
  const closeHandler = () => {
    setShowTracks(false);
  };
  return (
    <>
      <ListItem
        key={playlist.id}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={() => {
              refreshPlaylistHandler(playlist);
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
      {showTracks && (
        <DisplayTracks tracks={newTracks as Track[]} onClose={closeHandler} />
      )}
    </>
  );
}

export default SavedPlaylistItem;
