import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusStyles = {
  Scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const priorityStyles = {
  Low: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  Medium: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  Critical: "bg-red-500/10 text-red-400 border-red-500/30",
};

const StatusBadge = ({ status }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
      statusStyles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }`}
  >
    {status}
  </span>
);

const PriorityBadge = ({ priority }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
      priorityStyles[priority] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }`}
  >
    {priority}
  </span>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-800">
    {Array.from({ length: 12 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-gray-700/50 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const MaintenanceTable = ({ jobs, loading, onEdit, onDelete, page, totalPages, onPageChange }) => {
  const [viewJob, setViewJob] = useState(null);

  return (
    <div className="bg-[#1F2937] rounded-xl border border-gray-700/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Maintenance ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Vehicle</th>
              <th className="px-4 py-3 whitespace-nowrap">Reg. Number</th>
              <th className="px-4 py-3 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 whitespace-nowrap">Technician</th>
              <th className="px-4 py-3 whitespace-nowrap">Scheduled Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Completion Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Est. Cost</th>
              <th className="px-4 py-3 whitespace-nowrap">Actual Cost</th>
              <th className="px-4 py-3 whitespace-nowrap">Priority</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && jobs.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No maintenance jobs found matching your filters.
                </td>
              </tr>
            )}

            {!loading &&
              jobs.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.id}</td>
                  <td className="px-4 py-3 text-gray-100 font-medium whitespace-nowrap">{j.vehicleName}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.regNumber}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.type}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.technician}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.scheduledDate}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.completionDate || "-"}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">₹{j.estimatedCost.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {j.actualCost ? `₹${j.actualCost.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <PriorityBadge priority={j.priority} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewJob(j)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-100 transition"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onEdit(j)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-[#F5B301] transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(j.id)}
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
      {viewJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F2937] rounded-xl border border-gray-700 w-full max-w-lg p-6">
            <h3 className="text-white font-semibold mb-4">{viewJob.id} — {viewJob.vehicleName}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm max-h-[60vh] overflow-y-auto">
              {Object.entries(viewJob).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500 text-xs uppercase">{key}</p>
                  <p className="text-gray-200">{String(value) || "-"}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setViewJob(null)}
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

export default MaintenanceTable;