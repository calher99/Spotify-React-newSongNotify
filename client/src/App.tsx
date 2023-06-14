import React, { useCallback, useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { AuthContext } from "./context/auth-context";
import SpotifyConnection from "./pages/SpotifyConnection";
import { useHttpClient } from "./hooks/http-hook";
import { PlayerContext } from "./context/player-context";
import Player from "./components/Player";
import Artists from "./pages/Artists";
import Podcasts from "./pages/Podcasts";
import { Playlist } from "./types";
import axios from "axios";
import { SnackbarProvider } from "notistack";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    grey: {
      900: "#141414", // darker color for level 1
      800: "#1f1f1f", // color for level 2
      700: "#424242", // color for level 3
      600: "#616161", // color for level 4
    },
  },
});

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tracks, setTracks] = useState<string[] | null>(null);
  const [indexToPlay, setIndexToPlay] = useState<number | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  const [spotiToken, setSpotiToken] = useState<string | null>(null);
  const [spotifyUserId, setSpotifyUserId] = useState<string | null>(null);

  const [userPlaylists, setUserPlaylists] = useState<Playlist[] | null>(null);

  const playHandler = useCallback((uris: string[], index: number) => {
    setIsPlaying(true);
    setTracks(uris);
    setIndexToPlay(index);
  }, []);

  const closePlayerHandler = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const loginSpoti = useCallback(
    (refreshToken: string, accessToken: string, id: string) => {
      setSpotifyUserId(id);
      localStorage.setItem(
        "SpotifyUser",
        JSON.stringify({
          tokenSpoty: accessToken,
          refreshSpoti: refreshToken,
          userIdSpoti: id,
        })
      );
    },
    []
  );

  const login = useCallback((userIdSent: string, tokenSent: string) => {
    setToken(tokenSent);
    setUserId(userIdSent);

    localStorage.setItem(
      "userDataSpotifyApp",
      JSON.stringify({
        userId: userIdSent,
        token: tokenSent,
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userDataSpotifyApp");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("userDataSpotifyApp") as string
    );
    //redirect to the spotify authentication!
    //Then spotify authentication redirects to signIn?¿
    //
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  useEffect(() => {
    //TI Do I need two useEffects?
    const storedSpotiData = JSON.parse(
      localStorage.getItem("SpotifyUser") as string
    );
    // if (!refreshToken || !expiresIn) return;
    const refreshToken = async () => {
      try {
        const responseData = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/api/spotify/refresh`,
          method: "POST",
          data: { refreshToken: storedSpotiData.refreshSpoti },
          headers: {
            "Content-Type": "application/json",
          },
        });

        setSpotiToken(responseData.data.spotiAccessToken);
      } catch (error) {
        console.log(error);
      }
    };

    refreshToken();
    let interval: any;
    if (token) {
      interval = setInterval(async () => {
        console.log("Refresh token!!");
        try {
          refreshToken();
        } catch (error) {
          console.log(error);
        }
        // }, (expiresIn - 60) * 1000);
      }, 50 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [token]);
  const setPlaylistsHandler = useCallback((playlists: Playlist[]) => {
    setUserPlaylists(playlists);
  }, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          spotifyUser: spotifyUserId,
          userId: userId,
          token: token,
          spotifyToken: spotiToken,
          onLogin: login,
          onLogOut: logout,
          onSpotiAuth: loginSpoti,
        }}
      >
        <PlayerContext.Provider
          value={{
            userPlaylists: userPlaylists,
            trackPlaying: currentTrackId,
            setTrackPlaying: setCurrentTrackId,
            setPlaylists: setPlaylistsHandler,
            onPlay: playHandler,
            onClosePlayer: closePlayerHandler,
          }}
        >
          <SnackbarProvider>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <BrowserRouter>
                {token && <NavBar />}
                <Routes>
                  {!token && <Route path="/" element={<SignIn />} />}
                  {token && <Route path="/" element={<Login />} />}
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route
                    path="/spotify-connection"
                    element={<SpotifyConnection />}
                  />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/podcasts" element={<Podcasts />} />
                </Routes>
                {isPlaying && (
                  <Player
                    accessToken={spotiToken as string}
                    trackUris={tracks as string[]}
                    offset={indexToPlay as number}
                  />
                )}
              </BrowserRouter>
            </ThemeProvider>
          </SnackbarProvider>
        </PlayerContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
