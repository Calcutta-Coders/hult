import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#fafafa",
        color: "text.primary",
        borderBottom: "0px solid #ccc",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Side: Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/icon.png" 
            alt="Penguin Logo"
            style={{ width: 60, height: 60 }}
          />
        
        </Box>

        {/* Center Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            flexGrow: 1,
          }}
        >
          <Button href="/" color="inherit" sx={{ textTransform: "none" }}>
            Home
          </Button>
          <Button href="/categories" color="inherit" sx={{ textTransform: "none" }}>
            Categories
          </Button>
          <Button href="/explore" color="inherit" sx={{ textTransform: "none" }}>
            Explore
          </Button>
        </Box>

        {/* Right Side: Settings Dropdown */}
        <Box>
          {isLoggedIn && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{     boxShadow: "none"
                }}
              >
                <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>Account Settings</MenuItem>
                <MenuItem sx = {{color:"red"}} onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
