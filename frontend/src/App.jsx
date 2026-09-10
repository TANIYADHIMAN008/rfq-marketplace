import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import CreateRFQ from "./pages/CreateRFQ";
import RFQDetails from "./pages/RFQDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* General dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer dashboard */}
          <Route
            path="/buyer"
            element={
              <ProtectedRoute role="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Create RFQ */}
          <Route
            path="/buyer/create-rfq"
            element={
              <ProtectedRoute role="buyer">
                <CreateRFQ />
              </ProtectedRoute>
            }
          />

          {/* RFQ Details */}
          <Route
            path="/buyer/rfq/:rfq_id"
            element={
              <ProtectedRoute role="buyer">
                <RFQDetails />
              </ProtectedRoute>
            }
          />

          {/* Supplier dashboard */}
          <Route
            path="/supplier"
            element={
              <ProtectedRoute role="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;