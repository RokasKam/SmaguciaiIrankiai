import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { Category } from '../../Interfaces/Options';

function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    price: 0,
    creationDate: '',
    color: '',
    amount: 0,
    gender: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [genders] = useState(['Man', 'Women', 'Unisex']);
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: 0,
    creationDate: '',
    color: '',
    amount: 0,
    ratingAverage: 0,
    ratingAmount: 0,
    description: '',
    warrantyPeriod: 0,
    gender: '',
    categoryId: '',
    manufacturerId: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch categories
    axios
      .get('https://localhost:7026/api/Category/GetAll')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));

    // Fetch default data for the product
    axios
      .get(`https://localhost:7026/api/Product/GetItem/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  useEffect(() => {
    if (product) {
      setEditedProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        creationDate: product.creationDate || '',
        color: product.color || '',
        amount: product.amount || 0,
        gender: product.gender || '',
        categoryId: product.categoryId || '',
      });
    }
  }, [product]);

  const handleEditProduct = async () => {
    if (
      !editedProduct.name ||
      !editedProduct.description ||
      editedProduct.price <= 0 ||
      editedProduct.amount <= 0 ||
      !editedProduct.color ||
      !editedProduct.gender ||
      !editedProduct.categoryId
    ) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }
    try {
      // Prepare the request payload
      const updatedProduct = {
        ...editedProduct,
        // Add other fields as needed
      };

      // Make a POST request to edit the product
      const response = await axios.put(
        `https://localhost:7026/api/Product/EditItem/${id}`,
        updatedProduct,
      );

      // Handle the response as needed
      console.log('Product edited:', response.data);

      // Redirect to the details page
      navigate(`/Toys/${id}`);
    } catch (error) {
      setSnackbarMessage('Unable to add item or photos');
      setOpenSnackbar(true);
      console.error('Error editing product:', error);
    }
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const divStyle = {
    marginBottom: '16px',
    width: '100%',
  };

  const textFieldStyle = {
    width: '300px',
    marginBottom: '16px',
  };

  return (
    <>
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h4">Edit Product</Typography>
            <div style={divStyle}>
              <TextField
                label="Product Name"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
                style={textFieldStyle}
              />
            </div>

            <div style={divStyle}>
              <TextField
                label="Product Description"
                multiline
                rows={4}
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
                style={textFieldStyle}
              />
            </div>

            <div style={divStyle}>
              <TextField
                label="Product Price"
                type="number"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                style={textFieldStyle}
              />
            </div>

            <div style={divStyle}>
              <TextField
                label="Product Color"
                value={editedProduct.color}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, color: e.target.value })
                }
                style={textFieldStyle}
              />
            </div>

            <div style={divStyle}>
              <TextField
                label="Product Amount"
                type="number"
                value={editedProduct.amount}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    amount: parseInt(e.target.value) || 0,
                  })
                }
                style={textFieldStyle}
              />
            </div>

            <div style={divStyle}>
              <Select
                label="Product Gender"
                value={editedProduct.gender}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, gender: e.target.value })
                }
                style={textFieldStyle}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div style={divStyle}>
              <Select
                label="Product Category"
                value={editedProduct.categoryId}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    categoryId: e.target.value,
                  })
                }
                style={textFieldStyle}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProduct}
              style={{ marginBottom: '12px', width: '300px' }}
            >
              Edit Product
            </Button>
            <Link to={`/Toys/${id}`}>
              <Button variant="contained" color="primary" fullWidth>
                Go Back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default EditProductPage;
