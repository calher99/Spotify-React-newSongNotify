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
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userId, setUserId] = useState<string>("");
  const [displayPlaylists, setDisplayPlaylists] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const [savedPlaylists, setSavedPlaylists] = useState<PlaylistSaved[]>([]);

  const [searchResults, setSearchResults] = useState<Playlist[]>([]);

  useEffect(() => {
    //Load always all the user Spotify Playlists
    const getPlaylistsHandler = async () => {
      let offset = 0;
      let totalPlaylists: Playlist[] = [];
      while (true) {
        let responseData = await axios(
          `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + ctx.spotifyToken,
            },
          }
        );
        if (responseData.data.items.length > 0) {
          totalPlaylists = totalPlaylists.concat(responseData.data.items);
          offset += 50; // prepare for the next iteration
        } else {
          break; // no more playlists, stop the loop
        }
      }
      //Set ctx
      playlistCtx.setPlaylists(totalPlaylists);
      //Old code
      // setPlaylists(totalPlaylists);
      setDisplayPlaylists(true);
    };

    // Get saved playlists for the user
    const getUserPlaylists = async () => {
      const responseData = await axios(
        `http://localhost:4080/api/playlists/${ctx.userId}`,
        {
          method: "GET",
        }
      );
      setSavedPlaylists(responseData.data.playlists);
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

  const togglePlaylists = async () => {
    if (playlistCtx.userPlaylists) {
      setDisplayPlaylists((prev: boolean) => !prev);
    }
  };
  const submitSearchHandler = async (search: string) => {
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
          <Grid
            item
            // xs={12}
            // md={6}
            // lg={6}
            // sx={{ backgroundColor: (theme) => theme.palette.grey[900] }}
          >
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
              <SearchBar onSubmit={submitSearchHandler} />
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
          <Grid
            item

            // sx={{ backgroundColor: (theme) => theme.palette.grey[800] }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  {/* <Button onClick={getPlaylistsHandler}>
                    Get my Playlists
                  </Button> */}
                  <ToggleButton
                    value="check"
                    selected={displayPlaylists}
                    onChange={togglePlaylists}
                  >
                    Add from my playlists
                  </ToggleButton>
                </Box>
              </Box>
              <Box
                sx={{
                  maxWidth: 360,
                  height: 300,
                  overflow: "auto",
                }}
              >
                {displayPlaylists && (
                  <DisplayPlaylists
                    playlists={playlistCtx.userPlaylists as Playlist[]}
                    onAddPlaylist={playlistSavedHandler}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8} lg={8} sx={{ mt: 2 }}>
          <Typography variant="h4">Your Saved Playlists</Typography>
          <SavedPlaylists
            playlists={savedPlaylists ?? []}
            onDelete={playlistDeletedHandler}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Playlists;
