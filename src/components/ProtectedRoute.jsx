import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user, role }) => {
  // Si no hay usuario, lo mandamos a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario existe pero no tiene el rol adecuado
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Si todo bien, renderiza las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;
