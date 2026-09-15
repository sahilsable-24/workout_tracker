import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    },
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-graphite text-chalk flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="text-xs text-steel mb-2">Welcome back</p>
        <h1 className="font-display text-2xl font-medium mb-8">Log in</h1>

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

        <div className="mb-7">
          <label className="block text-xs text-steel mb-1.5">Password</label>
          <input
            type="password"
            required
            // minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-graphite-deep text-chalk border border-steel/50 focus:border-brass focus:outline-none transition-colors rounded-lg px-4 py-3"
          />
        </div>

        {mutation.isError && (
          <p className="text-brick text-sm mb-4">{mutation.error.message}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-brass hover:bg-brass/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-graphite font-body font-medium py-3 rounded-lg mb-5"
        >
          {mutation.isPending ? "Logging in..." : "Log in"}
        </button>

        <p className="text-steel text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brass hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;