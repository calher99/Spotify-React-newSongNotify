import React, { useEffect, useState } from "react";
import { Playlist, Track } from "../types";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Fade from "@mui/material/Fade";
import { PlayerContext } from "../context/player-context";
import Dropdown from "./Dropdown";
import { AuthContext } from "../context/auth-context";
import axios from "axios";

function DisplayTrack({
  track,
  trackUris,
  currentIndex,
  onClose,
}: {
  track: Track;
  trackUris: string[];
  currentIndex: number;
  onClose: () => void;
}) {
  const userCtx = React.useContext(AuthContext);
  const playlistCtx = React.useContext(PlayerContext);

  const [playlistNames, setPlaylistNames] = useState<
    { name: string; id: string }[]
  >([]);

  useEffect(() => {
    const modifiablePlaylists =
      playlistCtx?.userPlaylists?.filter(
        // TO BE MODIFIED
        (playlist) => playlist.owner.id === userCtx.spotifyUser
      ) || [];
    setPlaylistNames(
      modifiablePlaylists.map((playlist) => {
        return { name: playlist.name, id: playlist.id };
      })
    );
  }, [playlistCtx?.userPlaylists, userCtx.spotifyUser]);

  const playHandler = () => {
    playlistCtx.onPlay(trackUris, currentIndex);
  };

  const addHandler = async (option: string) => {
    //Add the track to the selected playlist Id
    const url = `https://api.spotify.com/v1/playlists/${option}/tracks`;

    // Data for the request
    const data = {
      uris: [`spotify:track:${track.id}`], // You can add more track URIs here
      //   position: 0, // This will add the track at the start of the playlist
    };

    // Config for the request
    const config = {
      headers: {
        Authorization: `Bearer ${userCtx.spotifyToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.post(url, data, config);
    } catch (error) {
      console.log("Error adding track to playlist:", error);
    }
  };
  const playingColor = playlistCtx.trackPlaying === track.id ? "#1DB954" : "";

  return (
    <ListItem
      key={track.id}
      sx={{
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Change this value to suit your theme
        },
        color: playingColor,
      }}
    >
      <IconButton
        sx={{ ml: 1.5, mr: 1.5, color: playingColor }}
        onClick={() => {
          playHandler();
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
      <Box sx={{ flexGrow: 1 }}>
        <ListItemText
          primary={track.name}
          secondary={track.artists.map((artist) => artist.name).join(" & ")}
        />
      </Box>

      <Dropdown options={playlistNames} onOptionSelect={addHandler} />
    </ListItem>
  );
}

export default DisplayTrack;
