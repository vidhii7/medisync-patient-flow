
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";
import AppShell from "@/components/layout/AppShell";
import { Activity, Users, ClipboardCheck, AlertTriangle, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, tasks, getUserTasks } = usePatient();
  const [userTasks, setUserTasks] = useState<ReturnType<typeof getUserTasks>>([]);

  useEffect(() => {
    if (user) {
      setUserTasks(getUserTasks(user.id));
    }
  }, [user, getUserTasks]);

  // Stats for all roles
  const stats = [
    {
      name: "Active Patients",
      value: patients.filter(p => p.status !== "discharged").length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Total Tasks",
      value: tasks.length,
      icon: ClipboardCheck, 
      color: "bg-purple-500"
    },
    {
      name: "Emergency Cases",
      value: patients.filter(p => p.isEmergency).length,
      icon: AlertTriangle,
      color: "bg-red-500"
    },
    {
      name: "Ready for Discharge",
      value: patients.filter(p => p.status === "ready-for-discharge").length,
      icon: Clock,
      color: "bg-green-500"
    }
  ];

  // Tasks for current user
  const pendingTasks = userTasks.filter(task => task.status === "pending").length;
  const inProgressTasks = userTasks.filter(task => task.status === "in-progress").length;
  const completedTasks = userTasks.filter(task => task.status === "completed").length;

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    if (!user) return "";
    
    switch(user.role) {
      case "doctor":
        return "Manage your patients and treatment plans";
      case "nurse":
        return "View and complete your assigned tasks";
      case "coordinator":
        return "Optimize patient flow and assignments";
      case "admin":
        return "Monitor system performance and users";
      default:
        return "Welcome to your dashboard";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{getWelcomeMessage()}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tasks Overview */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Tasks</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Current progress and assignments</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-status-pending flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Pending</h4>
                  <p className="text-3xl font-semibold text-gray-700 mt-1">{pendingTasks}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-status-inprogress flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">In Progress</h4>
                  <p className="text-3xl font-semibold text-gray-700 mt-1">{inProgressTasks}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-status-completed flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-green-700" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Completed</h4>
                  <p className="text-3xl font-semibold text-gray-700 mt-1">{completedTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Tasks List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tasks</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your most recent assignments</p>
          </div>
          
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {userTasks.length > 0 ? (
                userTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === "completed" ? "bg-green-500" :
                          task.status === "in-progress" ? "bg-blue-500" : "bg-yellow-500"
                        }`}></div>
                        <p className="ml-3 text-sm font-medium text-gray-900">{task.taskName}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === "completed" ? "bg-status-completed text-green-700" :
                          task.status === "in-progress" ? "bg-status-inprogress text-blue-700" : 
                          "bg-status-pending text-yellow-700"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Patient: {patients.find(p => p.id === task.patientId)?.name}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          Due by {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
                  You have no tasks assigned
                </li>
              )}
            </ul>
          </div>
          
          {userTasks.length > 5 && (
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <a href="/tasks" className="text-sm font-medium text-medisync-600 hover:text-medisync-700">
                View all tasks <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
