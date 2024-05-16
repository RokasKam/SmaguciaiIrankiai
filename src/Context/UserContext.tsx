import React, { createContext, useContext, useState, useEffect  } from 'react';

type User = {
  Token: string;
  Id: string;
  Nickname: string;
  Name: string;
  Surname: string;
  Email: string;
  PhoneNumber: string;
  BirthDate: string;
  ReviewCount: number;
  Role: string;
  Gender: string;
};

type UserContextType = {
  user: User | undefined; // Make user property optional as it can be undefined
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const UserContextVariable = createContext<UserContextType | undefined>(
  undefined,
);

export const useUserContext = () => {
  const context = useContext(UserContextVariable);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : undefined;
  });

  // Store user data in localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  return (
    <UserContextVariable.Provider value={{ user, setUser }}>
      {children}
    </UserContextVariable.Provider>
  );
};

export default UserContextVariable;
