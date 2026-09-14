# Client-Side Login Authentication System (Task 4)

A robust, secure client-side authentication system built with **vanilla HTML5, CSS3, and JavaScript**, persisting state via `localStorage` / `sessionStorage`, and utilizing the browser's native **Web Crypto API** (SubtleCrypto) for salted **SHA-256** password hashing.

---

## Feature Checklist Verification

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Registration page** | `register.html` with fields for username, email, password, confirm password, and a "Register" button. | Verified |
| **Password validation** | Enforces minimum 8 characters and at least 1 number (`/^(?=.*\d).{8,}$/`) with live checklist indicators. | Verified |
| **Duplicate check** | Case-insensitive duplicate check on both username and email before registration. Displays a clear error banner. | Verified |
| **Login page** | `login.html` with fields for username/email and password, with a "Login" button and password visibility toggle. | Verified |
| **Incorrect credential handling** | Unified generic error message: *"Invalid username/email or password"*. Does not disclose whether the user exists or which field was wrong. | Verified |
| **Protected / Dashboard page** | `dashboard.html` is guarded at page load. Direct unauthorized access redirects immediately to `login.html` with context. | Verified |
| **Logout button** | Header and footer logout controls on `dashboard.html` that clear the active session from storage and redirect to `login.html`. | Verified |
| **No plain-text passwords** | Passwords are cryptographically salted (128-bit random salt via `crypto.getRandomValues`) and hashed using SHA-256 via `crypto.subtle.digest`. Only `{ salt, passwordHash }` are stored. | Verified |
| **Basic form validation** | Client-side validation prevents empty submissions on both registration and login forms with field-level alerts. | Verified |

---

## File Structure

```
login-auth-system/
├── index.html            # Gateway route (directs to dashboard if logged in, else login)
├── login.html            # Login interface with unified credential feedback
├── register.html         # Registration interface with real-time requirement checklist
├── dashboard.html        # Protected user dashboard with session stats and logout
├── test-runner.html      # Automated test runner suite verifying all features
├── css/
│   └── styles.css        # Responsive, modern design system with accessible states
├── js/
│   ├── crypto.js         # Web Crypto API salted SHA-256 hashing & random salt generator
│   ├── storage.js        # Data layer for users array and session management in localStorage
│   ├── auth.js           # Core business logic: validate, register, authenticate, requireAuth, logout
│   ├── login.js          # Controller for login view & URL notifications
│   ├── register.js       # Controller for registration view & live checklist
│   └── dashboard.js      # Controller for dashboard view & profile rendering
└── README.md             # Project documentation and testing guide
```

---

## How to Run & Test

### Option 1: Direct Browser Opening
Simply double-click or open any of the HTML files in your browser:
- Open [`index.html`](file:///C:/Users/kalya/.gemini/antigravity/scratch/login-auth-system/index.html) to access the entry point.
- Open [`test-runner.html`](file:///C:/Users/kalya/.gemini/antigravity/scratch/login-auth-system/test-runner.html) to run the automated test suite.

### Option 2: Automated Test Suite
Open [`test-runner.html`](file:///C:/Users/kalya/.gemini/antigravity/scratch/login-auth-system/test-runner.html) in any browser. The suite automatically executes 17 test assertions covering:
1. Short password rejection (< 8 characters)
2. Missing digit password rejection
3. Valid password acceptance (>= 8 characters, >= 1 digit)
4. Cryptographic salt generation (128-bit random hex)
5. Deterministic SHA-256 hashing
6. Distinct hash output per unique salt
7. Empty field prevention on registration (username, email, password)
8. Plain-text password prevention in `localStorage`
9. Duplicate username rejection
10. Duplicate email rejection
11. Empty field prevention on login
12. Generic error for nonexistent users
13. Generic error for incorrect passwords (matching nonexistent user error)
14. Successful credential verification
15. Session persistence in client storage
16. Email-based login verification
17. Logout and complete session destruction

---

## Security Considerations

1. **Client-Side Storage Context**: This system is designed as a client-side architecture using browser `localStorage`. In an enterprise production system, authentication credentials should be validated against a protected backend server (e.g., Node.js/Express or Python Flask with bcrypt and HTTP-only cookies).
2. **Cryptographic Salting**: Even in this client-side implementation, passwords are never stored in plain text. Every user is assigned a unique, cryptographically random salt generated via `crypto.getRandomValues(new Uint8Array(16))`.
3. **Information Leakage Prevention**: When an invalid credential is submitted, the system displays the identical generic message (*"Invalid username/email or password"*) regardless of whether the account exists or if the password was incorrect, neutralizing user enumeration vectors.
