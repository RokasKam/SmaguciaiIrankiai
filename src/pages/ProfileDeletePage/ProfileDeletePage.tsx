import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';

function ProfileDeletePage() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    try {
      // Make a DELETE request to delete the user
      await axios.delete(
        `https://localhost:7026/api/User/DeleteUser/${user?.Id}`,
      );

      // Clear the user context
      setUser(undefined);

      // Redirect to the home page or another desired location
      // You can replace `/` with the desired redirect path
      navigate('/');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <MenuBar />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h4">{user?.Nickname}</Typography>
            <Typography variant="h6">{user?.Name}</Typography>
            <Typography variant="h6">{user?.Surname}</Typography>
            <Typography variant="h6">{user?.Email}</Typography>
            <Typography variant="h6">{user?.PhoneNumber}</Typography>
            <Typography variant="h6">{user?.BirthDate}</Typography>

            <Typography variant="h5">
              Confirm that you want to delete this account
            </Typography>
            <Button
              onClick={handleDeleteAccount}
              fullWidth
              variant="contained"
              color="primary"
            >
              DELETE
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default ProfileDeletePage;
