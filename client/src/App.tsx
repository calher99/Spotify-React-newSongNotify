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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [spotiToken, setSpotiToken] = useState<string | null>(null);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const loginSpoti = useCallback(
    (refreshToken: string, accessToken: string) => {
      localStorage.setItem(
        "SpotifyUser",
        JSON.stringify({
          tokenSpoty: accessToken,
          refreshSpoti: refreshToken,
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
    const storedSpotiData = JSON.parse(
      localStorage.getItem("SpotifyUser") as string
    );
    // if (!refreshToken || !expiresIn) return;
    const refreshToken = async () => {
      const responseData = await sendRequest(
        "http://localhost:4080/api/spotify/refresh",
        "POST",
        JSON.stringify({ refreshToken: storedSpotiData.refreshSpoti }),
        { "Content-Type": "application/json" }
      );

      setSpotiToken(responseData.spotiAccessToken);
    };

    refreshToken();
    const interval = setInterval(async () => {
      console.log("Refresh token!!");
      //THIS IS RUNNING EVEN IF I HAVENT LOGGED IN
      //SHOULD ONLY RUN WHEN LOGGED IN
      // try {
      //   refreshToken();
      // } catch (error) {
      //   console.log(error);
      // }
      // }, (expiresIn - 60) * 1000);
    }, 100000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          userId: userId,
          token: token,
          spotifyToken: spotiToken,
          onLogin: login,
          onLogOut: logout,
          onSpotiAuth: loginSpoti,
        }}
      >
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
              <Route path="/artists" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
