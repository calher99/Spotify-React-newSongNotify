import React from "react";
import { Playlist } from "../types";

interface IAuthContext {
  onPlay: (uris: string[], index: number) => void;
  onPause: () => void;
  userPlaylists: Playlist[] | null;
  setPlaylists: (playlists: Playlist[]) => void;
}

export const PlayerContext = React.createContext<IAuthContext>({
  onPlay: (uris: string[], index: number) => {},
  onPause: () => {},
  userPlaylists: null,
  setPlaylists: (playlists: Playlist[]) => {},
});
