// src/components/RoutePage.tsx
import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Box } from '@mui/material';
import { Route as RouteType  } from '../Interfaces/Route'; // adjust the import path based on your project structure

const mockRoute: RouteType = {
    id: 'route1',
    orders: [
      { id: 'order1', price: 19.99, address: '1234 Main St, Anytown, AT 12345', date: '2023-04-18T12:34:56.000Z' },
      { id: 'order2', price: 29.99, address: '5678 Second St, Othertown, OT 67890', date: '2023-04-19T08:21:00.000Z' },
    ],
    duration: '3 hours',
    status: 'Active',
  };

function RoutePage() {
const route = mockRoute;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Route Details
      </Typography>
      <Paper elevation={2} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Route ID: {route.id}</Typography>
        <Typography variant="body1">Duration: {route.duration}</Typography>
        <Typography variant="body1">Status: {route.status}</Typography>
        
        <Typography variant="h5" style={{ marginTop: '20px' }} gutterBottom>
          Orders:
        </Typography>
        <List>
          {route.orders.map((order) => (
            <ListItem key={order.id}>
              <ListItemText
                primary={`Order ID: ${order.id} - ${order.address}`}
                secondary={`Price: $${order.price.toFixed(2)} - Date: ${new Date(order.date).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RoutePage;
