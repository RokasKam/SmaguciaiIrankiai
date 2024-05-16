import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Toy } from "./../Interfaces/Toy";
import { useUserContext } from "../Context/UserContext";

function ToyDetails() {
  const { id } = useParams<{ id: string }>();
  const [toy, setToy] = useState<Toy | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Toy>(`https://localhost:7026/api/Product/GetItem/${id}`)
      .then((response) => {
        setToy(response.data);
        console.log(response);
      })
      .catch((error) => console.error("Error fetching toy details:", error));
  }, [id]);

  const handleAddToCart = () => {
    // Assuming a function to add items to the cart
    // addItemsToCart(toy.id, quantity);
    if (toy) {
      console.log(`Added ${quantity} of ${toy.name} to the cart`);
      setSnackbarMessage(`${quantity} of ${toy.name} added to cart`);
      setSnackbarOpen(true);
    }
  };

  if (!toy) {
    return <div>Loading...</div>;
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRemoveItem = async () => {
    try {
      await axios.delete(`https://localhost:7026/api/Product/DeleteItem/${id}`);
      setConfirmDeleteOpen(false); // Close the confirmation dialog
      navigate(`/List`); // Optionally, you can show a success message or navigate to another page
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={2} mb={2}>
        <Button
          component={Link}
          to="/List"
          variant="contained"
          color="primary"
          fullWidth
        >
          Go back to list
        </Button>
      </Box>
      <Card>
        {toy.photos.length > 0 && (
          <Box p={2}>
            <Typography variant="h5" gutterBottom>
              Photos
            </Typography>
            <Grid container spacing={2}>
              {toy.photos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CardMedia
                    component="img"
                    image={photo.url}
                    alt={`Photo ${index + 1}`}
                    style={{ width: "100%", height: "auto" }} // Ensure responsive images
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {toy.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {toy.description}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${toy.price.toFixed(2)}
          </Typography>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            InputProps={{ inputProps: { min: 1, max: 100 } }} // assuming max 100 for simplicity
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleAddToCart}
            variant="contained"
            color="primary"
            fullWidth
          >
            Add to Cart
          </Button>
          {user && user.Role === "Admin" && (
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <Button
                  component={Link}
                  to={`/edit/${toy.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Edit Item
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setConfirmDeleteOpen(true)}
                  fullWidth
                >
                  Remove Item
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Error removing item"
      />
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveItem} color="primary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ToyDetails;
