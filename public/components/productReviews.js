/**
 * @fileoverview Component for displaying and submitting product reviews.
 */

import React, { useState, useEffect } from 'react';

/**
 * Product review component.
 * @param {object} props - Component properties.
 * @param {number} props.productId - ID of the product.
 * @param {function} props.onSubmit - Function to submit the review.
 * @returns {JSX.Element} The product review component.
 */
const ProductReviews = ({ productId, onSubmit }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch existing reviews (replace with actual API call)
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        setError('Failed to load reviews.');
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!newReview || rating === 0) {
      setError('Please provide a review and rating.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, rating, review: newReview }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newReviewData = await response.json();
      setReviews([...reviews, newReviewData]);
      setNewReview('');
      setRating(0);
    } catch (error) {
      setError('Failed to submit review.');
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      <h2>Reviews</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {reviews.map((review) => (
        <div key={review.id}>
          <p>Rating: {review.rating}</p>
          <p>{review.review}</p>
        </div>
      ))}
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
            <option value={0}>Select rating</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
        <br />
        <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} />
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ProductReviews;