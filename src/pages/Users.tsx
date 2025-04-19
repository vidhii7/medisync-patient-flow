
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser, getAuth } from "firebase/auth";
import { db } from "@/config/firebase";
import UserCard from "@/components/users/UserCard";
import { Loader2, UserPlus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import UserDialog from "@/components/users/UserDialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  medicalStatus?: string;
  lastProcedure?: string;
}

const Users = () => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as UserData[];
    }
  });

  const handleCreateUser = async (data: Omit<UserData, 'id'>) => {
    try {
      const auth = getAuth();
      
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password || 'defaultPassword123' // You should implement proper password handling
      );

      // Create user document in Firestore
      const userDoc = await addDoc(collection(db, 'users'), {
        name: data.name,
        email: data.email,
        role: data.role,
        uid: userCredential.user.uid
      });

      toast.success('User created successfully');
      refetch();
      setUserDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create user');
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (data: Partial<UserData>) => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        name: data.name,
        role: data.role,
        ...(data.email && { email: data.email })
      });

      toast.success('User updated successfully');
      refetch();
      setUserDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', selectedUser.id));
      
      // Attempt to delete the user from Authentication
      // Note: This might fail if the user is not found in Auth, which is fine
      try {
        const q = query(collection(db, 'users'), where('email', '==', selectedUser.email));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        if (userData.uid) {
          const auth = getAuth();
          await deleteAuthUser(auth.currentUser!);
        }
      } catch (authError) {
        console.log('Auth user might have already been deleted:', authError);
      }

      toast.success('User deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
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

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-medisync-500" />
        </div>
      </AppShell>
    );
  }

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users?.map((user) => (
            <UserCard 
              key={user.id} 
              user={user}
              onEdit={() => openEditDialog(user)}
              onDelete={() => openDeleteDialog(user)}
            />
          ))}
        </div>

        <UserDialog
          open={userDialogOpen}
          onOpenChange={setUserDialogOpen}
          onSubmit={mode === 'create' ? handleCreateUser : handleUpdateUser}
          defaultValues={selectedUser || undefined}
          mode={mode}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user
                account and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
};

export default Users;
