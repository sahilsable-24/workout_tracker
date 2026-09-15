import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => register(email, password),
    onSuccess: () => {
      navigate("/login");
    },
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMatchError("Passwords don't match");
      return;
    }

    setMatchError("");
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-graphite text-chalk flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="text-xs text-steel mb-2">Get started</p>
        <h1 className="font-display text-2xl font-medium mb-8">Create account</h1>

        <div className="mb-5">
          <label className="block text-xs text-steel mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs text-steel mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-steel mb-1.5">Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
          />
        </div>

        {matchError && (
          <p className="text-brick text-sm mb-4">{matchError}</p>
        )}

        {mutation.isError && (
          <p className="text-brick text-sm mb-4">{mutation.error.message}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-brass hover:bg-brass/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-graphite font-body font-medium py-3 rounded-lg mb-5 mt-2"
        >
          {mutation.isPending ? "Creating account..." : "Create account"}
        </button>

        <p className="text-steel text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brass hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;