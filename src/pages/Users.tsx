
import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import UserDialog from "@/components/users/UserDialog";
import DeleteUserDialog from "@/components/users/DeleteUserDialog";
import UsersList from "@/components/users/UsersList";
import { Button } from "@/components/ui/button";
import { useUsers, UserData } from "@/hooks/useUsers";

const Users = () => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const { users, isLoading, createUser, updateUser, deleteUser } = useUsers();

  const handleCreateUser = async (data: any) => {
    const success = await createUser(data);
    if (success) {
      setUserDialogOpen(false);
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return;
    
    const success = await updateUser(selectedUser.id, data);
    if (success) {
      setUserDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser.id, selectedUser.email);
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setMode('edit');
    setUserDialogOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Users Management</h1>
          <Button 
            onClick={() => {
              setMode('create');
              setSelectedUser(null);
              setUserDialogOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <UsersList 
          users={users}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

        <UserDialog
          open={userDialogOpen}
          onOpenChange={setUserDialogOpen}
          onSubmit={mode === 'create' ? handleCreateUser : handleUpdateUser}
          defaultValues={selectedUser || undefined}
          mode={mode}
        />

        <DeleteUserDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteUser}
        />
      </div>
    </AppShell>
  );
};

export default Users;
