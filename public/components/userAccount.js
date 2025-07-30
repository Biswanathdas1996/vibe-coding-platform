/**
 * @file User account management component.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext'; // Assuming an auth context exists
import { useCart } from './cartContext'; // Assuming a cart context exists
import { db } from './firebase'; // Assuming Firebase setup
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from "firebase/firestore";

/**
 * User account management component.
 * @returns {JSX.Element} The user account component.
 */
const UserAccount = () => {
  const { user, logout } = useAuth();
  const { cart, addToCart, updateCart, removeFromCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "orders"), where("userId", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(orderData);
      } catch (error) {
        setError("Failed to fetch orders.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Assuming you have a users collection in your Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDocs(userRef);
        if (userSnap.exists()) {
            setProfile(userSnap.data());
        } else {
            setError("User Profile not found!");
        }

      } catch (error) {
          setError("Failed to fetch user profile");
          console.error("Error fetching profile:", error);
      } finally {
          setLoading(false);
      }
    };
      if (user) {
          fetchOrders();
          fetchProfile();
      }
  }, [user]);


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError("Logout failed.");
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = async (updatedProfile) => {
    try {
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updatedProfile);
        setProfile(updatedProfile);
    } catch (error) {
        setError("Failed to update profile!");
        console.error("Update Profile error:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleAddOrder = async (orderDetails) => {
    try {
        setLoading(true);
        const orderRef = await addDoc(collection(db, "orders"), {
            ...orderDetails,
            userId: user.uid,
            orderDate: new Date()
        });
        setOrders([...orders, {id: orderRef.id, ...orderDetails}])
    } catch (error) {
        setError("Failed to add order!");
        console.error("Add order error:", error);
    } finally {
        setLoading(false);
    }
  };



  if (!user) {
    return <p>Please log in.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Your Orders:</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>{JSON.stringify(order)}</li> // Replace with proper order display
        ))}
      </ul>
      <h2>Your Profile:</h2>
      {profile && (
          <div>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
              {/* Add other profile fields as needed */}
          </div>
      )}
      {/* Add form for updating profile */}
    </div>
  );
};

export default UserAccount;