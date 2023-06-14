import {
  Avatar,
  Badge,
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import React, { useEffect, useState } from "react";
import { Track } from "../types";
import DisplayTracks from "./DisplayTracks";
import CloseIcon from "@mui/icons-material/Close";
import { PlayerContext } from "../context/player-context";
import MenuButtons from "./MenuButtons";

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
      // if (newTracks.length > 0) {
      //   setShowTracks(true);
      // } else {
      //   //Shoudl show a modal or something
      //   console.log("nothing new since the last time!");
      // }
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
          url: `${process.env.REACT_APP_BACKEND_URL}/api/playlists/update/${playlist.id}`,
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
      await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/api/playlists/delete/${playlist.id}`,
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

  useEffect(() => {
    refreshPlaylistHandler(playlist);
  }, [playlist]);
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
              placement="top"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Show"
            >
              {/* FOR CHAT GPT I want the badge to have this color: #1DB954 but ot does not let me */}
              <Badge badgeContent={newTracks.length} color="success">
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => {
                    if (newTracks.length > 0) {
                      setShowTracks(true);
                    }

                    // refreshPlaylistHandler(playlist);
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Badge>
            </Tooltip>
          )}
          {showTracks && (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Hide"
              placement="top"
            >
              <IconButton onClick={closeHandler}>
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
          )}
          {showTracks && (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              title="Songs checked"
              placement="top"
            >
              <IconButton onClick={updateDbHandler}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}

          <MenuButtons
            onDelete={deletePlaylistHandler}
            onRefresh={() => refreshPlaylistHandler(playlist)}
          />
        </Box>
      </ListItem>
      <Collapse in={showTracks} timeout={500}>
        <DisplayTracks tracks={newTracks as Track[]} onClose={closeHandler} />
      </Collapse>
      {/* {showTracks && (
        <DisplayTracks tracks={newTracks as Track[]} onClose={closeHandler} />
      )} */}
    </>
  );
}

export default SavedPlaylistItem;
