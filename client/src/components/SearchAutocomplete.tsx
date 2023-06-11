import * as React from "react";

import {
  Autocomplete,
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { Playlist } from "../types";
import { useHandleSavePlaylist } from "../hooks/handle-save-playlist";

// Add the type for your new onSubmit prop
type SearchBarProps = {
  options?: Playlist[];
  onSubmit: (value: string, myPlaylist?: Playlist) => void;
  onAddPlaylist: (newPlaylist: any) => void;
};

const SearchAutocomplete: React.FC<SearchBarProps> = ({
  options,
  onSubmit,
  onAddPlaylist,
}) => {
  const { handleSave, isLoading } = useHandleSavePlaylist();
  const [inputValue, setInputValue] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState<Playlist | null>(
    null
  );

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    setSelectedOption(null); // Reset selected option on manual input
  };

  const handleOptionChange = (
    event: React.ChangeEvent<{}>,
    playlistSelected: Playlist | string | null
  ) => {
    if (playlistSelected && typeof playlistSelected !== "string") {
      //Submit the option selected
      const foundOption = options?.find(
        (option) => option.id === playlistSelected.id
      );
      handleSave(
        playlistSelected.id,
        playlistSelected.images?.[0]?.url,
        playlistSelected.name,
        onAddPlaylist
      );

      setSelectedOption(null);
      setInputValue("");
    }
  };

  const handleFormSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    // Here you can check if an option was selected
    if (selectedOption) {
      // Handle case where user selected an option
      onSubmit("", selectedOption);
    } else {
      // Handle case where user manually entered value
      onSubmit(inputValue);
    }

    setInputValue("");
    setSelectedOption(null);
  };

  return (
    <>
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box component="form" onSubmit={handleFormSubmit} sx={{}}>
        <Autocomplete
          id="search-playlist"
          freeSolo
          options={options || []}
          getOptionLabel={(option: Playlist | string) =>
            typeof option === "string" ? option : option.name
          }
          inputValue={inputValue}
          value={selectedOption} // control the value
          onInputChange={handleInputChange}
          onChange={handleOptionChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search a playlist"
              sx={{ borderRadius: 16 }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <ListItem
              {...props}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar ${option.name}`}
                  src={
                    option.images?.[0]?.url ||
                    "https://as1.ftcdn.net/jpg/03/77/20/86/1024W_F_377208629_UWr3LtC8xJqETdX3tsZ2vV8eRRniaZDv_NW1.jpg"
                  }
                  sx={{ width: 25, height: 25 }}
                />
              </ListItemAvatar>
              <ListItemText secondary={option.name} />
            </ListItem>
          )}
          sx={{ width: 250 }}
        />
      </Box>
    </>
  );
};

export default SearchAutocomplete;
