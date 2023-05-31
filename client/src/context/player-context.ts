import React from "react";
import { Playlist } from "../types";

interface IAuthContext {
  onPlay: (uri: string) => void;
  onPause: () => void;
  userPlaylists: Playlist[] | null;
  setPlaylists: (playlists: Playlist[]) => void;
}

export const PlayerContext = React.createContext<IAuthContext>({
  onPlay: (uri: string) => {},
  onPause: () => {},
  userPlaylists: null,
  setPlaylists: (playlists: Playlist[]) => {},
});
