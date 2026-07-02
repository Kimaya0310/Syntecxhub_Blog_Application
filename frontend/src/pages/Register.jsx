import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="byline mb-3">Join the masthead</div>
      <h1 className="font-display text-3xl font-semibold mb-8">Create your account</h1>

      {error && (
        <div className="mb-5 border border-rust/30 bg-rust/5 text-rust text-sm px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-ink/60 mb-1.5">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Ada Lovelace"
          />
        </div>
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
            placeholder="At least 6 characters"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-moss hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
