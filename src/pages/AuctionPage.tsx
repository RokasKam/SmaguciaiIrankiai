import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Paper } from "@mui/material";

interface Auction {
  id: string;
  name: string;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

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

  useEffect(() => {
    const foundAuction = DUMMY_AUCTIONS.find(
      (auction) => auction.id === auctionId
    );
    setAuction(foundAuction);
  }, [auctionId]);

  const handleBid = () => {
    console.log(`Bid of $${bidAmount} placed for ${auction?.name}`);
    // Typically, you would send this bid to your backend
  };

  if (!auction) return <Typography variant="h6">Auction not found</Typography>;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        {auction.name}
      </Typography>
      <Paper elevation={2} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h5" color="primary">
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
      <TextField
        label="Your Bid ($)"
        type="number"
        fullWidth
        variant="outlined"
        onChange={(e) => setBidAmount(parseFloat(e.target.value))}
        InputProps={{ inputProps: { min: auction.price } }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleBid}
        style={{ marginTop: "20px" }}
      >
        Place Bid
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(-1)}
        style={{ marginTop: "20px", marginLeft: "10px" }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default AuctionPage;
