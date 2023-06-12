import {
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardHeader,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";

import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import DisplayPlaylists from "../components/DisplayPlaylists";
import { Playlist } from "../types";
import axios from "axios";
import SavedPlaylists from "../components/SavedPlaylists";
import { PlayerContext } from "../context/player-context";
import SearchResults from "../components/SearchResults";
import SearchAutocomplete from "../components/SearchAutocomplete";
import { useHandleSavePlaylist } from "../hooks/handle-save-playlist";
import { useNavigate } from "react-router-dom";

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

function Playlists() {
  const ctx = React.useContext(AuthContext);
  const playlistCtx = React.useContext(PlayerContext);
  const [savedPlaylists, setSavedPlaylists] = useState<PlaylistSaved[]>([]);

  const [searchResults, setSearchResults] = useState<Playlist[]>([]);

  let navigate = useNavigate();

  useEffect(() => {
    //If no token we redirect
    if (!ctx.token) navigate("/");

    //Load always all the user Spotify Playlists
    const getPlaylistsHandler = async () => {
      try {
        let offset = 0;
        let totalPlaylists: Playlist[] = [];
        while (true) {
          try {
            let responseData = await axios(
              `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + ctx.spotifyToken,
                },
              }
            );
            if (responseData.data.items && responseData.data.items.length > 0) {
              totalPlaylists = totalPlaylists.concat(responseData.data.items);
              offset += 50; // prepare for the next iteration
            } else {
              break; // no more playlists, stop the loop
            }
          } catch (error) {
            console.log(error);
            navigate("/");
          }
        }
        //Set ctx
        playlistCtx.setPlaylists(totalPlaylists);
        //Old code
        // setPlaylists(totalPlaylists);
        // setDisplayPlaylists(true);
      } catch (error) {
        console.error("Error in getPlaylistsHandler: ", error);
      }
    };

    // Get saved playlists for the user
    const getUserPlaylists = async () => {
      try {
        const responseData = await axios(
          `http://localhost:4080/api/playlists/${ctx.userId}`,
          {
            method: "GET",
          }
        );
        setSavedPlaylists(responseData.data.playlists);
      } catch (error) {
        console.log(error);
      }
    };

    if (ctx.spotifyToken) {
      getUserPlaylists();
      getPlaylistsHandler();
    }
  }, [ctx.spotifyToken]);

  const playlistSavedHandler = (newPlaylist: PlaylistSaved) => {
    setSavedPlaylists((prev: PlaylistSaved[] | []) => {
      return [...prev, newPlaylist];
    });
  };

  const playlistDeletedHandler = (id: string) => {
    setSavedPlaylists((prev: PlaylistSaved[] | []) => {
      return prev.filter((playlist) => playlist.id !== id);
    });
  };

  const playlistUpdateHandler = (playlistId: string, songs: string[]) => {
    setSavedPlaylists((prev: PlaylistSaved[] | []) => {
      return prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, ...songs] }
          : playlist
      );
    });
  };

  const submitSearchHandler = async (search: string, myPlaylist?: Playlist) => {
    if (myPlaylist) {
      return;
    } else {
      try {
        const responseData = await axios(
          `https://api.spotify.com/v1/search?q=${search}&type=playlist&limit=5&offset=0`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + ctx.spotifyToken,
            },
          }
        );

        setSearchResults(responseData.data.playlists.items);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Grid container spacing={15} sx={{ pt: 10, pb: 10 }}>
        <Grid
          item
          xs={12}
          md={4}
          lg={4}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Grid item>
            <Container
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "start",
                width: 300,
              }}
            >
              <SearchAutocomplete
                onSubmit={submitSearchHandler}
                options={(playlistCtx.userPlaylists as Playlist[]) || []}
                onAddPlaylist={playlistSavedHandler}
              />
              <ClickAwayListener onClickAway={() => setSearchResults([])}>
                <Box>
                  {searchResults && (
                    <DisplayPlaylists
                      playlists={searchResults as Playlist[]}
                      onAddPlaylist={playlistSavedHandler}
                      isDropdown={true}
                    />
                  )}
                </Box>
              </ClickAwayListener>
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8} lg={8} sx={{ mt: 2 }}>
          <Typography variant="h4">Your Saved Playlists</Typography>
          <SavedPlaylists
            playlists={savedPlaylists ?? []}
            onDelete={playlistDeletedHandler}
            onUpdate={playlistUpdateHandler}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Playlists;
