
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-medisync-500 rounded-lg mx-auto flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-white">M</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in to MediSync</h1>
        <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medisync-500 focus:border-medisync-500"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medisync-500 focus:border-medisync-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-medisync-600 focus:ring-medisync-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <button type="button" className="text-sm font-medium text-medisync-600 hover:text-medisync-500">
            Forgot password?
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 disabled:bg-medisync-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Demo accounts</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setEmail("doctor@example.com");
              setPassword("password");
            }}
            className="text-xs flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            Doctor Login
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("nurse@example.com");
              setPassword("password");
            }}
            className="text-xs flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            Nurse Login
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("coordinator@example.com");
              setPassword("password");
            }}
            className="text-xs flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            Coordinator Login
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@example.com");
              setPassword("password");
            }}
            className="text-xs flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
