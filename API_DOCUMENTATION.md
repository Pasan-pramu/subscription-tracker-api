# Subscription Tracker API Documentation

## Overview
This is a comprehensive REST API for managing subscriptions. It provides endpoints for user authentication, user management, subscription management, and automated reminder workflows.

**Base URL:** `http://localhost:5500/api/v1`

---

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [User Routes](#user-routes)
3. [Subscription Routes](#subscription-routes)
4. [Workflow Routes](#workflow-routes)
5. [Common Response Formats](#common-response-formats)
6. [Error Handling](#error-handling)

---

## Authentication Routes

### 1. Sign Up (Create New User Account)
**Endpoint:** `POST /auth/sign-up`

**Description:** Create a new user account with name, email, and password. Returns a JWT token for authentication.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Pasan Pramuditha",
  "email": "pasan.test+01@gmail.com",
  "password": "Str0ngP@ssw0rd!"
}
```

**Request Body Details:**
- `name` (string, required): User's full name (2-50 characters)
- `email` (string, required): User's email address (must be unique and valid format)
- `password` (string, required): User's password (minimum 6 characters)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67890abcdef123456789",
      "name": "Pasan Pramuditha",
      "email": "pasan.test+01@gmail.com",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    }
  }
}
```

**Error Responses:**
- `409 Conflict`: User already exists with that email
- `400 Bad Request`: Invalid data format or missing required fields
- `429 Too Many Requests`: Bot detection triggered (Too many requests from your IP)

**Note:** If you're getting "bot detected" errors, it means you're making too many requests too quickly. The Arcjet protection is preventing rapid-fire requests. Wait a moment between requests or check your firewall/proxy settings.

---

### 2. Sign In (Login)
**Endpoint:** `POST /auth/sign-in`

**Description:** Authenticate an existing user and receive a JWT token for accessing protected routes.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "pasan.test+01@gmail.com",
  "password": "Str0ngP@ssw0rd!"
}
```

**Request Body Details:**
- `email` (string, required): User's registered email
- `password` (string, required): User's password

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67890abcdef123456789",
      "name": "Pasan Pramuditha",
      "email": "pasan.test+01@gmail.com",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: User with this email doesn't exist
- `401 Unauthorized`: Invalid password
- `429 Too Many Requests`: Bot detection triggered

---

### 3. Sign Out
**Endpoint:** `POST /auth/sign-out`

**Description:** Sign out the current user (currently not fully implemented).

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed out successfully"
}
```

---

## User Routes

### 1. Get All Users
**Endpoint:** `GET /users/`

**Description:** Retrieve a list of all users in the system. No authentication required.

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67890abcdef123456789",
      "name": "Pasan Pramuditha",
      "email": "pasan.test+01@gmail.com",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "67890abcdef987654321",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "createdAt": "2026-01-06T11:00:00.000Z",
      "updatedAt": "2026-01-06T11:00:00.000Z",
      "__v": 0
    }
  ]
}
```

**Note:** Password field is excluded from all user responses for security.

---

### 2. Get Specific User by ID
**Endpoint:** `GET /users/:id`

**Description:** Retrieve a specific user's details by their ID. Requires authentication.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the user

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Example URL:**
```
GET /users/67890abcdef123456789
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "67890abcdef123456789",
    "name": "Pasan Pramuditha",
    "email": "pasan.test+01@gmail.com",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**
- `404 Not Found`: User with this ID doesn't exist
- `401 Unauthorized`: No valid authentication token provided
- `429 Too Many Requests`: Bot detection triggered

---

### 3. Create New User (Alternative Route)
**Endpoint:** `POST /users/`

**Description:** Create a new user via this route (alternative to /auth/sign-up).

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@gmail.com",
  "password": "SecureP@ss123"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67890abcdef987654321",
      "name": "Jane Smith",
      "email": "jane.smith@gmail.com",
      "createdAt": "2026-01-06T11:00:00.000Z",
      "updatedAt": "2026-01-06T11:00:00.000Z",
      "__v": 0
    }
  }
}
```

---

### 4. Update User by ID
**Endpoint:** `PUT /users/:id`

**Description:** Update a user's profile information. Requires authentication.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the user

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Pasan Updated",
  "email": "pasan.updated@gmail.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "67890abcdef123456789",
    "name": "Pasan Updated",
    "email": "pasan.updated@gmail.com",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T14:30:00.000Z",
    "__v": 0
  }
}
```

---

### 5. Delete User by ID
**Endpoint:** `DELETE /users/:id`

