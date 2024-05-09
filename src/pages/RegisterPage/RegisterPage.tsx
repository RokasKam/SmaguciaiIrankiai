import React, { useState } from 'react';
import MenuBar from '../../Components/MenuBar/MenuBar';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const genderOptions = ['Man', 'Women', 'Unisex'];

function RegisterPage() {
  const [nickname, setNickname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [role] = useState('User');

  // Shipping Info
  const [shippingInfo, setShippingInfo] = useState({
    country: '',
    district: '',
    city: '',
    street: '',
    zipCode: '',
    houseNumber: 0,
    flatNumber: 0,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any required field is empty
    const requiredFields = [
      nickname,
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
      phoneNumber,
      birthDate,
      gender,
      shippingInfo.country,
      shippingInfo.district,
      shippingInfo.city,
      shippingInfo.street,
      shippingInfo.zipCode,
    ];

    if (requiredFields.some((field) => !field)) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    // Check if passwords match
    if (password !== repeatPassword) {
      setSnackbarMessage('Passwords do not match.');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Prepare the request payload for user registration
      const newUser = {
        nickname,
        name: firstName,
        surname: lastName,
        email,
        password,
        phoneNumber,
        birthDate,
        gender,
        role,
      };

      // Make a POST request to register a new user
      const userResponse = await axios.post(
        'https://localhost:7026/api/User/Register',
        newUser,
      );

      // Handle the response as needed
      console.log('New user registered:', userResponse.data);

      // If user wants to add shipping information
      if (userResponse.data && shippingInfo.city) {
        // Prepare the request payload for shipping address
        const shippingAddress = {
          ...shippingInfo,
          userId: userResponse.data,
        };

        // Make a POST request to add new shipping address
        await axios.post(
          'https://localhost:7026/api/ShippingAddress/AddNewShippingAddress',
          shippingAddress,
        );

        console.log('Shipping address added successfully.');
        navigate('/');
      }
    } catch (error) {
      setSnackbarMessage('Error registering user. Please try again.');
      setOpenSnackbar(true);
      console.error('Error registering user:', error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
            <Typography variant="h5">Register</Typography>
            <form onSubmit={handleRegister} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="nickname"
                label="Nickname"
                name="nickname"
                autoComplete="nickname"
                autoFocus
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="number"
                label="Phone Number"
                name="number"
                autoComplete="number"
                autoFocus
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="birthDate"
                label="Birth Date"
                name="birthDate"
                type="date"
                autoComplete="bday"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <Select
                variant="outlined"
                required
                fullWidth
                id="gender"
                label="Gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              {/* Shipping Information */}
              <Typography variant="h6" style={{ marginTop: '16px' }}>
                Shipping Information
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Country"
                value={shippingInfo.country}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, country: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="District"
                value={shippingInfo.district}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, district: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="City"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Street"
                value={shippingInfo.street}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, street: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Zip Code"
                value={shippingInfo.zipCode}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="House Number"
                type="number"
                value={shippingInfo.houseNumber}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    houseNumber: parseInt(e.target.value) || 0,
                  })
                }
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                label="Flat Number"
                type="number"
                value={shippingInfo.flatNumber}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    flatNumber: parseInt(e.target.value) || 0,
                  })
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRegister}
              >
                Register
              </Button>
            </form>
          </Paper>
        </div>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}

export default RegisterPage;
