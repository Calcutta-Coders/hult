import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const SetupPreferences: React.FC = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await axios.get("/api/v1/categories");
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategorySelection = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        "/api/v1/user",
        {
          user: {
            preferences: {
              categories: selectedCategories,
              notifications: {
                push: true, // Default notification preference
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.location.href = "/settings"; // Redirect after successful save
    } catch (error) {
      console.error("Save failed:", error);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          width: "50%",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "text.primary",
            textAlign: "center",
          }}
        >
          Select Categories
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            sx: { borderRadius: 2, height: 48 },
          }}
        />

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* Categories Grid */}
        <Grid container spacing={3}>
          {filteredCategories.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  backgroundColor: selectedCategories.includes(item.id)
                    ? "#1976d2"
                    : "#ffffff",
                  color: selectedCategories.includes(item.id)
                    ? "#ffffff"
                    : "#000000",
                  borderRadius: 3,
                  cursor: "pointer",
                  boxShadow: selectedCategories.includes(item.id)
                    ? "0px 4px 15px rgba(25, 118, 210, 0.5)"
                    : "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                }}
                onClick={() => handleCategorySelection(item.id)}
              >
                {selectedCategories.includes(item.id) && (
                  <CheckCircleIcon
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: "1.5rem",
                      color: "#ffffff",
                    }}
                  />
                )}
                <CardActionArea>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "150px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Submit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: 2, px: 4 }}
            disabled={selectedCategories.length === 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Preferences"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SetupPreferences;
