import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

// This is used for displaying the components that requires users login
const PrivateRoute = ({ component: Component, ...props }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;
  console.log(isAuthenticated);
  return !isAuthenticated && !loading ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
