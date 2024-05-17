import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Toy } from "./../Interfaces/Toy";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";

function ListOfItems() {
  const [toys, setToys] = useState<Toy[]>([]);
  const { user } = useUserContext();
  const [recomendedItems, setRecomendedItems] = useState<Toy[]>([]);
  const [showRecomended, setShowRecomended] = useState(false);

  const handleShowRecomended = () => {
    //api request here to fetch recomended toys
    setShowRecomended(true);
  };

  useEffect(() => {
    const getAllToysParameters = {
      pageNumber: 1,
      pageSize: 20,
    };

    axios
      .get<Toy[]>("https://localhost:7026/api/Product/GetItems", {
        params: getAllToysParameters,
      })
      .then((response) => {
        console.log("API Response:", response.data); // Log the response data
        setToys(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {user && user.Role === "Admin" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            component={Link}
            to="/AddItem"
            variant="contained"
            color="primary"
          >
            Add Item
          </Button>
        </div>
      )}
      <Container>
        <Grid container spacing={2}>
          {Object.values(toys).map((toy) => (
            <Grid item xs={12} sm={6} md={4} key={toy.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{toy.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {toy.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {toy.price}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/Toys/${toy.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: 8 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button onClick={handleShowRecomended}>Show Recomended Items</Button>
        {showRecomended && (
          <Grid container spacing={2}>
            {Object.values(recomendedItems).map((toy) => (
              <Grid item xs={12} sm={6} md={4} key={toy.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{toy.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {toy.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {toy.price}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/Toys/${toy.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: 8 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default ListOfItems;
