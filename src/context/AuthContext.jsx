import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;

    fetch(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((userData) => {
        if (isMounted) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Credenciales incorrectas");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);

    const userRes = await fetch(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
        Accept: "application/json",
      },
    });

    const userData = await userRes.json();
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        checkingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
