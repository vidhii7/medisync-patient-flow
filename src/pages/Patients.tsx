
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient, Patient, Department } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import AppShell from "@/components/layout/AppShell";
import { 
  Search, 
  Filter, 
  UserPlus, 
  PlusCircle, 
  AlertCircle,
  Activity
} from "lucide-react";

const Patients: React.FC = () => {
  const { patients } = usePatient();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  
  // Filter patients based on search term and filters
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           patient.id.toLowerCase().includes(searchTerm.toLowerCase());
                           
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || patient.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [patients, searchTerm, statusFilter, departmentFilter]);
  
  // Group patients by department
  const patientsByDepartment = useMemo(() => {
    const grouped: Record<Department, Patient[]> = {
      emergency: [],
      cardiology: [],
      neurology: [],
      orthopedics: [],
      general: [],
      pediatrics: []
    };
    
    filteredPatients.forEach((patient) => {
      if (grouped[patient.department]) {
        grouped[patient.department].push(patient);
      }
    });
    
    return grouped;
  }, [filteredPatients]);
  
  const getDepartmentLabel = (department: string) => {
    switch(department) {
      case "emergency": return "Emergency Department";
      case "cardiology": return "Cardiology Department";
      case "neurology": return "Neurology Department";
      case "orthopedics": return "Orthopedics Department";
      case "general": return "General Medicine";
      case "pediatrics": return "Pediatrics Department";
      default: return department;
    }
  };
  
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view all patient records
            </p>
          </div>
          
          {user?.role === "doctor" && (
            <button
              onClick={() => navigate("/patient-intake")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              New Patient
            </button>
          )}
        </div>
        
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-medisync-500 focus:border-medisync-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search patients..."
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
                  <option value="admitted">Admitted</option>
                  <option value="in-treatment">In Treatment</option>
                  <option value="ready-for-discharge">Ready for Discharge</option>
                  <option value="discharged">Discharged</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="focus:ring-medisync-500 focus:border-medisync-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="emergency">Emergency</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="general">General</option>
                  <option value="pediatrics">Pediatrics</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Departments and patients */}
        {departmentFilter === "all" ? (
          Object.entries(patientsByDepartment).map(([department, deptPatients]) => (
            deptPatients.length > 0 && (
              <div key={department} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {getDepartmentLabel(department)}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {deptPatients.length} patient{deptPatients.length !== 1 ? 's' : ''} in this department
                  </p>
                </div>
                
                <ul role="list" className="divide-y divide-gray-200">
                  {deptPatients.map((patient) => (
                    <li key={patient.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-medisync-100 flex items-center justify-center">
                            <span className="font-medium text-medisync-600">
                              {patient.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                              {patient.isEmergency && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Emergency
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Age: {patient.age} | Room: {patient.roomNo || "Not assigned"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(patient.status)}`}>
                            {patient.status.replace('-', ' ')}
                          </span>
                          
                          {(user?.role === "coordinator" || user?.role === "admin") && (
                            <button
                              onClick={() => navigate(`/patients/${patient.id}/tasks`)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Assign Tasks
                            </button>
                          )}
                          
                          <button
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Details
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {departmentFilter === "all" ? "All Patients" : getDepartmentLabel(departmentFilter)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {filteredPatients.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <li key={patient.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-medisync-100 flex items-center justify-center">
                          <span className="font-medium text-medisync-600">
                            {patient.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                            {patient.isEmergency && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Emergency
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Age: {patient.age} | Room: {patient.roomNo || "Not assigned"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(patient.status)}`}>
                          {patient.status.replace('-', ' ')}
                        </span>
                        
                        {(user?.role === "coordinator" || user?.role === "admin") && (
                          <button
                            onClick={() => navigate(`/patients/${patient.id}/tasks`)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Assign Tasks
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
                        >
                          <Activity className="h-3 w-3 mr-1" />
                          Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No patients found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Patients;
