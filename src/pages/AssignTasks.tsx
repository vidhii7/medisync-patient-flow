
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { ArrowLeft, Plus, Trash } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Mock users for task assignment (in a real app, would be fetched from backend)
const mockUsers: User[] = [
  { id: "1", name: "Dr. Jane Smith", email: "doctor@example.com", role: "doctor" },
  { id: "2", name: "Nurse Alex Johnson", email: "nurse@example.com", role: "nurse" },
  { id: "3", name: "Sam Coordinator", email: "coordinator@example.com", role: "coordinator" },
  { id: "4", name: "Admin User", email: "admin@example.com", role: "admin" }
];

// Template tasks based on department
const taskTemplates: Record<string, string[]> = {
  emergency: [
    "Initial assessment and triage",
    "Administer pain medication",
    "Order diagnostic tests",
    "Schedule specialist consultation",
    "Prepare for emergency procedure"
  ],
  cardiology: [
    "ECG monitoring",
    "Administer cardiac medication",
    "Schedule stress test",
    "Prepare for echocardiogram",
    "Blood pressure monitoring"
  ],
  neurology: [
    "Neurological assessment",
    "Monitor brain activity",
    "Schedule MRI scan",
    "Administer neurological medication",
    "Physical therapy session"
  ],
  orthopedics: [
    "Change wound dressing",
    "Schedule physical therapy",
    "Post-surgery assessment",
    "Pain management",
    "Schedule follow-up X-ray"
  ],
  general: [
    "Vital signs check",
    "Administer medication",
    "Collect lab samples",
    "Patient consultation",
    "Discharge preparation"
  ],
  pediatrics: [
    "Administer vaccination",
    "Growth assessment",
    "Parent consultation",
    "Developmental screening",
    "Schedule follow-up appointment"
  ]
};

interface NewTask {
  taskName: string;
  assignedToId: string;
  dueDate: string;
}

const AssignTasks: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientById, assignTask } = usePatient();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState(patientId ? getPatientById(patientId) : undefined);
  const [tasks, setTasks] = useState<NewTask[]>([
    { taskName: "", assignedToId: "", dueDate: new Date().toISOString().split("T")[0] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (patientId) {
      const foundPatient = getPatientById(patientId);
      setPatient(foundPatient);
      
      // Pre-populate with department-specific templates
      if (foundPatient && foundPatient.department && taskTemplates[foundPatient.department]) {
        const defaultTasks = taskTemplates[foundPatient.department].map(taskName => ({
          taskName,
          assignedToId: "",
          dueDate: new Date().toISOString().split("T")[0]
        }));
        
        setTasks(defaultTasks);
      }
    }
  }, [patientId, getPatientById]);
  
  const handleTaskChange = (index: number, field: keyof NewTask, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };
  
  const addTask = () => {
    setTasks([
      ...tasks,
      { taskName: "", assignedToId: "", dueDate: new Date().toISOString().split("T")[0] }
    ]);
  };
  
  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty tasks
      const validTasks = tasks.filter(task => task.taskName.trim() !== "" && task.assignedToId !== "");
      
      // Assign each task
      validTasks.forEach(task => {
        const assignedUser = mockUsers.find(u => u.id === task.assignedToId);
        
        assignTask({
          taskName: task.taskName,
          patientId: patient.id,
          assignedToId: task.assignedToId,
          assignedToName: assignedUser ? assignedUser.name : "Unknown User",
          status: "pending",
          dueDate: new Date(task.dueDate).toISOString()
        });
      });
      
      // Navigate back to patient list or detail
      navigate(`/patients/${patient.id}`);
    } catch (error) {
      console.error("Error assigning tasks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!patient) {
    return (
      <AppShell>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">Patient not found</h2>
          <button
            onClick={() => navigate("/patients")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </button>
        </div>
      </AppShell>
    );
  }
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Assign Tasks</h1>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-500">Patient:</span>
            <span className="ml-2 text-sm font-medium text-gray-900">{patient.name}</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm text-gray-500 capitalize">{patient.department}</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm text-gray-500">Room: {patient.roomNo || "Not assigned"}</span>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Task Assignment Form</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Assign tasks to medical staff for this patient
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Task {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor={`task-${index}`} className="block text-sm font-medium text-gray-700">
                          Task Description
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`task-${index}`}
                            value={task.taskName}
                            onChange={(e) => handleTaskChange(index, "taskName", e.target.value)}
                            required
                            className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor={`assigned-to-${index}`} className="block text-sm font-medium text-gray-700">
                          Assigned To
                        </label>
                        <div className="mt-1">
                          <select
                            id={`assigned-to-${index}`}
                            value={task.assignedToId}
                            onChange={(e) => handleTaskChange(index, "assignedToId", e.target.value)}
                            required
                            className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select Staff Member</option>
                            {mockUsers
                              .filter(u => u.role === "doctor" || u.role === "nurse")
                              .map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.role})
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor={`due-date-${index}`} className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id={`due-date-${index}`}
                            value={task.dueDate}
                            onChange={(e) => handleTaskChange(index, "dueDate", e.target.value)}
                            required
                            className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div>
                  <button
                    type="button"
                    onClick={addTask}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Task
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 disabled:bg-medisync-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Assigning..." : "Assign Tasks"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default AssignTasks;
