import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="byline mb-3">Welcome back</div>
      <h1 className="font-display text-3xl font-semibold mb-8">Sign in to Marginalia</h1>

      {error && (
        <div className="mb-5 border border-rust/30 bg-rust/5 text-rust text-sm px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New to Marginalia?{" "}
        <Link to="/register" className="text-moss hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
