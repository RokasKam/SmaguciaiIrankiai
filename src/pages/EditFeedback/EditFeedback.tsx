import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Rating, Box, Snackbar } from '@mui/material';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';

interface Review {
  id: string;
  text: string;
  dateAdded: string;
  reported: boolean;
  rating: number;
}

function EditFeedback() {
  const { itemId, id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [editedReview, setEditedReview] = useState({
    text: '',
    rating: 0,
    userId: user?.Id || '',
    productId: itemId,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Fetch default data for the review
    axios
      .get<Review>(`https://localhost:7026/api/Review/GetById/${id}`)
      .then((response) => {
        setEditedReview({
          text: response.data.text,
          rating: response.data.rating,
          userId: user!.Id,
          productId: itemId,
        });
      })
      .catch((error) => {
        console.error('Error fetching review details:', error);
        // Handle the error and display a Snackbar
        setSnackbarMessage('Error fetching review details. Please try again.');
        setSnackbarOpen(true);
      });
  }, [id, itemId, user]);

  const handleEditReview = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Validate fields
    if (!editedReview.text || editedReview.rating === 0) {
      setSnackbarMessage('Please fill in all required fields for the review.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(
        `https://localhost:7026/api/Review/EditReview/${id}`,
        editedReview,
      );

      // Handle the response as needed
      console.log('Review edited:', response.data);

      // Redirect to the feedback page after editing the review
      navigate(`/Toys/${itemId}/Feedback`);
    } catch (error) {
      console.error('Error editing review:', error);

      // Handle the error and display a Snackbar
      setSnackbarMessage('Error editing review. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        name="text"
        label="Your Review"
        type="text"
        id="text"
        autoComplete="current-text"
        multiline
        rows={4}
        value={editedReview.text}
        onChange={(e) =>
          setEditedReview({ ...editedReview, text: e.target.value })
        }
      />
      <Rating
        name="rating"
        value={editedReview.rating}
        precision={0.5}
        size="large"
        onChange={(event, newValue) =>
          setEditedReview({ ...editedReview, rating: newValue || 0 })
        }
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleEditReview}
      >
        Save Changes
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default EditFeedback;
