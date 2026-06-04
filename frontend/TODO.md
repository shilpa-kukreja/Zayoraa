# Checkout Page Fixes

## Backend Fixes
- [ ] Add order routes to backend/server.js
- [ ] Fix export in backend/routes/orderRoutes.js

## Frontend Fixes
- [ ] Fix SVG path typos in checkout/page.jsx (replace "极" with "0")
- [ ] Move submit button inside the form tag
- [ ] Move payment method radios inside the form
- [ ] Remove unused logger and request references
- [ ] Add Razorpay script loading in layout or checkout page
- [ ] Fix userId to use actual user ID (add auth to context or localStorage)
- [ ] Ensure API URLs match backend routes
- [ ] Create order-success page if missing

## Testing
- [ ] Test COD payment flow
- [ ] Test Razorpay payment flow
- [ ] Verify form validation
- [ ] Check for console errors
