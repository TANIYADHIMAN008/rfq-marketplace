import { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  Trash2,
  Edit,
  Eye,
  LogOut,
  X,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    quantity: "",
    delivery_location: "",
    deadline: "",
  });

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs/my");

      setRfqs(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load your RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const resetForm = () => {
    setForm({
      product_name: "",
      description: "",
      quantity: "",
      delivery_location: "",
      deadline: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);

      await api.post("/rfqs", {
        product_name: form.product_name,
        description: form.description,
        quantity: Number(form.quantity),
        delivery_location: form.delivery_location,
        deadline: form.deadline,
      });

      resetForm();
      await fetchRfqs();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to create RFQ."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rfq) => {
    let formattedDeadline = "";

    if (rfq.deadline) {
      const date = new Date(rfq.deadline);

      if (!Number.isNaN(date.getTime())) {
        const localDate = new Date(
          date.getTime() -
          date.getTimezoneOffset() * 60000
        );

        formattedDeadline = localDate
          .toISOString()
          .slice(0, 16);
      }
    }

    setForm({
      product_name: rfq.product_name || "",
      description: rfq.description || "",
      quantity: rfq.quantity || "",
      delivery_location: rfq.delivery_location || "",
      deadline: formattedDeadline,
    });

    setEditingId(rfq.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingId) return;

    try {
      setError("");
      setSaving(true);

      await api.put(`/rfqs/${editingId}`, {
        product_name: form.product_name,
        description: form.description,
        quantity: Number(form.quantity),
        delivery_location: form.delivery_location,
        deadline: form.deadline,
      });

      resetForm();
      await fetchRfqs();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update RFQ."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this RFQ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/rfqs/${id}`);

      setRfqs((current) =>
        current.filter((rfq) => rfq.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to delete RFQ."
      );
    }
  };

  const handleFormSubmit = (event) => {
    if (editingId) {
      return handleUpdate(event);
    }

    return handleCreate(event);
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <header className="dashboard-navbar">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            RFQ
          </div>

          <div>
            <strong>RFQ Marketplace</strong>
            <span>Buyer Portal</span>
          </div>

        </div>

        <div className="dashboard-user">

          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="dashboard-container">

        <div className="dashboard-heading">

          <div>
            <h1>Buyer Dashboard</h1>

            <p>
              Manage your business requirements and
              receive supplier quotations.
            </p>
          </div>

          <button
            className="create-button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
                setEditingId(null);
              }
            }}
          >
            {showForm ? (
              <>
                <X size={19} />
                Close Form
              </>
            ) : (
              <>
                <Plus size={19} />
                Create RFQ
              </>
            )}
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <FileText size={22} />
            </div>

            <div>
              <span>Total RFQs</span>
              <strong>{rfqs.length}</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              <Clock size={22} />
            </div>

            <div>
              <span>Active RFQs</span>

              <strong>
                {
                  rfqs.filter(
                    (rfq) =>
                      new Date(rfq.deadline) > new Date()
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              <CheckCircle size={22} />
            </div>

            <div>
              <span>Requirements</span>
              <strong>{rfqs.length}</strong>
            </div>

          </div>

        </div>


        {/* CREATE / EDIT FORM */}

        {showForm && (
          <section className="form-card">

            <div className="section-heading">

              <div>

                <h2>
                  {editingId
                    ? `Edit RFQ #${editingId}`
                    : "Create New RFQ"}
                </h2>

                <p>
                  {editingId
                    ? "Update your business requirement."
                    : "Tell suppliers what your business needs."}
                </p>

              </div>

            </div>


            <form onSubmit={handleFormSubmit}>

              <div className="form-grid">

                <div className="form-group full">

                  <label>
                    Product / Service Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    placeholder="e.g. Industrial Water Pumps"
                    value={form.product_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group full">

                  <label>
                    Requirement Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Describe your requirement..."
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    placeholder="e.g. 50"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Delivery Location
                  </label>

                  <input
                    type="text"
                    name="delivery_location"
                    placeholder="e.g. Gurugram, Haryana"
                    value={form.delivery_location}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group full">

                  <label>
                    RFQ Deadline
                  </label>

                  <input
                    type="datetime-local"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="form-actions">

                <button
                  type="submit"
                  className="submit-rfq-button"
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : editingId ? (
                    <>
                      <CheckCircle size={18} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Publish RFQ
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </section>
        )}


        {/* RFQS */}

        <section className="rfq-section">

          <div className="section-heading">

            <div>

              <h2>My RFQs</h2>

              <p>
                Requirements you have posted.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="state-card">
              Loading your RFQs...
            </div>

          ) : rfqs.length === 0 ? (

            <div className="state-card">

              <FileText size={40} />

              <h3>No RFQs yet</h3>

              <p>
                Create your first business requirement
                to start receiving quotations.
              </p>

              <button
                className="create-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                Create your first RFQ
              </button>

            </div>

          ) : (

            <div className="rfq-grid">

              {rfqs.map((rfq) => (

                <div
                  className="rfq-card"
                  key={rfq.id}
                >

                  <div className="rfq-card-top">

                    <div className="rfq-icon">
                      <FileText size={20} />
                    </div>

                    <span className="rfq-id">
                      RFQ #{rfq.id}
                    </span>

                  </div>


                  <h3>
                    {rfq.product_name}
                  </h3>


                  <p className="rfq-description">
                    {rfq.description}
                  </p>


                  <div className="rfq-details">

                    <div>
                      <span>Quantity</span>
                      <strong>{rfq.quantity}</strong>
                    </div>

                    <div>
                      <span>Location</span>

                      <strong>
                        {rfq.delivery_location}
                      </strong>
                    </div>

                  </div>


                  <div className="rfq-deadline">

                    <Clock size={16} />

                    Deadline:

                    <strong>
                      {new Date(
                        rfq.deadline
                      ).toLocaleString()}
                    </strong>

                  </div>


                  <div className="rfq-actions">

                    <button
                      className="view-button"
                      onClick={() =>
                        navigate(`/buyer/rfq/${rfq.id}`)
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>


                    <button
                      className="edit-button"
                      onClick={() => handleEdit(rfq)}
                      title="Edit RFQ"
                    >
                      <Edit size={16} />
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(rfq.id)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default BuyerDashboard;