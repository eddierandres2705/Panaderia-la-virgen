# Contracts - Panadería de la Virgen - Full E-Commerce System

## Overview
Sistema completo de e-commerce para panadería con carrito de compras, pasarela de pagos Wompi (sandbox), panel administrativo, y integración WhatsApp.

---

## 1. DATABASE MODELS (MongoDB)

### 1.1 Users Collection (Admin Authentication)
```python
{
  "_id": ObjectId,
  "username": str,  # "Admin"
  "password_hash": str,  # bcrypt hash of "Aslandavid2705"
  "role": str,  # "admin"
  "created_at": datetime,
  "last_login": datetime
}
```

### 1.2 Products Collection
```python
{
  "_id": ObjectId,
  "name": str,
  "description": str,
  "category": str,  # "Pan", "Tortas", "Postres", "Galletas"
  "price": int,  # in COP centavos
  "image_url": str,
  "available": bool,  # True = available today, False = under order
  "featured": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 1.3 Orders Collection
```python
{
  "_id": ObjectId,
  "order_number": str,  # "ORD-20260603-001"
  "customer": {
    "name": str,
    "email": str,
    "phone": str,
    "document_type": str,  # for PSE
    "document_number": str
  },
  "items": [
    {
      "product_id": ObjectId,
      "product_name": str,
      "quantity": int,
      "unit_price": int,  # in centavos
      "subtotal": int
    }
  ],
  "subtotal": int,
  "total": int,  # in COP centavos
  "currency": "COP",
  "status": str,  # "pending_payment", "paid", "processing", "completed", "cancelled", "failed"
  "payment_method": str,  # "card", "pse", "cash"
  "delivery_type": str,  # "pickup", "delivery"
  "delivery_date": datetime,
  "notes": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 1.4 Transactions Collection
```python
{
  "_id": ObjectId,
  "order_id": ObjectId,
  "idempotency_key": str,  # "order-{order_id}-{method}-{timestamp}"
  "provider": "WOMPI",
  "provider_transaction_id": str,
  "payment_method_type": str,  # "CARD", "PSE"
  "payment_method_details": {
    "scheme": str,  # "VISA", "MASTERCARD", null
    "pse_bank_code": str,  # null for cards
    "pse_bank_name": str
  },
  "amount": int,  # in centavos
  "currency": "COP",
  "status": str,  # "PENDING", "APPROVED", "DECLINED", "FAILED", "ERROR"
  "status_history": [
    {
      "from": str,
      "to": str,
      "at": datetime,
      "source": str,  # "backend", "wompi_webhook"
      "reason": str
    }
  ],
  "raw_provider_response": {
    "init": dict,
    "webhook": dict
  },
  "acceptance_token": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 1.5 Reviews Collection
```python
{
  "_id": ObjectId,
  "customer_name": str,
  "rating": int,  # 1-5
  "comment": str,
  "date": str,
  "approved": bool,
  "created_at": datetime
}
```

### 1.6 Gallery Collection (Portfolio de trabajos)
```python
{
  "_id": ObjectId,
  "title": str,
  "description": str,
  "image_url": str,
  "category": str,
  "featured": bool,
  "created_at": datetime
}
```

---

## 2. BACKEND API ENDPOINTS

### 2.1 Authentication (/api/auth)
- `POST /api/auth/login` - Admin login
  - Body: `{ username, password }`
  - Returns: `{ token, user: { username, role } }`
  
- `POST /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ valid: bool, user }`

### 2.2 Products (/api/products)
- `GET /api/products` - List all products (public)
  - Query params: `?category=Tortas&available=true&featured=true`
  
- `GET /api/products/:id` - Get product detail (public)
  
- `POST /api/products` - Create product (admin only)
  - Requires auth token
  
- `PUT /api/products/:id` - Update product (admin only)
  
- `DELETE /api/products/:id` - Delete product (admin only)

### 2.3 Orders (/api/orders)
- `POST /api/orders` - Create new order (public)
  - Body: `{ customer, items, delivery_type, delivery_date, notes }`
  - Returns: `{ order_id, order_number, total }`
  
- `GET /api/orders/:id` - Get order detail (public with order_id)
  
- `GET /api/orders` - List all orders (admin only)
  - Query: `?status=pending_payment&date_from=2026-01-01`
  
- `PATCH /api/orders/:id/status` - Update order status (admin only)
  - Body: `{ status: "processing" | "completed" | "cancelled" }`

### 2.4 Payments (/api/payments)
- `GET /api/payments/wompi/acceptance` - Get Wompi acceptance token
  - Returns: `{ acceptance_token, terms_url }`
  
- `POST /api/payments/card/init` - Initialize card payment
  - Body: `{ order_id, customer_email, customer_name, acceptance_token }`
  - Returns: `{ checkout_url, transaction_id }`
  
- `GET /api/payments/pse/banks` - Get PSE bank list
  - Returns: `[ { financial_institution_code, financial_institution_name } ]`
  
- `POST /api/payments/pse/init` - Initialize PSE payment
  - Body: `{ order_id, customer_email, customer_name, person_type, document_type, document_number, bank_code, acceptance_token }`
  - Returns: `{ redirect_url, transaction_id }`
  
- `GET /api/payments/transactions/:id` - Get transaction status
  - Returns: `{ transaction_id, order_id, status, amount, payment_method_type }`

### 2.5 Webhooks (/api/webhooks)
- `POST /api/webhooks/wompi` - Wompi webhook receiver
  - Headers: `wompi_hash` (HMAC signature)
  - Body: Wompi event payload
  - Validates signature, updates transaction & order status

### 2.6 Reviews (/api/reviews)
- `GET /api/reviews` - List approved reviews (public)
  
- `POST /api/reviews` - Submit review (public)
  - Body: `{ customer_name, rating, comment }`
  
- `PATCH /api/reviews/:id/approve` - Approve review (admin only)

### 2.7 Gallery (/api/gallery)
- `GET /api/gallery` - List gallery items (public)
  
- `POST /api/gallery` - Add gallery item (admin only)
  
- `DELETE /api/gallery/:id` - Delete gallery item (admin only)

### 2.8 Dashboard Stats (/api/dashboard)
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)
  - Returns: `{ total_orders, total_revenue, pending_orders, completed_orders_today }`

---

## 3. FRONTEND PAGES & COMPONENTS

### 3.1 Public Pages
1. **Home (/)** - Already implemented with hero, products, reviews, timeline
   
2. **Products (/productos)** - NEW
   - Full catalog with filters (category, availability)
   - Add to cart functionality
   
3. **Cart (/carrito)** - NEW
   - View cart items
   - Update quantities
   - Remove items
   - Proceed to checkout
   
4. **Checkout (/checkout)** - NEW
   - Customer information form
   - Delivery options (pickup/delivery, date)
   - Payment method selection (Card/PSE/Cash on delivery)
   - Order notes
   
5. **Payment (/payment)** - NEW
   - Accept Wompi terms
   - For Card: Show Wompi checkout redirect
   - For PSE: Bank selection + redirect
   
6. **Payment Result (/payment/result)** - NEW
   - Poll transaction status
   - Show success/pending/failed states
   - Display order summary
   
7. **Order Tracking (/order/:id)** - NEW
   - Public order status page
   - Track order progress
   
8. **Gallery (/galeria)** - NEW
   - Portfolio of custom cakes/works
   - Image grid with lightbox

### 3.2 Admin Pages
9. **Admin Login (/admin/login)** - NEW
   - Username/password form
   - JWT authentication
   
10. **Admin Dashboard (/admin/dashboard)** - NEW
    - Stats cards (orders, revenue, etc.)
    - Recent orders list
    - Quick actions
    
11. **Admin Orders (/admin/orders)** - NEW
    - Orders table with filters
    - Status management
    - Order details modal
    
12. **Admin Products (/admin/products)** - NEW
    - Products CRUD table
    - Add/Edit product modal
    - Toggle availability
    
13. **Admin Reviews (/admin/reviews)** - NEW
    - Pending reviews list
    - Approve/reject actions
    
14. **Admin Gallery (/admin/gallery)** - NEW
    - Upload gallery images
    - Manage portfolio items

### 3.3 New Components
- **CartContext** - React context for cart state management
- **CartButton** - Header cart icon with item count
- **ProductCard** - Product display with Add to Cart
- **CartItem** - Cart item row
- **CheckoutForm** - Multi-step checkout
- **PaymentMethodSelector** - Card/PSE/Cash selector
- **PSEBankSelector** - PSE bank dropdown
- **OrderStatusTracker** - Visual order progress
- **AdminLayout** - Admin sidebar + content layout
- **OrdersTable** - Admin orders management table
- **ProductsTable** - Admin products CRUD table
- **StatsCard** - Dashboard statistics card

---

## 4. MOCK DATA TO REMOVE AFTER BACKEND INTEGRATION

### From /app/frontend/src/mock.js:
- `products` array → Replace with API call to `/api/products`
- `reviews` array → Replace with API call to `/api/reviews`
- `timeline` array → Keep as static (historical data)
- `contactInfo` object → Keep as static (business info)

### New mock data to add temporarily:
- Shopping cart (localStorage until backend)
- Order creation (localStorage until backend)
- Payment status (simulate with timeouts)

---

## 5. WOMPI INTEGRATION SPECIFICS

### 5.1 Environment Variables (.env)
```bash
# Existing
MONGO_URL=...
REACT_APP_BACKEND_URL=...

