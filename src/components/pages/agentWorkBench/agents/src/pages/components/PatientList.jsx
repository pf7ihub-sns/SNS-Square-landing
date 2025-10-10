
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Hash, Calendar, ArrowRight } from "lucide-react";
import Pagination from "../components/Pagination";

export default function PatientList({ patients, loading, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  // Calculate paginated patients
  const totalPages = Math.ceil(patients.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedPatients = patients.slice(startIndex, endIndex);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#005566] border-t-transparent mr-2"></div>
          <p className="text-gray-500 text-sm font-medium">Loading patients...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm" role="alert">
          <p className="text-red-700 font-semibold">Error: {error}</p>
        </div>
      ) : patients.length === 0 ? (
        <p className="text-gray-500 text-sm font-medium">No patients found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedPatients.map((patient) => (
              <Link
                key={patient.patient_id}
                to={`../patient-profile/${patient.patient_id}`}
                relative="path"
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-200 border border-gray-200 animate-pop group"
                aria-label={`View profile for ${patient.full_name}`}
              >
                {/* Header */}
                <div className="bg-blue-50 rounded-t-md p-3 -m-5 mb-3">
                  <h4 className="text-base font-semibold text-[#005566] truncate">{patient.full_name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Patient Profile</p>
                </div>

                {/* Patient Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-[#005566]" />
                    <p className="text-sm text-gray-600">
                      ID: <span className="bg-blue-100 border border-gray-300 text-[#005566] px-2 py-0.5 rounded-md text-xs">{patient.patient_id}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#005566]" />
                    <p className="text-sm text-gray-600">Gender: {patient.gender}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#005566]" />
                    <p className="text-sm text-gray-600">Age: {patient.age}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#005566]" />
                    <p className="text-sm text-gray-600">
                      Registered: {new Date(patient.registration_timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="mt-4 flex justify-center">
                  <button className="inline-flex items-center space-x-1 text-sm font-medium text-[#005566] bg-blue-100 px-4 py-1.5 rounded-md hover:bg-blue-200 hover:text-[#003049] transition-all duration-200 group-hover:underline">
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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