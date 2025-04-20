
import React from "react";
import { Loader2 } from "lucide-react";
import UserCard from "./UserCard";
import { UserData } from "@/hooks/useUsers";

interface UsersListProps {
  users?: UserData[];
  isLoading: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-medisync-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users?.map((user) => (
        <UserCard 
          key={user.id} 
          user={user}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
        />
      ))}
    </div>
  );
};

export default UsersList;
