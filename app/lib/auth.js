// app/lib/auth.js

/**
 * Basic authentication utility functions
 * In a production application, you would use more secure methods and connect to a database
 */

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
};

// Get user data
export const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }
  return null;
};

// Log out user
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }
};

// Mock login function (in a real app, this would validate against a backend)
export const login = (username, password) => {
  if (username && password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
    return true;
  }
  return false;
};
