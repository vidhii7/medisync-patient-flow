
import React from "react";
import { User, UserCheck, Clock, MoreVertical } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  medicalStatus?: string;
  lastProcedure?: string;
}

interface UserCardProps {
  user: UserData;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-medisync-100 dark:bg-medisync-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-medisync-600 dark:text-medisync-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-medisync-500" />
              <span className="text-sm font-medium capitalize">{user.role}</span>
            </div>
            {user.medicalStatus && (
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.medicalStatus)}`}>
                {user.medicalStatus}
              </div>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Medical History</h4>
          {user.lastProcedure ? (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Last Procedure: {user.lastProcedure}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent procedures</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserCard;
