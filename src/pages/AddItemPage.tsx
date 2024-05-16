import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../serivces/Configuration";
import { Category } from "./../Interfaces/Options";
import { useNavigate } from "react-router-dom";
interface PhotoData {
  url: string;
  alterText: string;
}
function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemColor, setItemColor] = useState("");
  const [itemAmount, setItemAmount] = useState(0);
  const [itemGender, setItemGender] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const genders = ["Man", "Women", "Unisex"];
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingSnackbar, setLoadingSnackbar] = useState(false);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        /*const response = await axios.get<Category[]>(
          'https://localhost:7026/api/Category/GetAll',
        );*/
        const response = await axios.get<Category[]>(
          API_URL + "/Category/GetAll"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Run once on component mount

  const handleSubmit = async () => {
    if (
      !itemName ||
      !itemDescription ||
      itemPrice <= 0 ||
      itemAmount <= 0 ||
      !itemColor ||
      !itemGender ||
      !itemCategoryId ||
      !imageFiles
    ) {
      setSnackbarMessage("Please fill in all required fields.");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoadingSnackbar(true);

      // Prepare the request payload for adding a new product
      const newItem = {
        name: itemName,
        price: itemPrice,
        color: itemColor,
        amount: itemAmount,
        description: itemDescription,
        gender: itemGender,
        categoryId: itemCategoryId,
        photosReq: [] as PhotoData[],
      };

      // Convert and add photos to the request payload
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles.item(i);
        if (file) {
          const photoData: PhotoData = {
            url: await convertFileToBase64(file),
            alterText: `Product Photo ${i + 1}`,
          };
          newItem.photosReq.push(photoData);
        }
      }

      // Make a POST request to add a new product
      const response = await axios.post(
        "https://localhost:7026/api/Product/AddNewItem",
        newItem
      );

      // Handle the response as needed
      console.log("New item added:", response.data);

      setSnackbarMessage("Item and photos added successfully.");
      setOpenSnackbar(true);
      navigate(`/Toys/${response.data}`);
    } catch (error) {
      setSnackbarMessage("Unable to add item or photos");
      setOpenSnackbar(true);
      console.error("Error adding item:", error);
    } finally {
      setLoadingSnackbar(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject("Failed to convert file to base64");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const divStyle = {
    marginBottom: "16px",
    width: "100%",
  };

  const textFieldStyle = {
    width: "300px",
    marginBottom: "16px",
  };

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Add New Item
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Item Description"
                    multiline
                    rows={4}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Item Price"
                    type="number"
                    value={itemPrice}
                    onChange={(e) =>
                      setItemPrice(parseFloat(e.target.value) || 0)
                    }
                    fullWidth
                    variant="outlined"
                    required
                    inputProps={{
                      step: 0.01,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Item Color"
                    value={itemColor}
                    onChange={(e) => setItemColor(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Item Amount"
                    type="number"
                    value={itemAmount}
                    onChange={(e) =>
                      setItemAmount(parseInt(e.target.value) || 0)
                    }
                    fullWidth
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="item-gender-label">Item Gender</InputLabel>
                    <Select
                      labelId="item-gender-label"
                      id="itemGender"
                      value={itemGender}
                      onChange={(e) => setItemGender(e.target.value)}
                      label="Item Gender"
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="item-category-label">Category</InputLabel>
                    <Select
                      labelId="item-category-label"
                      id="itemCategoryId"
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "block", width: "100%" }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Item
              </Button>
            </CardContent>
          </Card>
        </form>
      </Container>
      <Snackbar
        open={loadingSnackbar}
        autoHideDuration={6000}
        message="Adding item..."
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default AddItemPage;
