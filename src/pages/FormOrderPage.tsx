import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  TextField,
  Button,
  Snackbar,
  Grid,
  Paper,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from './../Context/CartContext';
import axios from 'axios';
import { useUserContext } from './../Context/UserContext';

function FormOrderPage() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { cart } = useCart();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
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
  const [discountCode, setDiscountCode] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Calculate total quantity and price
    const quantity = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0,
    );

    setTotalQuantity(quantity);
    setTotalPrice(price);

    // Fetch and set shipping address
    axios
      .get(`https://localhost:7026/api/ShippingAddress/GetById/${user!.Id}`)
      .then((response) => setShippingAddress(response.data))
      .catch((error) =>
        console.error('Error fetching shipping address:', error),
      );
  }, [cart, user]);

  const handleDiscountCodeChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDiscountCode(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let discount = 0;
    let discountId = '';
    if (discountCode) {
      try {
        const response = await axios.get(
          `https://localhost:7026/api/DiscountCode/GetByCode/${discountCode}`,
        );

        // Discount code found, apply the discount
        discount = response.data.discount;
        discountId = response.data.id;
        setTotalPrice(totalPrice - (totalPrice * discount) / 100);
        // Optionally, you can show a success message or update UI
      } catch (error) {
        // Show an error message
        setSnackbarOpen(true);
        return;
      }
    }
    console.log(discount);
    try {
      // Create a new order
      const orderData = {
        wholePrice: totalPrice - (totalPrice * discount) / 100, // Apply the discount
        wholeAmount: totalQuantity,
        userId: user!.Id,
        discountcodeId: discountId || null,
        shippingAddressId: shippingAddress.id,
      };

      if (orderData.wholePrice < 0.5) {
        setSnackbarOpen(true);
        setSnackbarMessage('Invalid discount code. Please try again.');

        return;
      }

      const orderResponse = await axios.post(
        'https://localhost:7026/api/Order/AddNewOrder',
        orderData,
      );

      // Add order products
      await Promise.all(
        cart.map(async (cartItem) => {
          const orderProductData = {
            amount: cartItem.quantity,
            productId: cartItem.item.id,
            orderId: orderResponse.data,
          };

          await axios.post(
            'https://localhost:7026/api/OrderProduct/AddNewOrder',
            orderProductData,
          );
        }),
      );

      // Clear the cart after successful order placement
      // Redirect to the payment page or order confirmation page
      setOrderId(orderResponse.data);
      setSnackbarOpen(true);
      setSnackbarMessage('Order was created successfully');
      // You can redirect the user to the payment page or order confirmation page
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage('Order cannot be created. Wrond input');
      console.error('Error creating order:', error);
      // Handle error, show a message, etc.
    }
  };

  const handlePay = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate(`/Cart/Order/Pay/${orderId}`);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Order Summary
        </Typography>
        <Paper variant="outlined" style={{ padding: '20px' }}>
          <Typography variant="body1" gutterBottom>
            Total Quantity: {totalQuantity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Price: ${totalPrice.toFixed(2)}
          </Typography>
        </Paper>

        <Box mt={4} mb={2}>
          <Typography variant="h5" gutterBottom>
            Shipping Address
          </Typography>
          <Paper variant="outlined" style={{ padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>Country:</strong> {shippingAddress.country}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>District:</strong> {shippingAddress.district}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>City:</strong> {shippingAddress.city}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>Street:</strong> {shippingAddress.street}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>Zip Code:</strong> {shippingAddress.zipCode}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>House Number:</strong> {shippingAddress.houseNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1"><strong>Flat Number:</strong> {shippingAddress.flatNumber}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <TextField
          label="Discount Code"
          variant="outlined"
          fullWidth
          margin="normal"
          value={discountCode}
          onChange={handleDiscountCodeChange}
        />

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginRight: 8 }}
          >
            Place Order
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handlePay}
          >
            Pay Order
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default FormOrderPage;
