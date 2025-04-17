
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-medisync-600' : 'text-gray-400'}`} />
      <Switch 
        checked={theme === 'dark'} 
        onCheckedChange={toggleTheme}
      />
      <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-medisync-600' : 'text-gray-400'}`} />
    </div>
  );
};

export default ThemeToggle;