# New - Wompi Sandbox
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_WEBHOOK_SECRET=secret_test_...
WOMPI_BASE_URL=https://sandbox.wompi.co/v1
WOMPI_MERCHANT_ID=...

# WhatsApp
WHATSAPP_NUMBER=+573023981490

# Admin Auth
JWT_SECRET=random_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400
```

### 5.2 Payment Flow
1. Customer completes cart → Creates order in DB (status: "pending_payment")
2. Customer chooses payment method → Frontend calls `/api/payments/{card|pse}/init`
3. Backend creates transaction record → Calls Wompi API
4. Wompi returns checkout/redirect URL → Frontend redirects customer
5. Customer completes payment on Wompi/Bank → Wompi sends webhook to backend
6. Backend validates webhook signature → Updates transaction & order status
7. Frontend polls transaction status → Shows result to customer

### 5.3 Wompi Webhook Validation
- Read raw request body as bytes
- Compute HMAC-SHA256(body, WOMPI_WEBHOOK_SECRET)
- Compare with `wompi_hash` header using constant-time comparison
- If valid: update transaction & order status in MongoDB
- Return 200 OK immediately

---

## 6. WHATSAPP INTEGRATION

### Simple WhatsApp Button Integration:
- When order is created, show "Confirmar por WhatsApp" button
- Opens WhatsApp with pre-filled message:
  ```
  Hola! Quiero confirmar mi pedido #ORD-20260603-001
  Total: $55.000 COP
  Productos:
  - Torta de cumpleaños x1
  - Pan fresco x2
  ```
- WhatsApp URL format: `https://wa.me/573023981490?text={encoded_message}`

