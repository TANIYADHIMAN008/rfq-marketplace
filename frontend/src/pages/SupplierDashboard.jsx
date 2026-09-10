import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Clock,
  FileText,
  Send,
  LogOut,
  IndianRupee,
  X,
  CheckCircle,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function SupplierDashboard() {
  const { user, logout } = useAuth();

  const [rfqs, setRfqs] = useState([]);
  const [myQuotations, setMyQuotations] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [quotationLoading, setQuotationLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const [quoteForm, setQuoteForm] = useState({
    quoted_price: "",
    estimated_delivery_time: "",
    message: "",
  });

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState("");

  // ============================================================
  // FETCH RFQs
  // ============================================================

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      const response = await api.get("/rfqs", {
        params,
      });

      setRfqs(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load available RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH MY QUOTATIONS
  // ============================================================

  const fetchMyQuotations = async () => {
    try {
      setQuotationLoading(true);

      const response = await api.get("/quotations/my");

      setMyQuotations(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setQuotationLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
    fetchMyQuotations();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchRFQs();
  };

  const clearFilters = async () => {
    setSearch("");
    setLocation("");

    try {
      setLoading(true);

      const response = await api.get("/rfqs");

      setRfqs(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OPEN RFQ
  // ============================================================

  const openRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    setShowQuoteForm(false);
    setQuoteSuccess("");
    setQuoteForm({
      quoted_price: "",
      estimated_delivery_time: "",
      message: "",
    });
  };

  const closeRFQ = () => {
    setSelectedRFQ(null);
    setShowQuoteForm(false);
    setQuoteSuccess("");
  };

  // ============================================================
  // QUOTATION FORM
  // ============================================================

  const handleQuoteChange = (event) => {
    setQuoteForm({
      ...quoteForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitQuote = async (event) => {
    event.preventDefault();

    if (!selectedRFQ) return;

    try {
      setQuoteLoading(true);
      setError("");
      setQuoteSuccess("");

      await api.post(
        `/quotations/rfq/${selectedRFQ.id}`,
        {
          quoted_price: Number(
            quoteForm.quoted_price
          ),
          estimated_delivery_time: Number(
            quoteForm.estimated_delivery_time
          ),
          message: quoteForm.message,
        }
      );

      setQuoteSuccess(
        "Quotation submitted successfully!"
      );

      setQuoteForm({
        quoted_price: "",
        estimated_delivery_time: "",
        message: "",
      });

      await fetchMyQuotations();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to submit quotation."
      );
    } finally {
      setQuoteLoading(false);
    }
  };

  // ============================================================
  // CHECK IF ALREADY QUOTED
  // ============================================================

  const hasQuoted = (rfqId) => {
    return myQuotations.some(
      (quotation) =>
        quotation.rfq_id === rfqId
    );
  };

  return (
    <div className="supplier-page">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="dashboard-navbar">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            RFQ
          </div>

          <div>
            <strong>
              RFQ Marketplace
            </strong>

            <span>
              Supplier Portal
            </span>
          </div>

        </div>

        <div className="dashboard-user">

          <div className="user-info">

            <strong>
              {user?.name}
            </strong>

            <span>
              {user?.email}
            </span>

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


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-heading">

          <div>

            <h1>
              Supplier Dashboard
            </h1>

            <p>
              Discover business requirements and
              submit competitive quotations.
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <FileText size={22} />
            </div>

            <div>

              <span>
                Available RFQs
              </span>

              <strong>
                {rfqs.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              <Send size={22} />
            </div>

            <div>

              <span>
                My Quotations
              </span>

              <strong>
                {myQuotations.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              <CheckCircle size={22} />
            </div>

            <div>

              <span>
                Submitted
              </span>

              <strong>
                {myQuotations.length}
              </strong>

            </div>

          </div>

        </div>


        {/* ====================================================
            SEARCH
        ==================================================== */}

        <section className="supplier-search-section">

          <div className="section-heading">

            <div>

              <h2>
                Browse RFQs
              </h2>

              <p>
                Find requirements that match
                your business.
              </p>

            </div>

          </div>


          <form
            className="supplier-search"
            onSubmit={handleSearch}
          >

            <div className="search-input">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search product or service..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            <div className="search-input">

              <MapPin size={18} />

              <input
                type="text"
                placeholder="Filter by location..."
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />

            </div>


            <button
              type="submit"
              className="create-button"
            >
              <Search size={18} />
              Search
            </button>


            {(search || location) && (
              <button
                type="button"
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

          </form>

        </section>


        {/* ====================================================
            RFQ LIST
        ==================================================== */}

        <section className="rfq-section">

          <div className="section-heading">

            <div>

              <h2>
                Available Requirements
              </h2>

              <p>
                Submit your best quotation to buyers.
              </p>

            </div>

          </div>


          {loading ? (

            <div className="state-card">
              <Clock size={35} />
              <p>
                Loading available RFQs...
              </p>
            </div>

          ) : rfqs.length === 0 ? (

            <div className="state-card">

              <FileText size={42} />

              <h3>
                No RFQs found
              </h3>

              <p>
                Try changing your search or
                location filters.
              </p>

            </div>

          ) : (

            <div className="supplier-rfq-grid">

              {rfqs.map((rfq) => (

                <div
                  className="supplier-rfq-card"
                  key={rfq.id}
                >

                  <div className="supplier-rfq-top">

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


                  <div className="supplier-rfq-info">

                    <div>

                      <Package size={16} />

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {rfq.quantity}
                      </strong>

                    </div>


                    <div>

                      <MapPin size={16} />

                      <span>
                        Location
                      </span>

                      <strong>
                        {rfq.delivery_location}
                      </strong>

                    </div>


                    <div>

                      <Clock size={16} />

                      <span>
                        Deadline
                      </span>

                      <strong>
                        {new Date(
                          rfq.deadline
                        ).toLocaleString()}
                      </strong>

                    </div>

                  </div>


                  <div className="supplier-rfq-actions">

                    <button
                      className="view-rfq-button"
                      onClick={() =>
                        openRFQ(rfq)
                      }
                    >
                      View Details
                    </button>

                    {hasQuoted(rfq.id) ? (

                      <span className="quoted-badge">
                        <CheckCircle size={15} />
                        Quoted
                      </span>

                    ) : (

                      <button
                        className="quote-button"
                        onClick={() =>
                          openRFQ(rfq)
                        }
                      >
                        <Send size={16} />
                        Submit Quote
                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ====================================================
            MY QUOTATIONS
        ==================================================== */}

        <section className="quotation-section supplier-my-quotes">

          <div className="section-heading">

            <div>

              <h2>
                My Quotations
              </h2>

              <p>
                Quotations you have submitted.
              </p>

            </div>

            <div className="quotation-count">
              {myQuotations.length}
            </div>

          </div>


          {quotationLoading ? (

            <div className="state-card">
              Loading your quotations...
            </div>

          ) : myQuotations.length === 0 ? (

            <div className="state-card">

              <Send size={40} />

              <h3>
                No quotations yet
              </h3>

              <p>
                Browse available RFQs and submit
                your first quotation.
              </p>

            </div>

          ) : (

            <div className="supplier-quotes-grid">

              {myQuotations.map(
                (quotation) => (

                  <div
                    className="supplier-quote-card"
                    key={quotation.id}
                  >

                    <div className="supplier-quote-header">

                      <div className="supplier-icon">
                        <Send size={20} />
                      </div>

                      <div>

                        <span>
                          RFQ #{quotation.rfq_id}
                        </span>

                        <h3>
                          My Quotation
                        </h3>

                      </div>

                    </div>


                    <div className="supplier-quote-price">

                      <span>
                        Quoted Price
                      </span>

                      <strong>
                        ₹
                        {Number(
                          quotation.quoted_price
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>


                    <div className="supplier-quote-delivery">

                      <Clock size={17} />

                      <span>
                        Estimated Delivery
                      </span>

                      <strong>
                        {
                          quotation.estimated_delivery_time
                        }{" "}
                        days
                      </strong>

                    </div>


                    {quotation.message && (

                      <p className="supplier-quote-message">
                        "{quotation.message}"
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* ======================================================
          RFQ DETAILS MODAL
      ====================================================== */}

      {selectedRFQ && (

        <div
          className="modal-overlay"
          onClick={closeRFQ}
        >

          <div
            className="rfq-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeRFQ}
            >
              <X size={20} />
            </button>


            <div className="modal-icon">
              <FileText size={27} />
            </div>


            <span className="rfq-id">
              RFQ #{selectedRFQ.id}
            </span>


            <h2>
              {selectedRFQ.product_name}
            </h2>


            <div className="modal-description">

              <h3>
                Requirement
              </h3>

              <p>
                {selectedRFQ.description}
              </p>

            </div>


            <div className="modal-info-grid">

              <div>
                <Package size={18} />
                <span>Quantity</span>
                <strong>
                  {selectedRFQ.quantity}
                </strong>
              </div>


              <div>
                <MapPin size={18} />
                <span>Location</span>
                <strong>
                  {selectedRFQ.delivery_location}
                </strong>
              </div>


              <div>
                <Clock size={18} />
                <span>Deadline</span>
                <strong>
                  {new Date(
                    selectedRFQ.deadline
                  ).toLocaleString()}
                </strong>
              </div>

            </div>


            {!showQuoteForm ? (

              <div className="modal-actions">

                {hasQuoted(selectedRFQ.id) ? (

                  <div className="already-quoted">
                    <CheckCircle size={18} />
                    You have already submitted
                    a quotation for this RFQ.
                  </div>

                ) : (

                  <button
                    className="quote-button full"
                    onClick={() =>
                      setShowQuoteForm(true)
                    }
                  >
                    <Send size={17} />
                    Submit Quotation
                  </button>

                )}

              </div>

            ) : (

              <form
                className="quote-form"
                onSubmit={handleSubmitQuote}
              >

                <h3>
                  Submit Your Quotation
                </h3>


                {quoteSuccess && (
                  <div className="success-message">
                    {quoteSuccess}
                  </div>
                )}


                <div className="form-group">

                  <label>
                    Quoted Price (₹)
                  </label>

                  <div className="quote-input-wrapper">

                    <IndianRupee size={17} />

                    <input
                      type="number"
                      name="quoted_price"
                      min="1"
                      step="0.01"
                      placeholder="e.g. 125000"
                      value={
                        quoteForm.quoted_price
                      }
                      onChange={handleQuoteChange}
                      required
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Estimated Delivery Time (days)
                  </label>

                  <input
                    type="number"
                    name="estimated_delivery_time"
                    min="1"
                    placeholder="e.g. 7"
                    value={
                      quoteForm.estimated_delivery_time
                    }
                    onChange={handleQuoteChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Message
                  </label>

                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Add a message for the buyer..."
                    value={
                      quoteForm.message
                    }
                    onChange={handleQuoteChange}
                  />

                </div>


                <div className="quote-form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      setShowQuoteForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="quote-button"
                    disabled={quoteLoading}
                  >
                    {quoteLoading
                      ? "Submitting..."
                      : "Submit Quotation"}
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default SupplierDashboard;