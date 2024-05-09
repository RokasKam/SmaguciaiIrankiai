import React, { useState } from 'react';
import { Button, TextField, Snackbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../Context/UserContext';
import { useCart } from '../../Context/CartContext';

function PaymentPage() {
  const { clearCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const parsedId = id ?? '-1';
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (
      !isCardholderNameValid(cardholderName) ||
      !isCardNumberValid(cardNumber) ||
      !isExpirationDateValid(expirationDate) ||
      !isCvcValid(cvc)
    ) {
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      // Perform payment processing logic
      const paymentData = {
        email: user!.Email,
        name: cardholderName,
        orderId: parsedId,
        creditCard: {
          name: cardholderName,
          cardNumber,
          expirationYear: expirationDate.slice(3, 5),
          expirationMonth: expirationDate.slice(0, 2),
          cvc,
        },
      };

      // Make a payment using the API
      await axios.post(
        'https://localhost:7026/api/Stripe/payment/add',
        paymentData,
      );

      // Update state to indicate successful payment
      setTimeout(function () {
        // Your code to execute after 5 seconds
        clearCart();
        navigate('/');
      }, 1000);
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle payment error, show a message, etc.
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrorSnackbarOpen(false);
  };

  // Format validation functions
  const isCardholderNameValid = (name: string) =>
    /^[a-zA-Z\s]*$/.test(name.trim());
  const isCardNumberValid = (number: string) => /^[0-9]{16}$/.test(number);
  const isExpirationDateValid = (date: string) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  const isCvcValid = (cvc: string) => /^[0-9]{3,4}$/.test(cvc);

  return (
    <div>
      <form onSubmit={handlePaymentSubmit}>
        <TextField
          label="Cardholder Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
        />
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <TextField
          label="Expiration Date"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="MM/YY"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <TextField
          label="CVV"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Pay
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Payment failed. Please try again."
      />

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Please fill in all fields correctly."
      />

      {paymentSuccess && (
        <Snackbar
          open={paymentSuccess}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Payment successful. Thank you for your purchase!"
        />
      )}
    </div>
  );
}

export default PaymentPage;
