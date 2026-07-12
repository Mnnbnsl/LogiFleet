import { Eye, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusStyles = {
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
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
    {Array.from({ length: 10 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-3 bg-gray-700/50 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const MaintenanceTable = ({ jobs, loading, onEdit, page, totalPages, onPageChange }) => {
  const [viewJob, setViewJob] = useState(null);

  return (
    <div className="bg-[#1F2937] rounded-xl border border-gray-700/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Vehicle</th>
              <th className="px-4 py-3 whitespace-nowrap">Reg. Number</th>
              <th className="px-4 py-3 whitespace-nowrap">Type</th>
              <th className="px-4 py-3 whitespace-nowrap font-normal">Description</th>
              <th className="px-4 py-3 whitespace-nowrap">Cost</th>
              <th className="px-4 py-3 whitespace-nowrap">Date Created</th>
              <th className="px-4 py-3 whitespace-nowrap">Date Closed</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && jobs.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No maintenance records found.
                </td>
              </tr>
            )}

            {!loading &&
              jobs.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{j.id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 text-gray-100 font-medium whitespace-nowrap">{j.vehicleName}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.regNumber}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{j.type}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{j.description || "-"}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">₹{j.cost}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {j.closedAt ? new Date(j.closedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusPill status={j.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewJob(j)}
                        className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-100 transition"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      {j.status !== "Completed" && (
                        <button
                          onClick={() => onEdit(j)}
                          className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-[#F5B301] transition"
                          title="Close maintenance job"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
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

      {/* View Modal */}
      {viewJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F2937] rounded-xl border border-gray-700 w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-white font-semibold mb-4 text-lg border-b border-gray-700 pb-2">Maintenance Job Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Job ID</p>
                <p className="text-gray-200 mt-1 text-xs">{viewJob.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Vehicle Name</p>
                <p className="text-gray-200 mt-1 font-semibold">{viewJob.vehicleName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Reg. Number</p>
                <p className="text-gray-200 mt-1">{viewJob.regNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Type</p>
                <p className="text-gray-200 mt-1">{viewJob.type}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs uppercase font-medium">Description</p>
                <p className="text-gray-200 mt-1">{viewJob.description || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Cost</p>
                <p className="text-gray-200 mt-1">₹{viewJob.cost}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Status</p>
                <div className="mt-1">
                  <StatusPill status={viewJob.status} />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Date Created</p>
                <p className="text-gray-200 mt-1">
                  {viewJob.createdAt ? new Date(viewJob.createdAt).toLocaleString() : "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium">Date Closed</p>
                <p className="text-gray-200 mt-1">
                  {viewJob.closedAt ? new Date(viewJob.closedAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewJob(null)}
              className="mt-6 bg-[#F5B301] text-gray-900 font-semibold rounded-lg px-4 py-2.5 text-sm w-full transition hover:brightness-95 active:scale-[0.98]"
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