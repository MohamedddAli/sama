// src/context/cartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getSessionId } from "../utils/session";
import axios from "axios";

const CartContext = createContext();
const api = import.meta.env.VITE_API_BASE_URL;
export const CartProvider = ({ children }) => {
  const sessionId = getSessionId();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    axios.post(`${api}/cart/init`, { sessionId }).then((res) => {
      setCart(res.data);
    });
  }, [sessionId]);

  return (
    <CartContext.Provider value={{ cart, setCart, sessionId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
