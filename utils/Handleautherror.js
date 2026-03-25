export function handleAuthError(status, message) {
  // 1. Clear session
  sessionStorage.removeItem("adminToken");

  // 2. Pick a clear, user-facing message
  let reason;

  if (status === 401) {
    if (message === "Token missing") {
      reason = "You are not logged in. Please log in to continue.";
    } else {
      // "Invalid token" covers both expired and tampered tokens
      reason = "Your session has expired. Please log in again.";
    }
  } else if (status === 403) {
    reason = "Access denied. You do not have permission to perform this action.";
  } else {
    reason = "Authentication error. Please log in again.";
  }

  // 3. Save so AdminLogin can pick it up on mount
  sessionStorage.setItem("authError", reason);

  // 4. Redirect — works outside React Router context too
  window.location.href = "/admin/login";
}