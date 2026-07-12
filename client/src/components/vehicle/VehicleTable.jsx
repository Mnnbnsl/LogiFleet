import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusStyles = {
  Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "On Trip": "bg-[#F5B301]/10 text-[#F5B301] border-[#F5B301]/30",
  Maintenance: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "Out of Service": "bg-red-500/10 text-red-400 border-red-500/30",
};

const StatusPill = ({ status }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
      statusStyles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }`}
  >
    {status}
  </span>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-800">
    {Array.from({ length: 13 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-gray-700/50 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const VehicleTable = ({ vehicles, loading, onEdit, onDelete, page, totalPages, onPageChange }) => {
  const [viewVehicle, setViewVehicle] = useState(null);

  return (
    <div className="bg-[#1F2937] rounded-xl border border-gray-700/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Vehicle ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Reg. Number</th>
              <th className="px-4 py-3 whitespace-nowrap">Vehicle Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 whitespace-nowrap">Manufacturer</th>
              <th className="px-4 py-3 whitespace-nowrap">Fuel Type</th>
              <th className="px-4 py-3 whitespace-nowrap">Capacity</th>
              <th className="px-4 py-3 whitespace-nowrap">Assigned Driver</th>
              <th className="px-4 py-3 whitespace-nowrap">Current Trip</th>
              <th className="px-4 py-3 whitespace-nowrap">Insurance Expiry</th>
              <th className="px-4 py-3 whitespace-nowrap">Fitness Expiry</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && vehicles.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                  No vehicles found matching your filters.
                </td>
              </tr>
            )}

            {!loading &&
              vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.id}</td>
                  <td className="px-4 py-3 text-gray-100 font-medium whitespace-nowrap">{v.regNumber}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.name}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.type}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.manufacturer}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.fuelType}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.capacity}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.assignedDriver}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.currentTrip}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.insuranceExpiry}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{v.fitnessExpiry}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusPill status={v.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewVehicle(v)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-100 transition"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEdit(v)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-[#F5B301] transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(v.id)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md bg-gray-800 text-gray-400 disabled:opacity-40 hover:bg-gray-700 transition"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md bg-gray-800 text-gray-400 disabled:opacity-40 hover:bg-gray-700 transition"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Simple View Modal */}
      {viewVehicle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F2937] rounded-xl border border-gray-700 w-full max-w-lg p-6">
            <h3 className="text-white font-semibold mb-4">{viewVehicle.name}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(viewVehicle).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500 text-xs uppercase">{key}</p>
                  <p className="text-gray-200">{String(value)}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setViewVehicle(null)}
              className="mt-5 bg-[#F5B301] text-gray-900 font-medium rounded-lg px-4 py-2 text-sm w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;