// src/pages/AuctionsPage.js or src/pages/AuctionsPage.tsx for TypeScript
import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { Auction } from '../Interfaces/Auction';
import { Link } from 'react-router-dom';

const auctions: Auction[] = [
  {
    id: "1",
    name: "Vintage Art",
    price: 150.00,
    startDate: "2023-05-01T14:00:00",
    endDate: "2023-05-10T14:00:00",
    status: "Ongoing",
    description: "A beautiful piece of vintage art from the 1920s."
  },
  {
    id: "2",
    name: "Antique Vase",
    price: 450.00,
    startDate: "2023-05-02T10:00:00",
    endDate: "2023-05-12T15:00:00",
    status: "Upcoming",
    description: "An exquisite antique vase from the Ming dynasty."
  },
  // Add more auctions as needed
];

const AuctionsPage = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Auctions
      </Typography>
      <Grid container spacing={2}>
        {auctions.map((auction, index) => (
          <Grid item xs={12} sm={6} md={4} key={auction.id || index}>
            <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none' }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{auction.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  Starting Bid: ${auction.price.toFixed(2)}
                </Typography>
                <Typography variant="body2">Starts: {new Date(auction.startDate).toLocaleString()}</Typography>
                <Typography variant="body2">Ends: {new Date(auction.endDate).toLocaleString()}</Typography>
                <Typography variant="body2" style={{ color: auction.status === 'Ongoing' ? 'green' : 'orange' }}>
                  Status: {auction.status}
                </Typography>
                <Typography variant="body2">{auction.description}</Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AuctionsPage;
