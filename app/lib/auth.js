// Client-side authentication utility

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("isLoggedIn") === "true";
};

// Get current user data
export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user data:", e);
    return null;
  }
};

// Login user
export const login = (userData) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify(userData));
};

// Logout user
export const logout = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
};

// Auth protection for client components
export const withAuth = (Component) => {
  return (props) => {
    if (typeof window !== "undefined") {
      const authenticated = isAuthenticated();

      if (!authenticated) {
        // Redirect to login page
        window.location.href = "/";
        return null;
      }

      return <Component {...props} />;
    }

    // Server-side rendering or loading state
    return <div>Loading...</div>;
  };
};
