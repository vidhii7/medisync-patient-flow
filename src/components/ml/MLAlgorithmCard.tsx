
import React from "react";

type MLType = "Classification" | "Regression + RL" | "Regression" | "Anomaly Detection" | "NLP";

interface MLAlgorithmCardProps {
  title: string;
  impact: string;
  type: MLType;
  isActive?: boolean;
}

const MLAlgorithmCard: React.FC<MLAlgorithmCardProps> = ({ title, impact, type, isActive = false }) => {
  return (
    <div className={`rounded-lg shadow-sm p-5 transition-all ${
      isActive 
        ? "bg-medisync-500/20 dark:bg-medisync-500/30 border border-medisync-500" 
        : "bg-white dark:bg-sidebar-accent border border-gray-100 dark:border-sidebar-border"
    }`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium dark:text-white">{title}</h3>
        <span className={`
          text-xs font-semibold px-2 py-1 rounded-full
          ${type === "Classification" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : ""}
          ${type === "Regression" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : ""}
          ${type === "Regression + RL" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" : ""}
          ${type === "Anomaly Detection" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : ""}
          ${type === "NLP" ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" : ""}
        `}>
          {type}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{impact}</p>
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${
            isActive ? "bg-medisync-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600"
          }`} style={{ width: isActive ? '70%' : '30%' }}></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isActive ? "Active" : "Coming soon"}
        </p>
      </div>
    </div>
  );
};

export default MLAlgorithmCard;
