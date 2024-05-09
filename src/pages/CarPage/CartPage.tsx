import React from 'react';
import { useCart } from '../../Context/CartContext';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Button,
  Paper,
  Box,
} from '@mui/material';
import { RemoveCircle } from '@mui/icons-material';
import { Toy } from '../../Interfaces/Toy';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { Link } from 'react-router-dom';

function CartPage() {
  const { cart, removeFromCart } = useCart();
  const handleRemoveItem = (item: Toy) => {
    removeFromCart(item);
  };

  return (
    <div>
      <MenuBar />
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <List>
          {cart.map((cartItem, index) => (
            <ListItem key={cartItem.item.id} divider={index < cart.length - 1}>
              <ListItemText
                primary={cartItem.item.name}
                secondary={`Price: ${cartItem.item.price}`}
              />
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Typography variant="body1">
                    Quantity: {cartItem.quantity}
                  </Typography>
                </Grid>
              </Grid>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveItem(cartItem.item)}
                  color="secondary"
                >
                  <RemoveCircle />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/Cart/Order`}
        >
          Place Order
        </Button>
      </Box>
    </div>
  );
}

export default CartPage;
