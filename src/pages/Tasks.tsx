
import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";
import AppShell from "@/components/layout/AppShell";
import { 
  Check, 
  Clock, 
  Filter, 
  Search,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, patients, updateTaskStatus } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get tasks for current user or all tasks for admin/coordinator
  const userTasks = useMemo(() => {
    if (!user) return [];
    
    if (user.role === "admin" || user.role === "coordinator") {
      return tasks;
    }
    
    return tasks.filter(task => task.assignedToId === user.id);
  }, [user, tasks]);
  
  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    return userTasks.filter(task => {
      const patient = patients.find(p => p.id === task.patientId);
      
      const matchesSearch = 
        (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [userTasks, patients, searchTerm, statusFilter]);

  // Group tasks by status
  const taskGroups = useMemo(() => {
    return {
      pending: filteredTasks.filter(task => task.status === "pending"),
      inProgress: filteredTasks.filter(task => task.status === "in-progress"),
      completed: filteredTasks.filter(task => task.status === "completed")
    };
  }, [filteredTasks]);

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    updateTaskStatus(taskId, newStatus);
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === "admin" || user?.role === "coordinator" 
              ? "Manage and track all assigned tasks" 
              : "View and manage your assigned tasks"}
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-medisync-500 focus:border-medisync-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search tasks or patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="focus:ring-medisync-500 focus:border-medisync-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-yellow-50 px-4 py-5 border-b border-yellow-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-yellow-800">Pending</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {taskGroups.pending.length}
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
              {taskGroups.pending.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {taskGroups.pending.map(task => {
                    const patient = patients.find(p => p.id === task.patientId);
                    return (
                      <li key={task.id} className="p-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{task.taskName}</h3>
                            <div className="flex space-x-1">
                              {new Date(task.dueDate) < new Date() && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="mt-1 text-xs text-gray-500">
                            Patient: {patient?.name || "Unknown"}
                          </p>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="mt-3 flex justify-end space-x-2">
                            <button
                              onClick={() => handleStatusChange(task.id, "in-progress")}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <ArrowRight className="mr-1 h-3 w-3" />
                              Start
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No pending tasks
                </div>
              )}
            </div>
          </div>
          
          {/* In Progress Tasks */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-4 py-5 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-blue-800">In Progress</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {taskGroups.inProgress.length}
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
              {taskGroups.inProgress.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {taskGroups.inProgress.map(task => {
                    const patient = patients.find(p => p.id === task.patientId);
                    return (
                      <li key={task.id} className="p-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{task.taskName}</h3>
                            <div className="flex space-x-1">
                              {new Date(task.dueDate) < new Date() && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="mt-1 text-xs text-gray-500">
                            Patient: {patient?.name || "Unknown"}
                          </p>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="mt-3 flex justify-end space-x-2">
                            <button
                              onClick={() => handleStatusChange(task.id, "completed")}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No in-progress tasks
                </div>
              )}
            </div>
          </div>
          
          {/* Completed Tasks */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-5 border-b border-green-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-green-800">Completed</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {taskGroups.completed.length}
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
              {taskGroups.completed.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {taskGroups.completed.map(task => {
                    const patient = patients.find(p => p.id === task.patientId);
                    return (
                      <li key={task.id} className="p-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{task.taskName}</h3>
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                          
                          <p className="mt-1 text-xs text-gray-500">
                            Patient: {patient?.name || "Unknown"}
                          </p>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No completed tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Tasks;
