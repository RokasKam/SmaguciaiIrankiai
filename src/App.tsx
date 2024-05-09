import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListOfItems from './pages/ListOfItemsPage/ListOfItems';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import './App.css';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ItemPage from './pages/ItemPage.tsx/ItemPage';
import { CartProvider } from './Context/CartContext';
import CartPage from './pages/CarPage/CartPage';
import AddItemPage from './pages/AddItemPage/AddItemPage';
import EditItemPage from './pages/EditItemPage/EditItem';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage/ProfileEditPage';
import ProfileDeletePage from './pages/ProfileDeletePage/ProfileDeletePage';
import PasswordChangePage from './pages/PasswordChangePage/PasswordChangePage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
import EditFeedback from './pages/EditFeedback/EditFeedback';
import FormOrderPage from './pages/FormOrderPage/FormOrderPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import React from 'react';
import { UserContext } from './Context/UserContext';

function App() {
  return (
    <div className="App">
      <UserContext>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<MainPage />} />
              <Route path="/List" element={<ListOfItems />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Register" element={<RegisterPage />} />
              <Route path="Toys/:id" element={<ItemPage />} />
              <Route path="/Cart" element={<CartPage />} />
              <Route path="/AddItem" element={<AddItemPage />} />
              <Route path="Edit/:id" element={<EditItemPage />} />
              <Route path="/Profile" element={<ProfilePage />} />
              <Route path="/Profile/Edit" element={<ProfileEditPage />} />
              <Route path="/Profile/Delete" element={<ProfileDeletePage />} />
              <Route
                path="/Profile/PasswordChange"
                element={<PasswordChangePage />}
              />
              <Route path="/Toys/:id/Feedback" element={<FeedbackPage />} />
              <Route
                path="/Toys/:itemId/Feedback/EditFeedback/:itemId/:id"
                element={<EditFeedback />}
              />
              <Route path="/Cart/Order" element={<FormOrderPage />} />
              <Route path="/Cart/Order/Pay/:id" element={<PaymentPage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserContext>
    </div>
  );
}

export default App;
