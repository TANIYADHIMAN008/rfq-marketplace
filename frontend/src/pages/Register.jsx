import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to create account."
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
            Create your business marketplace account.
          </p>
        </div>

        <div className="auth-heading">
          <h2>Create account</h2>
          <p>Choose how you want to use the marketplace.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Full name</label>

          <div className="input-wrapper">
            <User size={18} />

            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <label>I want to</label>

          <div className="role-selector">

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={form.role === "buyer"}
                onChange={handleChange}
              />

              <span>
                <strong>Buy</strong>
                <small>Post requirements and receive quotes</small>
              </span>
            </label>

            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="supplier"
                checked={form.role === "supplier"}
                onChange={handleChange}
              />

              <span>
                <strong>Supply</strong>
                <small>Discover RFQs and submit quotations</small>
              </span>
            </label>

          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Register;