**Description:** Delete a user account. Requires authentication.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the user

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Example URL:**
```
DELETE /users/67890abcdef123456789
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: User with this ID doesn't exist
- `401 Unauthorized`: No valid authentication token provided

---

## Subscription Routes

### 1. Get All Subscriptions
**Endpoint:** `GET /subscriptions/`

**Description:** Retrieve a list of all subscriptions in the system. No authentication required.

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "Credit Card",
      "status": "active",
      "startDate": "2025-01-06T00:00:00.000Z",
      "renewalDate": "2026-02-06T00:00:00.000Z",
      "user": "67890abcdef123456789",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### 2. Get Specific Subscription by ID
**Endpoint:** `GET /subscriptions/:id`

**Description:** Retrieve details of a specific subscription by its ID.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the subscription

**Request Headers:**
```
Content-Type: application/json
```

**Example URL:**
```
GET /subscriptions/12345subscriptionid1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "12345subscriptionid1",
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "status": "active",
    "startDate": "2025-01-06T00:00:00.000Z",
    "renewalDate": "2026-02-06T00:00:00.000Z",
    "user": "67890abcdef123456789",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T10:30:00.000Z",
    "__v": 0
  }
}
```

---

### 3. Create New Subscription
**Endpoint:** `POST /subscriptions/`

**Description:** Create a new subscription for the authenticated user. Automatically triggers a reminder workflow.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2025-01-06T00:00:00.000Z"
}
```

**Request Body Details:**
- `name` (string, required): Subscription name (2-100 characters)
- `price` (number, required): Price of subscription (must be > 0)
- `currency` (string, optional): Currency code - "USD", "EUR", "GBP" (default: "USD")
- `frequency` (string, required): Billing frequency - "daily", "weekly", "monthly", "yearly"
- `category` (string, required): Category - "sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"
- `paymentMethod` (string, required): Payment method description
- `startDate` (date, required): Subscription start date (must be in the past)
- `renewalDate` (date, optional): Renewal date (auto-calculated if not provided)
- `status` (string, optional): "active", "cancelled", "expired" (default: "active")

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "Credit Card",
      "status": "active",
      "startDate": "2025-01-06T00:00:00.000Z",
      "renewalDate": "2026-02-06T00:00:00.000Z",
      "user": "67890abcdef123456789",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    },
    "workflowRunId": "workflow123456789"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: No valid authentication token provided
- `400 Bad Request`: Invalid data or missing required fields
- `429 Too Many Requests`: Bot detection triggered

---

### 4. Update Subscription by ID
**Endpoint:** `PUT /subscriptions/:id`

**Description:** Update an existing subscription's details.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the subscription

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Netflix Premium (Updated)",
  "price": 18.99,
  "status": "active"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "_id": "12345subscriptionid1",
    "name": "Netflix Premium (Updated)",
    "price": 18.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "status": "active",
    "startDate": "2025-01-06T00:00:00.000Z",
    "renewalDate": "2026-02-06T00:00:00.000Z",
    "user": "67890abcdef123456789",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T14:30:00.000Z",
    "__v": 0
  }
}
```

---

### 5. Delete Subscription by ID
**Endpoint:** `DELETE /subscriptions/:id`

**Description:** Delete a subscription from the system.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the subscription

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Example URL:**
```
DELETE /subscriptions/12345subscriptionid1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

---

### 6. Get All Subscriptions for a Specific User
**Endpoint:** `GET /subscriptions/user/:id`

**Description:** Retrieve all subscriptions belonging to a specific user.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the user

**Request Headers:**
```
Content-Type: application/json
```

**Example URL:**
```
GET /subscriptions/user/67890abcdef123456789
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "Credit Card",
      "status": "active",
      "startDate": "2025-01-06T00:00:00.000Z",
      "renewalDate": "2026-02-06T00:00:00.000Z",
      "user": "67890abcdef123456789",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "12345subscriptionid2",
      "name": "Spotify Premium",
      "price": 12.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "PayPal",
      "status": "active",
      "startDate": "2025-06-06T00:00:00.000Z",
      "renewalDate": "2026-07-06T00:00:00.000Z",
      "user": "67890abcdef123456789",
      "createdAt": "2026-01-06T11:00:00.000Z",
      "updatedAt": "2026-01-06T11:00:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### 7. Cancel a Subscription
**Endpoint:** `GET /subscriptions/:id/cancel`

**Description:** Cancel a specific subscription by changing its status to 'cancelled'.

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId of the subscription

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Example URL:**
```
GET /subscriptions/12345subscriptionid1/cancel
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "_id": "12345subscriptionid1",
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "status": "cancelled",
    "startDate": "2025-01-06T00:00:00.000Z",
    "renewalDate": "2026-02-06T00:00:00.000Z",
    "user": "67890abcdef123456789",
    "createdAt": "2026-01-06T10:30:00.000Z",
    "updatedAt": "2026-01-06T14:30:00.000Z",
    "__v": 0
  }
}
```

---

### 8. Get Upcoming Renewals
**Endpoint:** `GET /subscriptions/upcoming-renewals`

**Description:** Retrieve all subscriptions that are due for renewal soon.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "Credit Card",
      "status": "active",
      "startDate": "2025-01-06T00:00:00.000Z",
      "renewalDate": "2026-02-06T00:00:00.000Z",
      "user": "67890abcdef123456789",
      "createdAt": "2026-01-06T10:30:00.000Z",
      "updatedAt": "2026-01-06T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

---

## Workflow Routes

### 1. Send Subscription Reminders
**Endpoint:** `POST /workflows/subscription/reminder`

**Description:** Trigger an automated workflow to send email reminders for upcoming subscription renewals. This is typically called automatically when a new subscription is created.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "subscriptionId": "12345subscriptionid1"
}
```

