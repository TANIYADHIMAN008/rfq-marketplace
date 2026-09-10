import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "buyer") {
    return <Navigate to="/buyer" replace />;
  }

  if (user.role === "supplier") {
    return <Navigate to="/supplier" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default Dashboard;