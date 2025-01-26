import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const SetupPreferences: React.FC = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get("/api/v1/categories"),
          axios.get("/api/v1/tags"),
        ]);
        setCategories(categoriesRes.data);
        setTags(tagsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch categories or tags. Please try again later.");
      }
    };
    fetchData();
  }, []);

  // Handle category/tag selection
  const handleSelection = (id: number, type: "category" | "tag") => {
    const selected = type === "category" ? selectedCategories : selectedTags;
    const setSelected = type === "category" ? setSelectedCategories : setSelectedTags;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter items based on search query
  const filteredItems =
    currentStep === 1
      ? categories.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tags.filter((item) =>
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
              tags: selectedTags,
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

  // Check if an item is selected
  const isSelected = (id: number) =>
    currentStep === 1
      ? selectedCategories.includes(id)
      : selectedTags.includes(id);

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
          {currentStep === 1 ? "Select Categories" : "Choose Favorite Tags"}
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${currentStep === 1 ? "categories" : "tags"}...`}
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

        {/* Categories Grid (Step 1) */}
        {currentStep === 1 && (
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    backgroundColor: isSelected(item.id) ? "#1976d2" : "#ffffff",
                    color: isSelected(item.id) ? "#ffffff" : "#000000",
                    borderRadius: 3,
                    cursor: "pointer",
                    boxShadow: isSelected(item.id)
                      ? "0px 4px 15px rgba(25, 118, 210, 0.5)"
                      : "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    position: "relative",
                  }}
                  onClick={() => handleSelection(item.id, "category")}
                >
                  {isSelected(item.id) && (
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
        )}

        {/* Tags Grid (Step 2) */}
        {currentStep === 2 && (
          <Grid container spacing={1} sx={{ mb: 4 }}>
            {filteredItems.map((item) => (
              <Grid item key={item.id} xs="auto">
                <Chip
                  label={item.name}
                  onClick={() => handleSelection(item.id, "tag")}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 4,
                    fontSize: "1rem",
                    bgcolor: isSelected(item.id) ? "primary.main" : "#ffffff",
                    color: isSelected(item.id) ? "common.white" : "text.primary",
                    "&:hover": {
                      bgcolor: isSelected(item.id) ? "primary.dark" : "#f5f5f5",
                    },
                    transition: "all 0.2s ease",
                    border: isSelected(item.id) ? "none" : "1px solid #e0e0e0",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setCurrentStep(1)}
            disabled={currentStep === 1}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Back
          </Button>

          {currentStep === 1 ? (
            <Button
              variant="contained"
              onClick={() => setCurrentStep(2)}
              sx={{ borderRadius: 2, px: 4 }}
              disabled={selectedCategories.length === 0}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ borderRadius: 2, px: 4 }}
              disabled={selectedTags.length === 0 || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Finish"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SetupPreferences;