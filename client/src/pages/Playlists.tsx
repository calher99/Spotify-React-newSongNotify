import {
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardHeader,
  Typography,
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
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userId, setUserId] = useState<string>("");
  const [displayPlaylists, setDisplayPlaylists] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const [savedPlaylists, setSavedPlaylists] = useState<PlaylistSaved[]>([]);

  //get user info
  useEffect(() => {
    // TI: Get by user playlists to avoid this call
    const getUser = async () => {
      const responseData = await sendRequest(
        "http://localhost:4080/api/spotify/auth-user",
        "POST",
        JSON.stringify({ accessToken: ctx.spotifyToken }),
        { "Content-Type": "application/json" }
      );
      setUserId(responseData.data.body.id);
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
      getUser();
      getUserPlaylists();
    }
  }, []);

  const playlistSavedHandler = (newPlaylist: PlaylistSaved) => {
    setSavedPlaylists((prev: PlaylistSaved[] | []) => {
      return [...prev, newPlaylist];
    });
  };

  const getPlaylistsHandler = async () => {
    const responseData = await sendRequest(
      "http://localhost:4080/api/spotify/get-playlists",
      "POST",
      JSON.stringify({ accessToken: ctx.spotifyToken, userId: userId }),
      { "Content-Type": "application/json" }
    );
    setPlaylists(responseData.data.body.items);
    setDisplayPlaylists(true);
  };
  const togglePlaylists = async () => {
    if (playlists) {
      setDisplayPlaylists((prev: boolean) => !prev);
    }
  };
  const submitSearchHandler = async (search: string) => {
    console.log(search);
  };
  return (
    <>
      <Grid container spacing={2} sx={{ pt: 10, pb: 10 }}>
        <Typography
          variant="h6"
          sx={{ mt: 4, textAlign: "center", width: "100%" }}
        >
          Save a playlist and get notified when a song is added!!
        </Typography>
        <Grid container sx={{ display: "flex" }}>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sx={{ backgroundColor: (theme) => theme.palette.grey[900] }}
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
                  <Button onClick={getPlaylistsHandler}>
                    Get my Playlists
                  </Button>
                  <ToggleButton
                    value="check"
                    selected={displayPlaylists}
                    onChange={togglePlaylists}
                  >
                    Toggle Playlists
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
                    playlists={playlists as Playlist[]}
                    onAddPlaylist={playlistSavedHandler}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            sx={{ backgroundColor: (theme) => theme.palette.grey[900] }}
          >
            <Container
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                height: 200,
              }}
            >
              <SearchBar onSubmit={submitSearchHandler} />
            </Container>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="h4">Your Saved Playlists</Typography>
          <SavedPlaylists playlists={savedPlaylists ?? []} />
        </Grid>
      </Grid>
    </>
  );
}

export default Playlists;
