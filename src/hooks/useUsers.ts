
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser, getAuth } from "firebase/auth";
import { db } from "@/config/firebase";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  medicalStatus?: string;
  lastProcedure?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export function useUsers() {
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

  const createUser = async (data: UserFormData) => {
    try {
      const auth = getAuth();
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password || 'defaultPassword123'
      );

      await addDoc(collection(db, 'users'), {
        name: data.name,
        email: data.email,
        role: data.role,
        uid: userCredential.user.uid
      });

      toast.success('User created successfully');
      refetch();
      return true;
    } catch (error) {
      toast.error('Failed to create user');
      console.error('Error creating user:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, data: Partial<UserFormData>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        name: data.name,
        role: data.role,
        ...(data.email && { email: data.email })
      });

      toast.success('User updated successfully');
      refetch();
      return true;
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      
      try {
        const q = query(collection(db, 'users'), where('email', '==', userEmail));
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
      return true;
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
      return false;
    }
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser
  };
}
