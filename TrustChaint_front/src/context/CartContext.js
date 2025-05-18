import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); 
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    if (items.length > 0) {
      fetchCartDetails();
    } else {
      setCartDetails([]);
    }
  }, [items]);

  const fetchCartDetails = async () => {
    try {
      const productIds = items.map(item => item.product); 
      console.log('Product IDs to fetch:', productIds);
      const response = await axios.post('http://localhost:8001/api/products/cart-products', productIds);
      const fetchedProducts = response.data;
      const mergedCart = fetchedProducts.map(product => {
        const matchedItem = items.find(item => item.product.id === product.id);
        return {
          ...product,
          quantity: matchedItem?.quantity || 1,
          seller_id: matchedItem?.seller_id || null
        };
      });
      setCartDetails(mergedCart);
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  const addToCart = (product, quantity = 1, seller_id) => {
    console.log('Adding to cart:', {
      product,
      quantity,
      seller_id
    });
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity, seller_id }];
      }
    });
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem('user_id');
      await axios.delete(`http://localhost:8001/cart/cart/${userId}/item/${productId}`);
      
      setItems(prev =>
        prev.filter(item => item.product_id !== productId)
      );
  
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };
  
  const clearCart = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      await axios.delete(`http://localhost:8001/cart/${userId}`);
      setItems([]);
      console.log('Cart cleared for user:', userId);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };
  return (
    <CartContext.Provider
      value={{
        items,
        cartDetails,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
