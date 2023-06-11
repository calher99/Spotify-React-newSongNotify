import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth-context";
import { Track } from "../types";
import { useSnackbar } from "notistack";

export const useHandleSavePlaylist = () => {
  const ctx = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (
    id: string,
    image: string,
    name: string,
    onAddPlaylist: (newPlaylist: any) => void
  ) => {
    setIsLoading(true);
    //1. Get the tracks
    let totalTracks: Track[] = [];
    try {
      let offset = 0;

      while (true) {
        try {
          let responseData = await axios(
            `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&offset=${offset}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + ctx.spotifyToken,
              },
            }
          );
          if (responseData.data.items && responseData.data.items.length > 0) {
            totalTracks = totalTracks.concat(responseData.data.items);
            offset += 50; // prepare for the next iteration
          } else {
            break; // no more playlists, stop the loop
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("Logical Error: ", error);
      // Handle the logical error
    }

    const trackIds = totalTracks.map((item: any) => item.track.id);

    const playlistObject = {
      id: id,
      image: image,
      name: name,
      songs: trackIds,
    };

    //2.send it to the db
    try {
      const responsePost = await axios({
        url: "http://localhost:4080/api/playlists/add",
        method: "POST",
        data: playlistObject,
        headers: {
          Authorization: "Bearer " + ctx.token,
        },
      });

      //3.Update the parent state with the new saved playlist
      onAddPlaylist(responsePost.data.playlist);
      setIsLoading(false);
      enqueueSnackbar("Playlist saved!", { variant: "success" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      setIsLoading(false);
    }
  };

  return { handleSave, isLoading };
};
