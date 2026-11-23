// Client-side checks improve UX. The Express API validates all inputs again.
export function validate({ email, password }) {
  const errors = {};
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (typeof password !== "string" || password.length === 0) {
    errors.password = "Password is required.";
  }
  return errors;
}
