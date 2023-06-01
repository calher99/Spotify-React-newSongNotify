import { Box, Typography } from "@mui/material";
import React from "react";
import { Playlist } from "spotify-types";

function SearchResults({ results }: { results: Playlist[] }) {
  console.log(results);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 16,
        boxShadow: 1,
      }}
    >
      {results.map((result) => (
        <Box key={result.id}>
          <Typography>{result.name}</Typography>
          {/* <Typography>{result.followers.total}</Typography> */}
        </Box>
      ))}
    </Box>
  );
}

export default SearchResults;
