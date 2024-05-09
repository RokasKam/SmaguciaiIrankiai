import React, { useState } from 'react';
import MenuBar from '../../Components/MenuBar/MenuBar';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { apiService } from '../../serivces/business/apiService';

function LoginPage() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const login = async () => {
    try {
      if (!loginInfo.email || !loginInfo.password) {
        setSnackbarMessage('Please fill in both email and password.');
        setSnackbarOpen(true);
        return;
      }

      const loginResponse = await apiService.login(loginInfo);
      try {
        const userResponse = await apiService.fetchUserInfo(
          loginResponse.data.accessToken,
        );
        setUser({
          Token: loginResponse.data.accessToken,
          Id: userResponse.data.id,
          Nickname: userResponse.data.nickname,
          Name: userResponse.data.name,
          Surname: userResponse.data.surname,
          Email: userResponse.data.email,
          PhoneNumber: userResponse.data.phoneNumber,
          BirthDate: userResponse.data.birthDate,
          ReviewCount: userResponse.data.reviewCount,
          Role: userResponse.data.role,
          Gender: userResponse.data.gender,
        });

        // Redirect to the desired route upon successful login
        navigate('/');
      } catch (error) {
        console.log('Error fetching user info', error);
      }
    } catch (error) {
      setSnackbarMessage('Login failed. Please check your credentials.');
      setSnackbarOpen(true);
      console.log('Login failed', error);
    }
  };

  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    login();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <MenuBar />
      <Container component="main" maxWidth="xs">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 32,
          }}
        >
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">Login</Typography>
            <form noValidate onSubmit={handleFormSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginInfo.email}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginInfo.password}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </div>
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

export default LoginPage;
