import React, { useState } from "react";
import { AppBar, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";

interface MenuBarProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  children,
  isLoggedIn,
  onLogout,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { user } = useUserContext();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6">Smagučiai</Typography>
          </Link>
          <Tabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
          >
            {isLoggedIn && (
              <>
                <Tab
                  label="List"
                  component={Link}
                  to="/List"
                  style={{ color: "inherit" }}
                />
                <Tab
                  label="Auctions"
                  component={Link}
                  to="/auctions"
                  style={{ color: "inherit" }}
                />
                <Tab
                  label="Order"
                  component={Link}
                  to="/Cart/Order"
                  style={{ color: "inherit" }}
                />
                {user && user.Role === "Courier" && (
                  <Tab
                    label="Route"
                    component={Link}
                    to="/route"
                    style={{ color: "inherit" }}
                  />
                )}
                <Tab
                  label="Profile"
                  component={Link}
                  to="/Profile"
                  style={{ color: "inherit" }}
                />
                <Tab
                  label="Logout"
                  onClick={onLogout}
                  style={{ color: "inherit", cursor: "pointer" }}
                />
              </>
            )}
            {!isLoggedIn && (
              <>
                <Tab
                  label="Login"
                  component={Link}
                  to="/Login"
                  style={{ color: "inherit" }}
                />
                <Tab
                  label="Register"
                  component={Link}
                  to="/Register"
                  style={{ color: "inherit" }}
                />
              </>
            )}
          </Tabs>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

export default MenuBar;
