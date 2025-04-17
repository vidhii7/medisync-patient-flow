
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define Patient types
export type PatientStatus = "admitted" | "in-treatment" | "ready-for-discharge" | "discharged";
export type Department = "emergency" | "cardiology" | "neurology" | "orthopedics" | "general" | "pediatrics";

export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  isEmergency: boolean;
  roomNo?: string;
  department: Department;
  diagnosis?: string;
  addedById: string;
  addedByName: string;
  admittedDate: string;
  status: PatientStatus;
}

interface TaskStatus {
  id: string;
  taskName: string;
  patientId: string;
  assignedToId: string;
  assignedToName: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
}

interface PatientContextType {
  patients: Patient[];
  tasks: TaskStatus[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "admittedDate">) => void;
  updatePatientStatus: (patientId: string, newStatus: PatientStatus) => void;
  assignTask: (task: Omit<TaskStatus, "id" | "createdAt">) => void;
  updateTaskStatus: (taskId: string, newStatus: "pending" | "in-progress" | "completed") => void;
  getPatientById: (id: string) => Patient | undefined;
  getPatientTasks: (patientId: string) => TaskStatus[];
  getUserTasks: (userId: string) => TaskStatus[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Sample mock data
const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    age: 45,
    symptoms: "Chest pain, shortness of breath",
    isEmergency: true,
    roomNo: "ER-3",
    department: "cardiology",
    diagnosis: "Suspected myocardial infarction",
    addedById: "1", // Doctor ID
    addedByName: "Dr. Jane Smith",
    admittedDate: "2023-04-15T08:30:00Z",
    status: "in-treatment"
  },
  {
    id: "p2",
    name: "Emily Johnson",
    age: 32,
    symptoms: "Severe headache, dizziness",
    isEmergency: false,
    roomNo: "301",
    department: "neurology",
    diagnosis: "Migraine",
    addedById: "1",
    addedByName: "Dr. Jane Smith",
    admittedDate: "2023-04-14T15:20:00Z",
    status: "ready-for-discharge"
  },
  {
    id: "p3",
    name: "Michael Wilson",
    age: 28,
    symptoms: "Fractured arm, abrasions",
    isEmergency: true,
    roomNo: "ER-5",
    department: "orthopedics",
    diagnosis: "Compound fracture",
    addedById: "1",
    addedByName: "Dr. Jane Smith",
    admittedDate: "2023-04-16T10:15:00Z",
    status: "admitted"
  },
  {
    id: "p4",
    name: "Sarah Miller",
    age: 67,
    symptoms: "Fever, cough, fatigue",
    isEmergency: false,
    roomNo: "205",
    department: "general",
    diagnosis: "Pneumonia",
    addedById: "1",
    addedByName: "Dr. Jane Smith",
    admittedDate: "2023-04-13T09:45:00Z", 
    status: "in-treatment"
  }
];

const mockTasks: TaskStatus[] = [
  {
    id: "t1",
    taskName: "Administer medication",
    patientId: "p1",
    assignedToId: "2",
    assignedToName: "Nurse Alex Johnson",
    status: "pending",
    dueDate: "2023-04-16T10:00:00Z",
    createdAt: "2023-04-15T09:00:00Z"
  },
  {
    id: "t2",
    taskName: "Change dressing",
    patientId: "p3",
    assignedToId: "2",
    assignedToName: "Nurse Alex Johnson",
    status: "in-progress",
    dueDate: "2023-04-16T11:30:00Z",
    createdAt: "2023-04-16T10:30:00Z"
  },
  {
    id: "t3",
    taskName: "Complete discharge paperwork",
    patientId: "p2",
    assignedToId: "1",
    assignedToName: "Dr. Jane Smith",
    status: "pending",
    dueDate: "2023-04-16T14:00:00Z",
    createdAt: "2023-04-15T16:00:00Z"
  },
  {
    id: "t4",
    taskName: "Review test results",
    patientId: "p4",
    assignedToId: "1",
    assignedToName: "Dr. Jane Smith", 
    status: "completed",
    dueDate: "2023-04-15T15:00:00Z",
    createdAt: "2023-04-14T10:00:00Z"
  }
];

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [tasks, setTasks] = useState<TaskStatus[]>(mockTasks);

  const addPatient = (patientData: Omit<Patient, "id" | "status" | "admittedDate">) => {
    const newPatient: Patient = {
      ...patientData,
      id: `p${patients.length + 1}`,
      status: "admitted",
      admittedDate: new Date().toISOString()
    };

    setPatients([...patients, newPatient]);
  };

  const updatePatientStatus = (patientId: string, newStatus: PatientStatus) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      )
    );
  };

  const assignTask = (taskData: Omit<TaskStatus, "id" | "createdAt">) => {
    const newTask: TaskStatus = {
      ...taskData,
      id: `t${tasks.length + 1}`,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const getPatientTasks = (patientId: string) => {
    return tasks.filter(task => task.patientId === patientId);
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => task.assignedToId === userId);
  };

  return (
    <PatientContext.Provider value={{
      patients,
      tasks,
      addPatient,
      updatePatientStatus,
      assignTask,
      updateTaskStatus,
      getPatientById,
      getPatientTasks,
      getUserTasks
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  
  return context;
};
