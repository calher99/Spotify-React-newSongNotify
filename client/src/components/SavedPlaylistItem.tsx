import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Fade from "@mui/material/Fade";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import React, { useState } from "react";
import { Track } from "../types";
import DisplayTracks from "./DisplayTracks";
import CloseIcon from "@mui/icons-material/Close";
import { PlayerContext } from "../context/player-context";

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

function SavedPlaylistItem({ playlist }: { playlist: PlaylistSaved }) {
  const ctx = React.useContext(AuthContext);
  const playerCtx = React.useContext(PlayerContext);

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
    playerCtx.onPause();
  };

  const updateDbHandler = async () => {
    //API call for updating the playlist tracks
    const songsToAdd = newTracks.map((track) => track.id);
    const responseData = await axios({
      url: `http://localhost:4080/api/playlists/update/${playlist.id}`,
      method: "POST",
      data: songsToAdd,
      headers: {
        Authorization: "Bearer " + ctx.token,
      },
    });
    //TI: when refreshed until we dont log out the new tracks continue to appear
    // console.log(responseData);
    setNewTracks([]);
    closeHandler();
  };
  const updated = new Date(playlist.updatedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  return (
    <>
      <ListItem key={playlist.id}>
        <ListItemAvatar>
          <Avatar
            alt={`Avatar ${playlist.name}`}
            src={
              playlist.image ||
              "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
            }
          />
        </ListItemAvatar>
        <ListItemText
          primary={playlist.name}
          secondary={`Your last check: ${updated.toLocaleString(
            "en-GB",
            options
          )}`}
          sx={{ width: "250px" }}
        />
        <Box sx={{ width: "100px", display: "flex", gap: 2 }}>
          {!showTracks && (
            <Tooltip
              placement="right"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Check for new songs"
            >
              <IconButton
                edge="end"
                aria-label="comments"
                onClick={() => {
                  refreshPlaylistHandler(playlist);
                }}
              >
                <CachedIcon />
              </IconButton>
            </Tooltip>
          )}

          {showTracks && (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Mark tracks as checked"
            >
              <IconButton onClick={updateDbHandler}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}

          {showTracks && (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Close"
            >
              <IconButton onClick={closeHandler}>
                <CloseIcon></CloseIcon>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ListItem>
      {showTracks && (
        <DisplayTracks tracks={newTracks as Track[]} onClose={closeHandler} />
      )}
    </>
  );
}

export default SavedPlaylistItem;
