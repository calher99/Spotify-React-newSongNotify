import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Container, Tooltip } from "@mui/material";
import Fade from "@mui/material/Fade";

const ITEM_HEIGHT = 48;

interface LongMenuProps {
  options: { name: string; id: string }[];
  onOptionSelect?: (option: string) => void;
  selectedOption?: string;
}

export default function Dropdown({
  options,
  onOptionSelect = () => {},
  selectedOption,
}: LongMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (option: string) => {
    onOptionSelect(option);
    handleClose();
  };

  return (
    <Box>
      <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        title="Add to a playlist"
      >
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ ml: 1.5, mr: 1.5 }}
        >
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "auto",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.name === selectedOption}
            onClick={() => handleMenuItemClick(option.id)}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
