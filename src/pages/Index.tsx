
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard or login
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center">
        <div className="w-24 h-24 bg-medisync-500 rounded-lg mx-auto flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-white">M</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">MediSync</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Patient Flow Management System
        </p>
        <div className="flex justify-center mb-6">
          <ThemeToggle />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medisync-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