---

## 7. IMPLEMENTATION PHASES

### Phase 1: Backend Foundation ✅ (TO DO)
- Setup MongoDB models
- Implement JWT authentication
- Create Products CRUD endpoints
- Create Orders endpoints
- Basic error handling

### Phase 2: Wompi Integration ✅ (TO DO)
- Call integration_playbook_expert_v2 (DONE)
- Implement Wompi acceptance token endpoint
- Implement card payment init
- Implement PSE payment init
- Implement webhook receiver with signature validation
- Transaction status endpoint

### Phase 3: Frontend Cart & Checkout ✅ (TO DO)
- CartContext + localStorage
- Products page with filters
- Cart page
- Checkout multi-step form
- Payment method selector
- WhatsApp integration button

### Phase 4: Admin Panel ✅ (TO DO)
- Admin authentication
- Admin layout component
- Dashboard with stats
- Orders management
- Products management
- Reviews approval

### Phase 5: Testing & Polish ✅ (TO DO)
- Backend testing with deep_testing_backend_v2
- Frontend testing with auto_frontend_testing_agent
- End-to-end payment flow testing (sandbox)
- Webhook testing with ngrok/tunnel
- Mobile responsiveness check
- Update test_credentials.md

---

## 8. FILE STRUCTURE

```
/app/
├── backend/
│   ├── server.py (main FastAPI app)
│   ├── config.py (Pydantic settings)
│   ├── db.py (MongoDB connection)
│   ├── models/ (Pydantic models)
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── transaction.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── payments.py
│   │   ├── webhooks.py
│   │   ├── reviews.py
│   │   └── admin.py
│   └── utils/
│       ├── auth.py (JWT helpers, password hashing)
│       ├── wompi.py (Wompi API client)
│       └── validators.py
│
├── frontend/src/
│   ├── pages/
│   │   ├── Home.jsx (existing)
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Payment.jsx
│   │   ├── PaymentResult.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── Gallery.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Orders.jsx
│   │       ├── Products.jsx
│   │       └── Reviews.jsx
│   ├── components/
│   │   ├── Header.jsx (update with cart button)
│   │   ├── Footer.jsx (existing)
│   │   ├── Logo.jsx (existing)
│   │   ├── CartButton.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── CheckoutForm.jsx
│   │   ├── PaymentMethodSelector.jsx
│   │   ├── PSEBankSelector.jsx
│   │   ├── OrderStatusTracker.jsx
│   │   ├── WhatsAppButton.jsx
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       ├── StatsCard.jsx
│   │       ├── OrdersTable.jsx
│   │       └── ProductsTable.jsx
│   ├── contexts/
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx (admin)
│   ├── hooks/
│   │   ├── useCart.js
│   │   └── useAuth.js
│   ├── utils/
│   │   ├── api.js (axios instance with interceptors)
│   │   └── formatters.js (currency, dates)
│   └── mock.js (existing - to be replaced)
│
├── memory/
│   ├── test_credentials.md (update with admin credentials)
│   └── PRD.md (if needed)
│
└── contracts.md (this file)
```

