
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { 
  ArrowLeft, 
  Calendar, 
  ClipboardList, 
  User, 
  MapPin, 
  PlusCircle,
  Clock,
  AlertCircle,
  Edit
} from "lucide-react";

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientById, getPatientTasks, updatePatientStatus } = usePatient();
  const { user } = useAuth();
  
  const patient = useMemo(() => {
    return patientId ? getPatientById(patientId) : undefined;
  }, [patientId, getPatientById]);
  
  const patientTasks = useMemo(() => {
    return patientId ? getPatientTasks(patientId) : [];
  }, [patientId, getPatientTasks]);

  const handleStatusChange = (newStatus: "admitted" | "in-treatment" | "ready-for-discharge" | "discharged") => {
    if (patient) {
      updatePatientStatus(patient.id, newStatus);
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
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "admitted": return "bg-blue-100 text-blue-800";
      case "in-treatment": return "bg-yellow-100 text-yellow-800";
      case "ready-for-discharge": return "bg-green-100 text-green-800";
      case "discharged": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/patients")}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </button>
        
        {/* Patient header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {patient.name}
                {patient.isEmergency && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Emergency
                  </span>
                )}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Patient ID: {patient.id}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(patient.status)}`}>
                {patient.status.replace('-', ' ')}
              </span>
              
              {(user?.role === "coordinator" || user?.role === "doctor") && (
                <div className="ml-4">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}/tasks`)}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Assign Tasks
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.age} years</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admitted Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(patient.admittedDate).toLocaleDateString()}
                  <span className="text-gray-500 ml-2">
                    ({new Date(patient.admittedDate).toLocaleTimeString()})
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{patient.department}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Room Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.roomNo || "Not assigned"}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Symptoms</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.symptoms}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Diagnosis</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.diagnosis || "Not provided"}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admitted By</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.addedByName}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Status Management */}
        {(user?.role === "doctor" || user?.role === "coordinator" || user?.role === "admin") && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Status Management</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update patient's current status
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusChange("admitted")}
                  disabled={patient.status === "admitted"}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    patient.status === "admitted" 
                      ? "bg-blue-100 text-blue-800 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Admitted
                </button>
                
                <button
                  onClick={() => handleStatusChange("in-treatment")}
                  disabled={patient.status === "in-treatment"}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    patient.status === "in-treatment"
                      ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  In Treatment
                </button>
                
                <button
                  onClick={() => handleStatusChange("ready-for-discharge")}
                  disabled={patient.status === "ready-for-discharge"}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    patient.status === "ready-for-discharge"
                      ? "bg-green-100 text-green-800 cursor-not-allowed" 
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Ready for Discharge
                </button>
                
                <button
                  onClick={() => handleStatusChange("discharged")}
                  disabled={patient.status === "discharged"}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    patient.status === "discharged"
                      ? "bg-gray-100 text-gray-800 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Discharged
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Patient Tasks */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Tasks</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Tasks assigned for this patient
              </p>
            </div>
            
            {(user?.role === "coordinator" || user?.role === "admin") && (
              <button
                onClick={() => navigate(`/patients/${patient.id}/tasks`)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Assign New Tasks
              </button>
            )}
          </div>
          
          <div className="border-t border-gray-200">
            {patientTasks.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {patientTasks.map((task) => (
                  <li key={task.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                          task.status === "completed" ? "bg-status-completed" :
                          task.status === "in-progress" ? "bg-status-inprogress" : "bg-status-pending"
                        } flex items-center justify-center`}>
                          <ClipboardList className={`h-4 w-4 ${
                            task.status === "completed" ? "text-green-700" :
                            task.status === "in-progress" ? "text-blue-700" : "text-yellow-700"
                          }`} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{task.taskName}</h3>
                          <div className="flex text-xs text-gray-500 mt-1">
                            <div className="flex items-center mr-3">
                              <User className="h-3 w-3 mr-1" />
                              {task.assignedToName}
                            </div>
                            <div className="flex items-center mr-3">
                              <Clock className="h-3 w-3 mr-1" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created: {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "completed" ? "bg-green-100 text-green-800" :
                          task.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                No tasks have been assigned to this patient yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default PatientDetail;
