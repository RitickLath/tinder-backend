# OTP AUTHENTICATION API REFERENCE

## 1. GENERATE OTP

**Endpoint**: `POST /auth/generate-otp`  
**Description**: Generates a unique 5-digit OTP for login or signup and stores it in the database.

### REQUEST BODY

```json
{
  "phone": "+91XXXXXXXXXX",
  "type": "signup" / "login"
}
```

- `phone` (string): Valid Indian number starting with +91 and 10 digits.
- `type` (string): Must be either `"signup"` or `"login"`.

### SUCCESS RESPONSE – 201

```json
{
  "data": { "otp": 12345 },
  "success": true,
  "message": "OTP sent successfully. Please verify within 5 minutes.",
  "error": {}
}
```

## 2. VERIFY OTP

**Endpoint**: `POST /auth/verify-otp`
**Description**: Verifies the OTP and issues a token. Sets a secure cookie.

### REQUEST BODY

```json
{
  "phone": "+91XXXXXXXXXX",
  "otp": 12345,
  "type": "signup" | "login"
}
```

- `phone` (string): Same validation as above.
- `otp` (number): Must be 5 digits.
- `type` (string): `"signup"` or `"login"`.

### SUCCESS RESPONSE – 200

```json
{
  "data": { "token": "<JWT>" },
  "success": true,
  "message": "OTP verified successfully.",
  "error": {}
}
```

- Sets cookie:

  - `tempToken` (signup): Expires in 15 minutes.
  - `authToken` (login): Expires in 10 days.

## 3. LOGOUT

**Endpoint**: `POST /auth/logout`
**Description**: Logs the user out by clearing the `authToken` cookie.

### SUCCESS RESPONSE – 200

```json
{
  "data": {},
  "success": true,
  "message": "User Logged Out.",
  "error": ""
}
```
