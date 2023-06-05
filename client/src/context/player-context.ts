import React from "react";
import { Playlist } from "../types";

interface IAuthContext {
  onPlay: (uris: string[], index: number) => void;
  onClosePlayer: () => void;
  userPlaylists: Playlist[] | null;
  setPlaylists: (playlists: Playlist[]) => void;
  trackPlaying: string | null;
  setTrackPlaying: (id: string) => void;
}

export const PlayerContext = React.createContext<IAuthContext>({
  onPlay: (uris: string[], index: number) => {},
  onClosePlayer: () => {},
  userPlaylists: null,
  setPlaylists: (playlists: Playlist[]) => {},
  trackPlaying: null,
  setTrackPlaying: (id: string) => {},
});
