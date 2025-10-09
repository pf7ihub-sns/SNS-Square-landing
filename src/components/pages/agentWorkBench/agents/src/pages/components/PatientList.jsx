
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Hash, Calendar, ArrowRight, Users } from "lucide-react";
import Pagination from "../components/Pagination";

export default function PatientList({ patients, loading, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Calculate paginated patients
  const totalPages = Math.ceil(patients.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedPatients = patients.slice(startIndex, endIndex);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading patients...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm" role="alert">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Error loading patients</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-16 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-10">
            {paginatedPatients.map((patient, index) => (
              <Link
                key={patient.patient_id}
                to={`../patient-profile/${patient.patient_id}`}
                relative="path"
                className="rounded-xl p-4  transition-all duration-300  group border"
                style={{ 
                  backgroundColor: '#F3F7FF',
                  borderColor: '#A4C3FF',
                  animationDelay: `${index * 50}ms` 
                }}
                aria-label={`View profile for ${patient.full_name}`}
              >
                {/* Patient ID and Age */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-white px-2.5 py-1.5 rounded-md">
                    <span className="text-blue-600 font-bold text-xs">
                      {patient.patient_id}
                    </span>
                  </div>
                  <div className="bg-white px-2.5 py-1.5 rounded-md">
                    <span className="text-gray-900 font-semibold text-xs">
                      Age: {patient.age}
                    </span>
                  </div>
                </div>
                
                {/* Patient Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {patient.full_name}
                </h3>
                
                {/* Gender and Registered in same line */}
                <div className="flex items-center text-base text-gray-600 mb-4">
                  <span className="flex items-center">
                    <span className="mx-1.5">•</span>
                    <span className="font-regular">Gender:</span>
                    <span className="ml-1 font-medium text-gray-900">{patient.gender}</span>
                  </span>
                  <span className="mx-1.5">•</span>
                  <span className="flex items-center">
                    <span className="font-regular">Registered:</span>
                    <span className="ml-1 font-medium text-gray-900">
                      {new Date(patient.registration_timestamp).toLocaleDateString('en-US', { 
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </span>
                </div>
                
                {/* View Profile Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm">
                  View Profile
                </button>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}