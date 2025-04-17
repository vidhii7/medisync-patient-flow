
import React from "react";
import MLAlgorithmCard from "@/components/ml/MLAlgorithmCard";

const MLSection: React.FC = () => {
  const mlAlgorithms = [
    {
      title: "Discharge prediction",
      impact: "Frees up beds early",
      type: "Classification" as const,
      isActive: true
    },
    {
      title: "ED boarding & bed allocation",
      impact: "Faster patient movement",
      type: "Regression + RL" as const,
      isActive: true
    },
    {
      title: "Length of Stay forecasting",
      impact: "Capacity planning",
      type: "Regression" as const,
      isActive: false
    },
    {
      title: "Bottleneck detection",
      impact: "Alerts for workflow delays",
      type: "Anomaly Detection" as const,
      isActive: false
    },
    {
      title: "Auto-summary generator (future)",
      impact: "Saves doctor time, standardizes documentation",
      type: "NLP" as const,
      isActive: false
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Machine Learning Insights</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Real-time AI-powered insights to optimize patient flow
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mlAlgorithms.map((algorithm) => (
          <MLAlgorithmCard
            key={algorithm.title}
            title={algorithm.title}
            impact={algorithm.impact}
            type={algorithm.type}
            isActive={algorithm.isActive}
          />
        ))}
      </div>
    </div>
  );
};

export default MLSection;
