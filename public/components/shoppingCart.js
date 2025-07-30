/**
 * @module shoppingCart
 * @description Manages the shopping cart functionality.
 */

import { useState, useEffect } from 'react';

/**
 * @function useShoppingCart
 * @returns {object} - An object containing the shopping cart state and methods.
 */
const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Load cart from local storage or database on mount
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Calculate cart total whenever cartItems change
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
    //Save cart to local storage
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);


  /**
   * @function addItem
   * @param {object} item - The item to add to the cart.
   * @param {number} quantity - The quantity of the item to add.
   * @throws {Error} If item is invalid or quantity is not a positive number.
   */
  const addItem = (item, quantity) => {
    if (!item || !item.id || !item.price || quantity <= 0) {
      throw new Error('Invalid item or quantity.');
    }

    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity }]);
    }
  };

  /**
   * @function removeItem
   * @param {number} itemId - The ID of the item to remove.
   * @throws {Error} If itemId is invalid.
   */
  const removeItem = (itemId) => {
    if (!itemId) {
      throw new Error('Invalid itemId.');
    }
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };


  /**
   * @function updateItemQuantity
   * @param {number} itemId - The ID of the item to update.
   * @param {number} quantity - The new quantity of the item.
   * @throws {Error} If itemId is invalid or quantity is not a positive number.
   */
  const updateItemQuantity = (itemId, quantity) => {
    if (!itemId || quantity <= 0) {
      throw new Error('Invalid itemId or quantity.');
    }
    setCartItems(cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  /**
   * @function clearCart
   * Clears the shopping cart.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  return { cartItems, cartTotal, addItem, removeItem, updateItemQuantity, clearCart };
};

export default useShoppingCart;