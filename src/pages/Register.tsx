
import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "sonner";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("doctor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  
  const { user, register, error } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setPasswordError("");
    setIsSubmitting(true);

    try {
      // Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Call our context register to handle roles
      await register(name, email, password, role);
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      toast.error(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 bg-medisync-500 rounded-lg mx-auto flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-white">M</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Join MediSync to manage patient flow efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-medisync-500 focus:border-medisync-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-medisync-500 focus:border-medisync-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-medisync-500 focus:border-medisync-500 sm:text-sm"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-medisync-500 focus:border-medisync-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-medisync-500 focus:border-medisync-500 sm:text-sm"
                />
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 disabled:bg-medisync-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-medisync-600 hover:text-medisync-500">
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <Link to="/forgot-password" className="font-medium text-medisync-600 hover:text-medisync-500">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
