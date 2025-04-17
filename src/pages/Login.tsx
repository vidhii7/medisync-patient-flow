
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/common/ThemeToggle";

const Login: React.FC = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-medisync-500 rounded-md flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          MediSync
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Patient Flow Management System
        </p>
        
        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
