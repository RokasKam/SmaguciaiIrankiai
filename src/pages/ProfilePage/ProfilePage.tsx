import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';

function ProfilePage() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Assuming setUser is a function that sets the user context data
    setUser(undefined);

    // Redirect to the home page
    navigate('/');
  };
  return (
    <div>
      <MenuBar />
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h4">{user?.Name}</Typography>
            <Typography variant="h6">{user?.Email}</Typography>

            <Button
              onClick={handleLogout}
              variant="contained"
              color="primary"
              fullWidth
            >
              Atsijungti
            </Button>
            <Button
              component={Link}
              to={`/Profile/Edit`}
              variant="contained"
              color="primary"
              fullWidth
            >
              Redaguoti paskyrą
            </Button>
            <Button
              component={Link}
              to={`/Profile/PasswordChange`}
              variant="contained"
              color="primary"
              fullWidth
            >
              Keisti slaptažodį
            </Button>
            <Button
              component={Link}
              to={`/Profile/Delete`}
              variant="contained"
              color="primary"
              fullWidth
            >
              Šalinti paskyrą
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default ProfilePage;
