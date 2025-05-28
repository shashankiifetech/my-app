'use client';

import { createContext, useContext, useState } from 'react';

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Create Provider
export const AppProvider = ({ children }) => {
  const [bookingId, setBookingId] = useState('');
  const [itenaryId, setItenaryId] = useState('')

  const value = {
    bookingId,setBookingId,
    itenaryId, setItenaryId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 3️⃣ Create custom hook for easy access
export const useAppContext = () => useContext(AppContext);
