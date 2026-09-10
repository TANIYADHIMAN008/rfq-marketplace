import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Lock, Mail, ArrowRight } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(
        form.email,
        form.password
      );

      if (user.role === "buyer") {
        navigate("/buyer");
      } else {
        navigate("/supplier");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="brand">
          <div className="brand-icon">
            <ShoppingBag size={28} />
          </div>

          <h1>RFQ Marketplace</h1>

          <p>
            Connect buyers with trusted suppliers.
          </p>
        </div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your marketplace.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <div className="input-wrapper">
            <Mail size={18} />

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-wrapper">
            <Lock size={18} />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?

          <Link to="/register">
            Create account
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;