**Request Body Details:**
- `subscriptionId` (string, required): MongoDB ObjectId of the subscription

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reminder workflow triggered successfully",
  "data": {
    "workflowRunId": "workflow123456789",
    "subscriptionId": "12345subscriptionid1",
    "status": "scheduled"
  }
}
```

**Error Responses:**
- `404 Not Found`: Subscription with this ID doesn't exist
- `500 Internal Server Error`: Workflow service error

---

## Common Response Formats

### Success Response Structure
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data varies based on endpoint
  }
}
```

### Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 429 | Too Many Requests | Bot detection triggered - Rate limited |
| 500 | Internal Server Error | Server error |

### Common Error Messages

**Bot Detection Error:**
```json
{
  "success": false,
  "message": "Bot detected",
  "error": "RATE_LIMIT_EXCEEDED",
  "statusCode": 429
}
```

**Solutions for "Bot Detected" errors:**
1. Wait 30-60 seconds between requests
2. Check if you have a VPN/proxy enabled that might be sending multiple requests
3. Ensure you're not running automated scripts that make rapid requests
4. If using Postman, disable any auto-sync features
5. Clear your browser cache and cookies
6. Check your internet connection for proxy interference

**Authentication Error:**
```json
{
  "success": false,
  "message": "No authentication token provided",
  "error": "UNAUTHORIZED",
  "statusCode": 401
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Email already exists",
  "error": "VALIDATION_ERROR",
  "statusCode": 409
}
```

---

## Authentication

Most protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get a token:**
1. Sign up using `POST /auth/sign-up` or `POST /auth/sign-in`
2. Copy the `token` from the response
3. Add it to the `Authorization` header for protected routes

**Token Expiration:**
Tokens expire after a set period (default is usually 7 days). You'll need to sign in again to get a new token.

---

## Complete Example Workflow

### Step 1: Create a User Account
```
POST http://localhost:5500/api/v1/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67890abcdef123456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Step 2: Create a Subscription (Use token from Step 1)
```
POST http://localhost:5500/api/v1/subscriptions/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2025-01-06T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      "price": 15.99,
      // ... other fields
    },
    "workflowRunId": "workflow123456789"
  }
}
```

### Step 3: Retrieve User's Subscriptions
```
GET http://localhost:5500/api/v1/subscriptions/user/67890abcdef123456789
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "12345subscriptionid1",
      "name": "Netflix Premium",
      // ... subscription details
    }
  ]
}
```

---

## Arcjet Protection

All routes are protected by Arcjet, which includes:
- **Rate Limiting:** Prevents too many requests from the same IP
- **Bot Detection:** Detects and blocks automated attacks
- **Geo-blocking:** Can restrict access by location (optional)

**Tips to avoid bot detection:**
- Space out your requests (wait 1-2 seconds between requests)
- Use reasonable request patterns (don't send 100 requests per second)
- Disable any browser extensions that might be making background requests
- Ensure your client IP is consistent (avoid rapid VPN switching)

---

## Testing with Postman

### Step-by-Step Guide:

1. **Import the Collection:**
   - Create a new Postman Collection called "Subscription Tracker API"

2. **Create Environment Variables:**
   - `base_url`: http://localhost:5500/api/v1
   - `token`: (leave empty, will be filled after sign-up)
   - `user_id`: (leave empty, will be filled after sign-up)
   - `subscription_id`: (leave empty, will be filled after creating subscription)

3. **Test Sign-Up:**
   - Request: `POST {{base_url}}/auth/sign-up`
   - Body: Raw JSON with name, email, password
   - After response, copy the token and set `{{token}}` environment variable

4. **Test Create Subscription:**
   - Request: `POST {{base_url}}/subscriptions/`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: Subscription data

5. **Test Other Routes:**
   - Use the saved token in the Authorization header for protected routes

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Passwords are hashed with bcrypt and never returned in responses
- Renewal dates are auto-calculated if not provided when creating a subscription
- Subscriptions are automatically marked as 'expired' if renewal date has passed
- Keep your authentication token secure and don't share it
- The API uses MongoDB ObjectIds for all resource IDs


