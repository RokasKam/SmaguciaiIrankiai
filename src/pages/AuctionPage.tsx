import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Grid, Paper } from "@mui/material";
import { Auction } from "./../Interfaces/Auction";
import { Profile } from "./../Interfaces/Profile";


// Dummy data for the example
const DUMMY_AUCTIONS: Auction[] = [
  {
    id: "1",
    name: "Vintage Art",
    price: 150.0,
    startDate: "2023-05-01T14:00:00",
    endDate: "2023-05-10T14:00:00",
    status: "Ongoing",
    description: "A beautiful piece of vintage art from the 1920s.",
  },
];

const AuctionPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [winner, setWinner] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    const foundAuction = DUMMY_AUCTIONS.find(
      (auction) => auction.id === auctionId
    );
    setAuction(foundAuction);

    // Simulate fetching winner data
    if (foundAuction && foundAuction.status === "Completed") {
        //Api call for fetching winner
        //setWinner();
      }
  }, [auctionId]);

  const handleBid = () => {
    console.log(`Bid of $${bidAmount} placed for ${auction?.name}`);
    // Typically, you would send this bid to your backend
  };

  if (!auction) return <Typography variant="h6">Auction not found</Typography>;

  return (
    <Box padding={3} maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        {auction.name}
      </Typography>
      <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Details:
        </Typography>
        <Typography variant="body1">
          Starting Bid: ${auction.price.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Starts: {new Date(auction.startDate).toLocaleString()}
        </Typography>
        <Typography variant="body1">
          Ends: {new Date(auction.endDate).toLocaleString()}
        </Typography>
        <Typography variant="body1">Status: {auction.status}</Typography>
        <Typography variant="body1">{auction.description}</Typography>
      </Paper>
      {winner && (
        <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Winner:
          </Typography>
          <Typography variant="body1">Name: {winner.name}</Typography>
          <Typography variant="body1">Email: {winner.email}</Typography>
        </Paper>
      )}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleBid();
        }}
      >
        <TextField
          label="Your Bid ($)"
          type="number"
          fullWidth
          variant="outlined"
          value={bidAmount}
          onChange={(e) => setBidAmount(parseFloat(e.target.value))}
          InputProps={{ inputProps: { min: auction.price } }}
          sx={{ marginBottom: 3 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Place Bid
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AuctionPage;
