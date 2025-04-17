
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserPlus, ClipboardList, Users, List, LogOut, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      }
    ];
    
    if (!user) return baseItems;
    
    switch (user.role) {
      case "doctor":
        return [
          ...baseItems,
          {
            name: "Patient Intake",
            href: "/patient-intake",
            icon: UserPlus,
          },
          {
            name: "Tasks",
            href: "/tasks",
            icon: ClipboardList,
          }
        ];
      case "nurse":
        return [
          ...baseItems,
          {
            name: "Tasks",
            href: "/tasks",
            icon: ClipboardList,
          }
        ];
      case "coordinator":
        return [
          ...baseItems,
          {
            name: "Patients",
            href: "/patients",
            icon: Users,
          },
          {
            name: "Tasks",
            href: "/tasks",
            icon: ClipboardList,
          }
        ];
      case "admin":
        return [
          ...baseItems,
          {
            name: "Users",
            href: "/users",
            icon: Users,
          },
          {
            name: "Patients",
            href: "/patients",
            icon: Users,
          },
          {
            name: "Tasks",
            href: "/tasks",
            icon: ClipboardList,
          }
        ];
      default:
        return baseItems;
    }
  };
  
  const navigationItems = getNavigationItems();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-4 h-16 mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-medisync-600"
            >
              <List size={24} />
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-medisync-500 rounded-md flex items-center justify-center">
                <span className="font-bold text-white">M</span>
              </div>
              <span className="font-bold text-xl text-medisync-800">MediSync</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-medisync-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-gray-600 capitalize">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-medisync-100 flex items-center justify-center">
                <User size={18} className="text-medisync-600" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 w-64 mt-16 bg-white border-r transition-transform transform z-20",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  location.pathname === item.href
                    ? "bg-medisync-50 text-medisync-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-medisync-600"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-medisync-600 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </nav>
        </aside>
        
        {/* Page Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          isMobileMenuOpen ? "md:ml-64" : "ml-0 md:ml-64"
        )}>
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AppShell;
