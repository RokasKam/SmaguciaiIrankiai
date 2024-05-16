import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { API_URL } from "./serivces/Configuration";
import axios from "axios";
import ListOfItems from "./pages/ListOfItems";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import ItemPage from "./pages/ItemPage";
import { CartProvider } from "./Context/CartContext";
import CartPage from "./pages/CartPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItem";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfileDeletePage from "./pages/ProfileDeletePage";
import PasswordChangePage from "./pages/PasswordChangePage";
import FeedbackPage from "./pages/FeedbackPage";
import EditFeedback from "./pages/EditFeedback";
import FormOrderPage from "./pages/FormOrderPage";
import AuctionsPage from './pages/ListOfAuctions';
import AuctionPage from './pages/AuctionPage';
import RoutePage from './pages/RoutePage';
import PaymentPage from "./pages/PaymentPage";
import { UserContextProvider  } from "./Context/UserContext";
import MenuBar from "./Components/MenuBar/MenuBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(API_URL + "/User/GetMe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Checking login status failed, trying to refresh token.");
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <UserContextProvider>
        <CartProvider>
          <BrowserRouter>
            <MenuBar isLoggedIn={isLoggedIn} onLogout={handleLogout}>
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
                <Route path="/auctions" element={<AuctionsPage />} />
                <Route path="/auctions/:auctionId" element={<AuctionPage />} />
                <Route path="/route" element={<RoutePage />} />
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
            </MenuBar>
          </BrowserRouter>
        </CartProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
