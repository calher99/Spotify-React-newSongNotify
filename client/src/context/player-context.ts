import React from "react";

interface IAuthContext {
  onPlay: (uri: string) => void;
  onPause: () => void;
}

export const PlayerContext = React.createContext<IAuthContext>({
  onPlay: (uri: string) => {},
  onPause: () => {},
});
