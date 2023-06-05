import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
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

function SavedPlaylistItem({
  playlist,
  onDelete,
  onUpdate,
}: {
  playlist: PlaylistSaved;
  onDelete: (id: string) => void;
  onUpdate: (playlistId: string, songs: string[]) => void;
}) {
  const ctx = React.useContext(AuthContext);
  const playerCtx = React.useContext(PlayerContext);

  const [newTracks, setNewTracks] = useState<Track[]>([]);
  const [showTracks, setShowTracks] = useState<boolean>(false);

  const refreshPlaylistHandler = async (playlist: PlaylistSaved) => {
    try {
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

      //Show the new songs beneath
      if (newTracks) {
        setShowTracks(true);
      } else {
        //Shoudl show a modal or something
        console.log("nothing new since the last time!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeHandler = () => {
    setShowTracks(false);
    playerCtx.onClosePlayer();
  };

  const updateDbHandler = async () => {
    if (newTracks.length !== 0) {
      try {
        //API call for updating the playlist tracks
        let offset = 0;
        let totalTracks: Track[] = [];
        while (true) {
          try {
            let responseData = await axios(
              `https://api.spotify.com/v1/playlists/${playlist.spotifyId}/tracks?limit=50&offset=${offset}`,
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + ctx.spotifyToken,
                },
              }
            );
            if (responseData.data.items && responseData.data.items.length > 0) {
              totalTracks = totalTracks.concat(responseData.data.items);
              offset += 50; // prepare for the next iteration
            } else {
              break; // no more playlists, stop the loop
            }
          } catch (error) {
            console.log(error);
          }
        }
        const trackIds = totalTracks.map((item: any) => item.track.id);
        await axios({
          url: `http://localhost:4080/api/playlists/update/${playlist.id}`,
          method: "POST",
          data: trackIds,
          headers: {
            Authorization: "Bearer " + ctx.token,
          },
        });
        //Update playlist state
        onUpdate(playlist.id, trackIds);
        //TI: when refreshed until we dont log out the new tracks continue to appear
        // console.log(responseData);
        setNewTracks([]);
      } catch (error) {
        console.log(error);
      }
    }
    closeHandler();
  };

  const updated = new Date(playlist.updatedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };

  const deletePlaylistHandler = async () => {
    //TI Maybe add a modal to confirm that we want to deleete?
    try {
      const responseData = await axios({
        url: `http://localhost:4080/api/playlists/delete/${playlist.id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + ctx.token,
        },
      });
      //Update the saved playlists
      onDelete(playlist.id);
    } catch (error) {
      console.log(error);
    }
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

          <Tooltip
            placement="right"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title="Remove from saved playlists"
          >
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={deletePlaylistHandler}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

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
