import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import MenuBar from "./../Components/MenuBar/MenuBar";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./../Context/UserContext";

function ProfilePage() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Assuming setUser is a function that sets the user context data
    setUser(undefined);

    // Redirect to the home page
    navigate("/");
  };
  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {user?.Name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {user?.Email}
            </Typography>
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    component={Link}
                    to="/Profile/Edit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component={Link}
                    to="/Profile/PasswordChange"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Logout
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component={Link}
                    to="/Profile/Delete"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default ProfilePage;
