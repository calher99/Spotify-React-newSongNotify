import React from "react";

interface IAuthContext {
  userId: string | null;
  token: string | null;
  spotifyToken: string | null;
  spotifyUser: string | null;
  onLogin: (userIdSent: string, tokenSent: string) => void;
  onLogOut: () => void;
  onSpotiAuth: (refreshToken: string, accessToken: string, id: string) => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  userId: null,
  token: null,
  spotifyToken: null,
  spotifyUser: null,
  onLogin: () => {},
  onLogOut: () => {},
  onSpotiAuth: () => {},
});
