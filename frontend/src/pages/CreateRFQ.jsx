import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateRFQ() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    quantity: "",
    delivery_location: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.product_name ||
      !form.description ||
      !form.quantity ||
      !form.delivery_location ||
      !form.deadline
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/rfqs", {
        product_name: form.product_name,
        description: form.description,
        quantity: Number(form.quantity),
        delivery_location: form.delivery_location,
        deadline: new Date(form.deadline).toISOString(),
      });

      navigate("/buyer");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to create RFQ. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-rfq-page">
      <div className="create-rfq-container">

        <button
          className="back-button"
          onClick={() => navigate("/buyer")}
        >
          ← Back to Dashboard
        </button>

        <div className="page-header">
          <h1>Create New RFQ</h1>
          <p>
            Tell suppliers exactly what your business needs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rfq-form">

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Product / Requirement</label>
            <input
              type="text"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              placeholder="e.g. Industrial Water Pumps"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you need..."
              rows="5"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 50"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Delivery Location</label>
              <input
                type="text"
                name="delivery_location"
                value={form.delivery_location}
                onChange={handleChange}
                placeholder="e.g. Gurugram, Haryana"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Quotation Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/buyer")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post RFQ →"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}