
import { db } from "@/config/firebase";
import { collection, doc, addDoc, updateDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export interface Task {
  id: string;
  taskName: string;
  patientId: string;
  assignedToId: string;
  assignedToName: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
}

// Create a new task
export const createTask = async (task: Omit<Task, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    toast.success("Task created successfully");
    return { id: docRef.id, ...task };
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task");
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status });
    toast.success(`Task marked as ${status}`);
    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
    throw error;
  }
};

// Get tasks for a user
export const getUserTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, "tasks"), where("assignedToId", "==", userId));
  
  return onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  });
};

// Get all tasks
export const getAllTasks = (callback: (tasks: Task[]) => void) => {
  return onSnapshot(collection(db, "tasks"), (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  });
};

// Get tasks for a patient
export const getPatientTasks = (patientId: string, callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, "tasks"), where("patientId", "==", patientId));
  
  return onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  });
};
