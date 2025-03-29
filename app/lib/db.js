// app/lib/db.js

/**
 * Database utility functions
 * In a production application, this would connect to a real database
 */

// Mock database for estimates
let estimates = [];
let orders = [];

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date to YYYY/MM/DD
const formatDate = (date = new Date()) => {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(date.getDate()).padStart(2, "0")}`;
};

// Save estimate
export const saveEstimate = (estimateData) => {
  const id = generateId();
  const newEstimate = {
    id,
    ...estimateData,
    createdAt: formatDate(),
  };
  estimates.push(newEstimate);
  return newEstimate;
};

// Get all estimates
export const getEstimates = () => {
  return estimates;
};

// Get estimate by id
export const getEstimateById = (id) => {
  return estimates.find((estimate) => estimate.id === id);
};

// Save order
export const saveOrder = (orderData) => {
  const id = generateId();
  const newOrder = {
    id,
    ...orderData,
    createdAt: formatDate(),
  };
  orders.push(newOrder);
  return newOrder;
};

// Get all orders
export const getOrders = () => {
  return orders;
};

// Get order by id
export const getOrderById = (id) => {
  return orders.find((order) => order.id === id);
};

// In a real application, you would have functions to connect to a database
// and perform CRUD operations on your data
