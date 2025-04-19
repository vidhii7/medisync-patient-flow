
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
          <img 
            src="/lovable-uploads/b19e2615-f6ed-4d68-80d6-78836845cc31.png" 
            alt="MediSync Logo" 
            className="w-24 h-24 mb-6 object-contain rounded-lg" 
          />
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
