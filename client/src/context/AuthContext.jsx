import React, {
  createContext,
  useState,
  useEffect,
} from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState("");

  const [accountType, setAccountType] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedAccountType =
      localStorage.getItem("accountType");

    const savedUser =
      localStorage.getItem("user");

    const savedOrganizer =
      localStorage.getItem("organizer");

    const savedAdmin =
      localStorage.getItem("admin");

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }

    if (savedAccountType) {
      setAccountType(savedAccountType);
    }

    if (savedAccountType === "user" && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (
      savedAccountType === "organizer" &&
      savedOrganizer
    ) {
      setUser(JSON.parse(savedOrganizer));
    }

    if (
      savedAccountType === "admin" &&
      savedAdmin
    ) {
      setUser(JSON.parse(savedAdmin));
    }

    setLoading(false);
  }, []);

  const login = (
    userData,
    jwtToken,
    role
  ) => {
    setUser(userData);
    setToken(jwtToken);
    setAccountType(role);
    setIsLoggedIn(true);

    localStorage.setItem("token", jwtToken);

    localStorage.setItem(
      "accountType",
      role
    );

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "username",
      userData.username
    );

    if (role === "user") {
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );
    }

    if (role === "organizer") {
      localStorage.setItem(
        "organizer",
        JSON.stringify(userData)
      );
    }

    if (role === "admin") {
      localStorage.setItem(
        "admin",
        JSON.stringify(userData)
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setAccountType("");
    setIsLoggedIn(false);

    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    localStorage.removeItem("organizer");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        accountType,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;