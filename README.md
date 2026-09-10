# RFQ Marketplace

A full-stack B2B Request for Quotation (RFQ) Marketplace that connects buyers with suppliers.

Buyers can create and manage procurement requests, while suppliers can discover relevant RFQs and submit competitive quotations. Buyers can review supplier offers and accept the quotation that best meets their requirements.

---

## 🚀 Features

### Authentication & Authorization

- User registration and login
- Buyer and Supplier roles
- JWT-based authentication
- Protected routes
- Role-based access control (RBAC)
- Secure password hashing
- Unauthorized access protection

### Buyer Features

- Create new RFQs
- Edit existing RFQs
- Delete RFQs
- View all personal RFQs
- View RFQ details
- View supplier quotations
- Compare quotation prices and delivery times
- Accept a supplier quotation
- Track quotation status

### Supplier Features

- Browse available RFQs
- Search RFQs by product/service
- Filter RFQs by delivery location
- View RFQ details
- Submit quotations
- Specify quoted price
- Specify estimated delivery time
- Add a message to the buyer
- View submitted quotations
- Track quotation status

### RFQ Management

Each RFQ contains:

- Product / Service name
- Description
- Quantity
- Delivery location
- Submission deadline
- Creation timestamp

### Quotation Management

Each quotation contains:

- Supplier
- Quoted price
- Estimated delivery time
- Supplier message
- Status
- Creation timestamp
- Updated timestamp

Quotation statuses:

- `Pending`
- `Accepted`

Only the buyer who created an RFQ can accept quotations for that RFQ.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib / password hashing
- Uvicorn

### Database

- SQLite

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               │
                    ┌──────────▼──────────┐
                    │     FastAPI Backend │
                    │                     │
                    │ Authentication      │
                    │ RBAC                │
                    │ RFQ APIs             │
                    │ Quotation APIs       │
                    └──────────┬──────────┘
                               │
                               │ SQLAlchemy
                               │
                    ┌──────────▼──────────┐
                    │       SQLite        │
                    │                     │
                    │ Users               │
                    │ RFQs                │
                    │ Quotations          │
                    └─────────────────────┘

📁 Project Structure
rfq-marketplace/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── rfq.py
│   │   │   └── quotation.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── rfqs.py
│   │   │   ├── quotations.py
│   │   │   └── test_auth.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── rfq.py
│   │   │   └── quotation.py
│   │   │
│   │   ├── utils/
│   │   │   └── security.py
│   │   │
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── config.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

🔐 Authentication Flow
User registers as either a Buyer or Supplier.
Backend validates the registration data.
Password is securely hashed before storage.
User logs in with email and password.
Backend generates a JWT access token.
Frontend stores the authentication token.
Axios automatically attaches the token to API requests.
Backend validates the JWT for protected endpoints.
Role-based dependencies restrict Buyer and Supplier operations.

👤 Buyer Workflow
Register / Login
       ↓
Buyer Dashboard
       ↓
Create RFQ
       ↓
Publish RFQ
       ↓
Suppliers discover RFQ
       ↓
Receive Quotations
       ↓
Compare Supplier Offers
       ↓
Accept Quotation
       ↓
Quotation Status = Accepted

🏭 Supplier Workflow
Register / Login
       ↓
Supplier Dashboard
       ↓
Browse RFQs
       ↓
Search / Filter
       ↓
View RFQ Details
       ↓
Submit Quotation
       ↓
Quotation Status = Pending
       ↓
Buyer Reviews Quotation
       ↓
Accepted / Remains Pending

🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login user
RFQs
Method	Endpoint	Description
POST	/rfqs	Create RFQ
GET	/rfqs	Browse RFQs
GET	/rfqs/my	Get buyer's RFQs
GET	/rfqs/{rfq_id}	Get RFQ details
PUT	/rfqs/{rfq_id}	Update RFQ
DELETE	/rfqs/{rfq_id}	Delete RFQ
Quotations
Method	Endpoint	Description
POST	/quotations/rfq/{rfq_id}	Submit quotation
GET	/quotations/my	Get supplier's quotations
GET	/quotations/rfq/{rfq_id}	Get quotations for buyer's RFQ
PATCH	/quotations/{quotation_id}/accept	Accept quotation
Health
Method	Endpoint	Description
GET	/	API status
GET	/health	Health check
💻 Local Setup
Prerequisites

Make sure you have installed:

Python 3.10+
Node.js
npm
Git
1. Clone the repository
git clone https://github.com/TANIYADHIMAN008/rfq-marketplace.git
cd rfq-marketplace
2. Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create your environment file:

.env

Add your secret configuration according to the backend configuration used by the application.

Start the FastAPI server:

python -m uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
3. Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend will run at:

http://localhost:5173
🔒 Environment Variables

Sensitive credentials are intentionally excluded from the repository.

Create:

backend/.env

and configure the required secret values for your local environment.

The .env file is ignored by Git using .gitignore.

🧪 Example Use Case
Buyer

A buyer needs 20 office chairs for their office in Gurugram.

The buyer creates:

Product: Office Chairs
Quantity: 20
Delivery Location: Gurugram, Haryana
Deadline: Required delivery deadline

Suppliers can then discover the RFQ and submit quotations.

Example quotation:

Quoted Price: ₹100,000
Estimated Delivery: 5 days

Message:
We can supply all 20 office chairs with installation support.

The buyer can review the quotation and accept it.

🛡️ Security Considerations

The application includes:

JWT authentication
Password hashing
Protected API endpoints
Buyer/Supplier role-based authorization
Ownership checks for RFQs
Ownership checks before quotation acceptance
Request validation using Pydantic
Protected environment variables
Duplicate quotation prevention
Deadline validation before quotation submission
📱 UI / UX

The application provides:

Responsive layouts
Buyer dashboard
Supplier dashboard
RFQ cards
Quotation cards
Search and filtering
Loading states
Error states
Empty states
Confirmation before accepting quotations
Clear quotation status indicators
🚀 Deployment

The application is designed to be deployed as:

React Frontend
      ↓
Vercel

FastAPI Backend
      ↓
Render

Deployment URLs will be added here after deployment.

Live Demo
Frontend: Coming soon
Backend API: Coming soon
Swagger Docs: Coming soon
🔮 Future Improvements

Potential future improvements include:

PostgreSQL for production
Supplier profiles
Buyer and supplier ratings
Email notifications
Real-time quotation updates
File/document attachments
RFQ closing workflow
Advanced supplier filtering
Admin dashboard
Analytics and reporting
Pagination
Automated quotation comparison
Production-grade logging and monitoring
👩‍💻 Author

Taniya Dhiman

BSc Computer Science

GitHub:

https://github.com/TANIYADHIMAN008

📄 License

This project was developed as a technical assignment / portfolio project.


### Then save it

```text
Ctrl + S

Your structure becomes:

rfq-marketplace/
├── backend/
├── frontend/
├── .gitignore
└── README.md        ← NEW 🔥
Then push the README to GitHub

From:

C:\Users\DRP\Desktop\rfq-marketplace

run:

git add README.md

then:

git commit -m "Add project documentation"

then:

git push


