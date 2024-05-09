import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  Snackbar,
} from '@mui/material';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';
import { apiService } from '../../serivces/business/apiService';

function ProfileEditPage() {
  const { user, setUser } = useUserContext();
  const [editedProfile, setEditedProfile] = useState({
    nickname: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    gender: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    id: '',
    country: '',
    district: '',
    city: '',
    street: '',
    zipCode: '',
    houseNumber: 0,
    flatNumber: 0,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Set default values from the current user context
      setEditedProfile({
        nickname: user.Nickname,
        name: user.Name,
        surname: user.Surname,
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        gender: user.Gender,
      });

      // Fetch and set default values for the shipping address
      axios
        .get(`https://localhost:7026/api/ShippingAddress/GetById/${user.Id}`)
        .then((response) => {
          setShippingAddress(response.data);
        })
        .catch((error) => {
          console.error('Error fetching shipping address:', error);
        });
    }
  }, [user]);

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Check if required fields are empty
      if (
        !editedProfile.nickname ||
        !editedProfile.name ||
        !editedProfile.surname ||
        !editedProfile.email ||
        !editedProfile.phoneNumber ||
        !editedProfile.gender ||
        !shippingAddress.city ||
        !shippingAddress.street ||
        !shippingAddress.zipCode ||
        !shippingAddress.houseNumber ||
        !shippingAddress.flatNumber
      ) {
        setSnackbarMessage('Please fill in all required fields.');
        setSnackbarOpen(true);
        return;
      }

      // Make a PUT request to edit the user
      await axios.put(`https://localhost:7026/api/User/EditUser/${user?.Id}`, {
        ...editedProfile,
        birthDate: user!.BirthDate,
      });

      // Update the user context with the edited profile

      // Make a PUT request to edit the shipping address
      try {
        await axios.put(
          `https://localhost:7026/api/ShippingAddress/EditShippingAddress/${shippingAddress.id}`,
          {
            country: shippingAddress.country,
            district: shippingAddress.district,
            city: shippingAddress.city,
            street: shippingAddress.street,
            zipCode: shippingAddress.zipCode,
            houseNumber: shippingAddress.houseNumber,
            flatNumber: shippingAddress.flatNumber,
            userId: user!.Id,
          },
        );
      } catch (error) {
        console.error('Error editing user or shipping address:', error);
      }

      const userResponse2 = await apiService.fetchUserInfo(user!.Token);
      setUser({
        ...user!,
        Id: userResponse2.data.id,
        Nickname: userResponse2.data.nickname,
        Name: userResponse2.data.name,
        Surname: userResponse2.data.surname,
        Email: userResponse2.data.email,
        PhoneNumber: userResponse2.data.phoneNumber,
        ReviewCount: userResponse2.data.reviewCount,
        Role: userResponse2.data.role,
        Gender: userResponse2.data.gender,
      });

      // Redirect to the profile page
      navigate('/Profile');
    } catch (error) {
      setSnackbarMessage('Error editing user or shipping address.');
      setSnackbarOpen(true);
      console.error('Error editing user or shipping address:', error);
    }
  };

  const handleShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <MenuBar />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h4">{editedProfile.nickname}</Typography>
            <Typography variant="h6">{editedProfile.name}</Typography>
            <Typography variant="h6">{editedProfile.surname}</Typography>
            <Typography variant="h6">{editedProfile.email}</Typography>
            <Typography variant="h6">{editedProfile.phoneNumber}</Typography>

            <Typography variant="h5">Edit</Typography>
            <form onSubmit={handleEdit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="nickname"
                label="Nickname"
                name="nickname"
                autoComplete="nickname"
                autoFocus
                value={editedProfile.nickname}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="First Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={editedProfile.name}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="surname"
                label="Last Name"
                name="surname"
                autoComplete="surname"
                autoFocus
                value={editedProfile.surname}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="number"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="number"
                autoFocus
                value={editedProfile.phoneNumber}
                onChange={handleChange}
              />
              <Select
                id="gender"
                label="Gender"
                name="gender"
                autoComplete="gender"
                autoFocus
                value={editedProfile.gender}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    ['gender']: e.target.value,
                  })
                }
              >
                <MenuItem value="Man">Man</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </Select>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="city"
                autoFocus
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="street"
                label="Street"
                name="street"
                autoComplete="street"
                autoFocus
                value={shippingAddress.street}
                onChange={handleShippingAddressChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="zipCode"
                label="Zip Code"
                name="zipCode"
                autoComplete="zipCode"
                autoFocus
                value={shippingAddress.zipCode}
                onChange={handleShippingAddressChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="houseNumber"
                label="House Number"
                name="houseNumber"
                type="number"
                autoComplete="houseNumber"
                autoFocus
                value={shippingAddress.houseNumber}
                onChange={handleShippingAddressChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="flatNumber"
                label="Flat Number"
                name="flatNumber"
                type="number"
                autoComplete="flatNumber"
                autoFocus
                value={shippingAddress.flatNumber}
                onChange={handleShippingAddressChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleEdit}
              >
                Edit
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

export default ProfileEditPage;
