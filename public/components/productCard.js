/**
 * @module components/productCard
 */

import React, { useState, useEffect } from 'react';

/**
 * @function ProductCard
 * @param {object} props - The component's properties.
 * @param {object} props.product - The product data.
 * @param {string} props.product.id - The product ID.
 * @param {string} props.product.name - The product name.
 * @param {string} props.product.description - The product description.
 * @param {string} props.product.imageUrl - The URL of the product image.
 * @param {number} props.product.price - The product price.
 * @param {number} props.product.stock - The product stock quantity.
 * @param {function} props.addToCart - The function to add the product to the cart.
 * @returns {JSX.Element} The product card component.
 */
const ProductCard = ({ product, addToCart }) => {
  const [inStock, setInStock] = useState(product.stock > 0);

  useEffect(() => {
    //Simulate stock updates - replace with actual API call in production
    const intervalId = setInterval(() => {
      const updatedStock = Math.max(0, product.stock - Math.floor(Math.random() * 2));
      setInStock(updatedStock > 0);
      //update product.stock in a more robust manner in a real application (e.g. via API call)
    }, 5000); //check stock every 5 seconds

    return () => clearInterval(intervalId);
  }, [product.stock]);

  const handleAddToCart = async () => {
    if (!inStock) {
      alert('Product is out of stock!');
      return;
    }
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again later.');
    }
  };


  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>${product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart} disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;