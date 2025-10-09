
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
                className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-blue-200"
                style={{ 
                  backgroundColor: '#A4C3FF1A', // Light blue with 10% opacity
                  animationDelay: `${index * 50}ms` 
                }}
                aria-label={`View profile for ${patient.full_name}`}
              >
                <div className="mb-5">
                  {/* Patient ID Badge */}
                  <div className="inline-flex items-center bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                    {patient.patient_id}
                  </div>
                  
                  {/* Age Badge */}
                  <div className="inline-flex items-center bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full mb-4 ml-2">
                    Age {patient.age}
                  </div>
                  
                  {/* Patient Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight truncate">
                    {patient.full_name}
                  </h3>
                  
                  {/* Patient Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-700 w-24">Gender:</span>
                      <span className="text-gray-900 font-bold">{patient.gender}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-700 w-24">Registered:</span>
                      <span className="text-gray-900 font-bold">
                        {new Date(patient.registration_timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* View Profile Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform group-hover:scale-105">
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