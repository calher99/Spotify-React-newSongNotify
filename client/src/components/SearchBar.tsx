import * as React from "react";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";

// Add the type for your new onSubmit prop
type SearchBarProps = {
  onSubmit: (value: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  // Create state for the input's value
  const [inputValue, setInputValue] = React.useState("");

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle form submission
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(inputValue);
    setInputValue("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit} // Add onSubmit handler here
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderRadius: 16,
        width: "100%",
        maxHeight: 50,
        backgroundColor: "primary.light",
        "&:hover": {
          backgroundColor: "primary.main.light",
          opacity: [0.9, 0.9, 0.9],
        },
      }}
    >
      <IconButton
        type="submit"
        sx={{ p: "10px", color: "black" }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        value={inputValue} // Bind the input's value to state
        onChange={handleInputChange} // Bind the onChange event to your handler
        sx={{ ml: 1, flex: 1, color: "black" }}
        placeholder="Search Playlist"
        inputProps={{ "aria-label": "search playlist" }}
      />
    </Box>
  );
};

export default SearchBar;
