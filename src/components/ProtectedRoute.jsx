import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ role }) => {
  const { user, checkingAuth } = useContext(AuthContext);

  if (checkingAuth) {
    return <p className="text-center mt-5">Verificando sesión...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PrivateRoute;
