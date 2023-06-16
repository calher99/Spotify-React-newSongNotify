import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function NavBar() {
  let navigate = useNavigate();
  const ctx = React.useContext(AuthContext);
  const handleLogOut = () => {
    ctx.onLogOut();
    navigate("/sign-in");
  };

  const hovered = {
    "&:hover": {
      backgroundColor: "primary",
    },
    cursor: "pointer",
  };
  return (
    <Box
      sx={{ flexGrow: 1, position: "fixed", top: 0, width: "100%", zIndex: 10 }}
    >
      <AppBar position="static">
        <Toolbar sx={{ display: "flex" }}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Box sx={{ display: "flex", gap: 5, flex: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={hovered}
              onClick={() => {
                navigate("/playlists");
              }}
            >
              Playlists
            </Typography>
            {/* <Button component={NavLink} to="/sign-in">
              Sign In
            </Button> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/artists");
              }}
            >
              Artists
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/podcasts");
              }}
            >
              Podcasts
            </Typography>
          </Box>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleLogOut}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
