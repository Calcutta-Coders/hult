import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email?: string | null;
  bio?: string;
}

const SettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: null,
    bio: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/v1/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData({
          name: data.name || "",
          email: data.email || null,
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user settings");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/user", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: {
            ...userData
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(", ") || "Failed to save settings");
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save settings");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/user", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Account deletion failed");

      localStorage.removeItem("token");
      navigate("/login");
      alert("Account deleted successfully");
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Failed to delete account");
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} onLogout={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }} />

      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Account Settings
        </Typography>

        {/* Profile Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userData.email || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={3}
                value={userData.bio || ""}
                onChange={handleInputChange}
                helperText="Tell us about yourself"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Danger Zone */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: "error.main" }}>
            Danger Zone
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will permanently delete your account and all associated data
          </Typography>
        </Box>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSave}
            size="large"
            sx={{ px: 4, textTransform: "none" }}
          >
            Save Changes
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to permanently delete your account? This action:
            </Typography>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>Will remove all your data</li>
              <li>Cannot be undone</li>
              <li>Will delete all your content</li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteAccount}
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default SettingsPage;