---

## 9. IMPORTANT NOTES

1. **All amounts stored as integers in centavos** (e.g., $55.000 COP = 5500000 centavos)
2. **Idempotency keys** prevent duplicate transactions
3. **Status history** maintains complete audit trail
4. **Webhook must respond quickly** (< 5 seconds) - use background tasks for heavy processing
5. **Frontend cart** uses localStorage until checkout (then creates order in DB)
6. **Admin credentials**: Username: `Admin`, Password: `Aslandavid2705`
7. **WhatsApp number**: +57 3023981490
8. **Wompi sandbox mode**: All payments are test transactions
9. **All timestamps in UTC**
10. **CORS**: Allow frontend origin in FastAPI middleware

---

## 10. SUCCESS CRITERIA

✅ Customer can browse products and add to cart  
✅ Customer can checkout and create order  
✅ Customer can pay with Card (Wompi sandbox)  
✅ Customer can pay with PSE (Wompi sandbox)  
✅ Webhook correctly updates order status  
✅ Customer receives WhatsApp link to confirm  
✅ Admin can login securely  
✅ Admin can view and manage orders  
✅ Admin can manage products catalog  
✅ Admin can approve reviews  
✅ All pages are responsive  
✅ Backend tests pass  
✅ Frontend tests pass  
✅ Payment flow works end-to-end in sandbox  

---

END OF CONTRACTS
