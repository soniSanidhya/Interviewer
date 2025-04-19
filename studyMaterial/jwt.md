# 📜 JWT (JSON Web Token) Notes

## ✅ What is JWT?

JWT (JSON Web Token) is a compact, URL-safe token used to securely transmit information between parties. It is commonly used for **authentication** and **authorization** in web applications.

A JWT consists of **three parts** separated by dots (`.`):

1. **Header**: Contains metadata about the token, such as the signing algorithm used.
2. **Payload**: Contains the claims or user data (e.g., name, role, etc.).
3. **Signature**: A cryptographic signature used to verify the token's integrity.

### Example JWT:

```
eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWtzaGF0IiwiYWdlIjoiMjAiLCJpYXQiOjE3A...signature
```

---

## ✨ JWT Methods

### 1. `jwt.sign(payload, secretKey, options)`

This method is used to **create a new JWT token**.

#### Parameters:

- **`payload`**: The user data (claims) you want to encode in the token.
- **`secretKey`**: The secret key used to sign the token.
- **`options`**: Optional settings to customize the token.

#### Common Options:

- **`algorithm`**: The signing algorithm (default: `HS256`). Other options include `HS512`, `RS256`, etc.
- **`expiresIn`**: Sets the token's expiration time. Supports time strings like `'1h'`, `'7d'`, `'30m'`, or seconds (`3600`).
- **`notBefore`**: Delays the token's validity until a specified time.
  ```javascript
  jwt.sign(payload, secretKey, { notBefore: "10s" }); // Token becomes valid after 10 seconds
  ```
- **`audience`**, **`issuer`**, **`subject`**: Custom claims for additional security.
  ```javascript
  jwt.sign(payload, secretKey, { audience: "myApp", issuer: "myCompany" });
  ```

#### Example:

```javascript
const token = jwt.sign({ name: "akshat", age: "20" }, secretKey, {
  algorithm: "HS512",
  expiresIn: "1h",
});
```

---

### 2. `jwt.verify(token, secretKey, options)`

This method is used to **validate the token** and ensure its integrity.

#### Checks Performed:

- Token expiration (`exp` claim).
- Token validity start time (`nbf` claim).
- Custom claims like `audience`, `issuer`, etc.

#### Error Handling:

```javascript
try {
  const decoded = jwt.verify(token, secretKey);
  // console.log("Valid Token:", decoded);
} catch (err) {
  console.error("Error:", err.message); // TokenExpiredError, JsonWebTokenError, NotBeforeError
}
```

---

### 3. `jwt.decode(token, options)`

This method **decodes the token without verifying its signature**. It is useful for debugging but **should never be used for authentication**.

#### Options:

- **`complete: true`**: Returns the full token (header, payload, and signature).

#### Example:

```javascript
// console.log(jwt.decode(token, { complete: true }));
```

#### Output:

```javascript
{
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { name: 'akshat', age: '20', iat: 1708720800, exp: 1708724400 },
  signature: 'abc123'
}
```

---

## 🚀 Token Expiration

JWT does not have a direct `expire()` function. Instead, expiration is handled by:

1. Setting the `expiresIn` option when signing the token.
2. Checking the `exp` claim during verification.

#### Manual Expiration Check:

```javascript
const decoded = jwt.decode(token);
const currentTime = Math.floor(Date.now() / 1000);
if (decoded.exp && decoded.exp < currentTime) {
  // console.log("Token expired");
}
```

---

## 🔥 Advanced Token Configuration

### Using `notBefore` for Delayed Activation

The `notBefore` option is useful when you want to **delay the activation** of a token. For example, you can issue a token that becomes valid after a certain period.

#### Example:

```javascript
jwt.sign(userDetail, secretKey, {
  algorithm: "HS512",
  expiresIn: "1h",
  notBefore: "10s", // Token becomes valid after 10 seconds
});
```

---

### Manual Control Over Token Claims

For more control over token activation and expiration, you can manually set the `iat` (issued at), `nbf` (not before), and `exp` (expiration) claims in the payload.

#### Example:

```javascript
const futureToken = jwt.sign(
  {
    name: "akshat",
    age: "20",
    iat: Math.floor(Date.now() / 1000), // Issued at: current time
    nbf: Math.floor(Date.now() / 1000) + 10, // Active after 10 seconds
    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
  },
  secretKey,
  { algorithm: "HS512" }
);
```

#### Explanation:

- **`iat`**: Sets the time when the token is issued.
- **`nbf`**: Sets the time when the token becomes valid.
- **`exp`**: Sets the time when the token expires.

---

## 🔑 Best Practices for Using JWTs

1. **Secure Secret Keys**:

   - Store secret keys securely using environment variables or secret management tools.
   - Avoid hardcoding keys in your codebase.

2. **Use HTTPS**:

   - Always transmit JWTs over HTTPS to prevent interception by attackers.

3. **Token Storage**:

   - Store tokens in **httpOnly cookies** to prevent access via JavaScript (XSS attacks).
   - Avoid storing tokens in local storage or session storage.

4. **Minimize Payload Size**:

   - Keep the payload small and avoid including sensitive information directly in the token.

5. **Token Expiration**:

   - Use short-lived tokens for better security.
   - Implement a refresh token mechanism to issue new tokens without requiring re-authentication.

6. **Token Revocation**:
   - Maintain a blacklist or use a token revocation mechanism to invalidate tokens when necessary.

---

## 🛠️ Common Use Cases for JWTs

1. **Authentication**:

   - JWTs are commonly used to authenticate users in web applications. After a user logs in, a JWT is issued and sent to the client. The client includes the token in subsequent requests to access protected resources.

2. **Authorization**:

   - JWTs can encode user roles and permissions, allowing the server to authorize access to specific resources based on the token's claims.

3. **Stateless Sessions**:

   - JWTs enable stateless authentication, meaning the server does not need to store session data. All necessary information is contained within the token.

4. **Single Sign-On (SSO)**:
   - JWTs are often used in SSO systems to share authentication data between multiple applications or services.

---

## 📚 Additional Resources

- [JWT Official Website](https://jwt.io/)
- [JWT RFC 7519 Specification](https://tools.ietf.org/html/rfc7519)
- [JWT Debugger Tool](https://jwt.io/#debugger)

---

By following these guidelines and best practices, you can effectively implement JWTs in your applications to ensure secure and efficient authentication and authorization. 🚀
