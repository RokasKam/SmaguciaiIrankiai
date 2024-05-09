import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { Toy } from '../../Interfaces/Toy';

function ToyDetails() {
  const { id } = useParams<{ id: string }>();
  const [toy, setToy] = useState<Toy | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get<Toy>(`https://localhost:7026/api/Product/GetItem/${id}`)
      .then((response) => {
        setToy(response.data);
        console.log(response);
      })
      .catch((error) => console.error('Error fetching toy details:', error));
  }, [id]);

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
      console.error('Error removing item:', error);
    }
  };

  return (
    <div>
      <MenuBar />
      <Button
        component={Link}
        to="/List"
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 8 }}
      >
        Go back to list
      </Button>
      <Container>
        <Card>
          {toy.photos.length > 0 && (
            <div>
              <Typography variant="h5">Photos</Typography>
              <Grid container spacing={2}>
                {toy.photos.map((photo, index) => (
                  <Grid item key={index}>
                    <CardMedia
                      component="img"
                      height="200"
                      width="200"
                      image={photo.url}
                      alt={`Photo ${index + 1}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
          <CardContent>
            <Typography variant="h4">{toy.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {toy.description}
            </Typography>
            <Typography variant="h6" color="primary">
              {toy.price}
            </Typography>
            <>
              <div>
                <Link to={`/edit/${toy.id}`}>
                  <Button variant="contained" color="primary">
                    Edit Item
                  </Button>
                </Link>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  Remove Item
                </Button>
              </div>
            </>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </CardContent>
        </Card>
      </Container>
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
    </div>
  );
}

export default ToyDetails;
