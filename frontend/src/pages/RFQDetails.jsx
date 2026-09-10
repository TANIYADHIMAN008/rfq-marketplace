import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  MapPin,
  Package,
  Clock,
  User,
  MessageSquare,
  Loader2,
  CheckCircle,
} from "lucide-react";

import api from "../services/api";

function RFQDetails() {
  const { rfq_id } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [rfqResponse, quotationResponse] = await Promise.all([
        api.get(`/rfqs/${rfq_id}`),
        api.get(`/quotations/rfq/${rfq_id}`),
      ]);

      setRfq(rfqResponse.data);
      setQuotations(quotationResponse.data);
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to load RFQ details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // ACCEPT QUOTATION
  // ---------------------------------------------------------
  const handleAcceptQuotation = async (quotationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this quotation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setAcceptingId(quotationId);
      setError("");

      const response = await api.patch(
        `/quotations/${quotationId}/accept`
      );

      // Update all quotation statuses in the UI
      setQuotations((currentQuotations) =>
        currentQuotations.map((quotation) => ({
          ...quotation,
          status:
            quotation.id === quotationId
              ? response.data.status
              : "Pending",
        }))
      );

    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to accept quotation."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [rfq_id]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="details-state">
        <Loader2 size={30} className="spin" />
        <p>Loading RFQ...</p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------
  if (error && !rfq) {
    return (
      <div className="details-state">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          className="back-button"
          onClick={() => navigate("/buyer")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!rfq) {
    return null;
  }

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

        <button
          className="logout-button"
          onClick={() => navigate("/buyer")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

      </header>


      {/* CONTENT */}

      <main className="dashboard-container">

        <button
          className="back-button"
          onClick={() => navigate("/buyer")}
        >
          <ArrowLeft size={17} />
          Back to My RFQs
        </button>


        {/* RFQ HEADER */}

        <section className="details-card">

          <div className="details-header">

            <div className="details-icon">
              <FileText size={30} />
            </div>

            <div>

              <span className="rfq-id">
                RFQ #{rfq.id}
              </span>

              <h1>
                {rfq.product_name}
              </h1>

            </div>

          </div>


          <div className="details-description">

            <h3>Requirement</h3>

            <p>
              {rfq.description}
            </p>

          </div>


          {/* INFORMATION */}

          <div className="details-info-grid">

            <div className="info-box">

              <Package size={21} />

              <div>
                <span>Quantity</span>
                <strong>{rfq.quantity}</strong>
              </div>

            </div>


            <div className="info-box">

              <MapPin size={21} />

              <div>
                <span>Delivery Location</span>

                <strong>
                  {rfq.delivery_location}
                </strong>

              </div>

            </div>


            <div className="info-box">

              <Clock size={21} />

              <div>

                <span>Deadline</span>

                <strong>
                  {new Date(
                    rfq.deadline
                  ).toLocaleString()}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* QUOTATIONS */}

        <section className="quotation-section">

          <div className="section-heading">

            <div>

              <h2>
                Supplier Quotations
              </h2>

              <p>
                Compare offers from suppliers.
              </p>

            </div>

            <div className="quotation-count">
              {quotations.length}
            </div>

          </div>


          {/* ACCEPT ERROR */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {quotations.length === 0 ? (

            <div className="state-card">

              <MessageSquare size={42} />

              <h3>
                No quotations yet
              </h3>

              <p>
                Suppliers haven't submitted
                quotations for this RFQ yet.
              </p>

            </div>

          ) : (

            <div className="quotation-grid">

              {quotations.map((quotation) => (

                <div
                  className="quotation-card"
                  key={quotation.id}
                >

                  {/* SUPPLIER */}

                  <div className="quotation-top">

                    <div className="supplier-icon">
                      <User size={21} />
                    </div>

                    <div>

                      <span>
                        Supplier #{quotation.supplier_id}
                      </span>

                      <h3>
                        Supplier Quotation
                      </h3>

                    </div>

                  </div>


                  {/* PRICE */}

                  <div className="quotation-price">

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


                  {/* DELIVERY */}

                  <div className="quotation-details">

                    <div>

                      <Clock size={17} />

                      <span>
                        Delivery
                      </span>

                      <strong>
                        {quotation.estimated_delivery_time}
                        {" "}
                        days
                      </strong>

                    </div>

                  </div>


                  {/* MESSAGE */}

                  {quotation.message && (

                    <div className="quotation-message">

                      <MessageSquare size={17} />

                      <p>
                        "{quotation.message}"
                      </p>

                    </div>

                  )}


                  {/* ACCEPT */}

                  <div className="quotation-actions">

                    {quotation.status === "Accepted" ? (

                      <button
                        className="accept-button accepted-button"
                        disabled
                      >
                        <CheckCircle size={18} />
                        Quotation Accepted
                      </button>

                    ) : (

                      <button
                        className="accept-button"
                        onClick={() =>
                          handleAcceptQuotation(
                            quotation.id
                          )
                        }
                        disabled={
                          acceptingId === quotation.id
                        }
                      >

                        {acceptingId === quotation.id ? (

                          <>
                            <Loader2
                              size={18}
                              className="spin"
                            />
                            Accepting...
                          </>

                        ) : (

                          "Accept Quotation"

                        )}

                      </button>

                    )}

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

export default RFQDetails;