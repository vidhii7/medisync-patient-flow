
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import ThemeToggle from "@/components/common/ThemeToggle";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(errorMessage);
      console.error("Reset password error:", error);
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
        
        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isResetSent ? (
            <div className="text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mx-auto w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We've sent a password reset link to {email}
              </p>
              <Link to="/login" className="font-medium text-medisync-600 hover:text-medisync-500">
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 disabled:bg-medisync-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending reset link..." : "Send reset link"}
                </button>
              </div>

              <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-medisync-600 hover:text-medisync-500">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
