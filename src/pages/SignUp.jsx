import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

export const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (form.password.length < 12) {
      setError("Use a password with at least 12 characters.");
      return;
    }
    setPending(true);
    try {
      const auth = await registerUser(form);
      login(auth);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0C172C] flex justify-center items-center px-5 py-16">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">Evendule, connected to Jan's SQLite Events API (local demo).</p>
        </div>
        {error && <p role="alert" className="text-sm bg-red-50 border border-red-200 text-red-700 rounded p-3">{error}</p>}
        <label className="block text-gray-900 text-sm font-medium">
          Full name
          <input type="text" name="name" value={form.name} required minLength={2} maxLength={80}
            onChange={e => setForm(x => ({ ...x, name: e.target.value }))}
            className="block w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-900" />
        </label>
        <label className="block text-gray-900 text-sm font-medium">
          Email
          <input type="email" name="email" value={form.email} required autoComplete="email"
            onChange={e => setForm(x => ({ ...x, email: e.target.value }))}
            className="block w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-900" />
        </label>
        <label className="block text-gray-900 text-sm font-medium">
          Password (minimum 12 characters)
          <input type="password" name="password" value={form.password} required minLength={12} maxLength={128} autoComplete="new-password"
            onChange={e => setForm(x => ({ ...x, password: e.target.value }))}
            className="block w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-900" />
        </label>
        <button disabled={pending} type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 disabled:opacity-50">
          {pending ? "Creating account..." : "Create account"}
        </button>
        <p className="text-sm text-gray-600">
          Already registered? <Link to="/sign-in" className="text-blue-700 underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
};
