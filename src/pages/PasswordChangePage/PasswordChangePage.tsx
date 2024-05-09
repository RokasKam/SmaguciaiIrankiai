import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Snackbar,
} from '@mui/material';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';

function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if any field is empty
    if (!currentPassword || !newPassword || !repeatPassword) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    // Check if new passwords match
    if (newPassword !== repeatPassword) {
      setSnackbarMessage('New passwords do not match.');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Prepare the request payload for changing password
      const passwordData = {
        oldPassword: currentPassword,
        password: newPassword,
      };

      // Make a POST request to change the user's password
      const response = await axios.put(
        `https://localhost:7026/api/User/EditPassword/${user!.Id}`,
        passwordData,
      );

      // Handle the response as needed
      console.log('Password changed successfully:', response.data);

      // Redirect to the profile page or another desired location
      // You can replace `/Profile` with the desired redirect path
      navigate('/Profile');
    } catch (error) {
      setSnackbarMessage('Error changing password. Please try again.');
      setSnackbarOpen(true);
      console.error('Error changing password:', error);
    }
  };

  return (
    <div>
      <MenuBar />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h3">Change Password</Typography>
            <form onSubmit={handleChangePassword} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="repeatPassword"
                label="Repeat Password"
                type="password"
                id="repeatPassword"
                autoComplete="new-password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar for showing validation error or login failure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}

export default PasswordChangePage;
