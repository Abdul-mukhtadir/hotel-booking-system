import {
  createContext,
  useState,
  useEffect,
} from "react";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem(
      "user"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;