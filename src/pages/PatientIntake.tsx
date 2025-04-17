
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePatient, Department } from "@/contexts/PatientContext";
import AppShell from "@/components/layout/AppShell";

const PatientIntake: React.FC = () => {
  const { user } = useAuth();
  const { addPatient } = usePatient();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: "",
    isEmergency: false,
    roomNo: "",
    department: "general" as Department,
    diagnosis: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addPatient({
        name: formData.name,
        age: Number(formData.age),
        symptoms: formData.symptoms,
        isEmergency: formData.isEmergency,
        roomNo: formData.roomNo || undefined,
        department: formData.department,
        diagnosis: formData.diagnosis || undefined,
        addedById: user.id,
        addedByName: user.name,
      });
      
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Intake Form</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter new patient information for admission
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                  Symptoms
                </label>
                <div className="mt-1">
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    rows={3}
                    required
                    value={formData.symptoms}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Describe the patient's symptoms in detail
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isEmergency"
                      name="isEmergency"
                      type="checkbox"
                      checked={formData.isEmergency}
                      onChange={handleChange}
                      className="focus:ring-medisync-500 h-4 w-4 text-medisync-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isEmergency" className="font-medium text-gray-700">
                      Emergency case
                    </label>
                    <p className="text-gray-500">Mark if this is an emergency admission</p>
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="emergency">Emergency</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="general">General</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700">
                  Room Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="roomNo"
                    id="roomNo"
                    value={formData.roomNo}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                  Initial Diagnosis
                </label>
                <div className="mt-1">
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows={3}
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-medisync-500 focus:border-medisync-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Optional initial diagnosis"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-medisync-600 hover:bg-medisync-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medisync-500 disabled:bg-medisync-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default PatientIntake;
