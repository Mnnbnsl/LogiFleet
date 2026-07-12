// src/components/driver/DriverTable.jsx
import { useState } from "react";
import {
  CircleUserRound,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

/**
 * DriverTable
 * ----------------------------------------------------
 * Presentational table for the Driver Registry.
 * Aligned with DB schema.
 * ----------------------------------------------------
 */

const STATUS_STYLES = {
  Available:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "On Trip": "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "Off Duty":
    "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300",
  Suspended: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const TABLE_COLUMNS = [
  "Driver Name",
  "License Number",
  "License Category",
  "License Expiry",
  "Contact Number",
  "Safety Score",
  "Current Status",
  "Actions",
];

const Badge = ({ label, styles }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
      styles[label] ||
      "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
    }`}
  >
    {label}
  </span>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    {TABLE_COLUMNS.map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 w-full max-w-[120px] animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
      </td>
    ))}
  </tr>
);

const isExpiringSoon = (dateStr) => {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const now = new Date();
  const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
  return diffDays < 60;
};

const DriverTable = ({
  drivers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 8,
  onPageChange,
}) => {
  const [viewDriver, setViewDriver] = useState(null);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-[#1F2937]">
      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && drivers.length === 0 && (
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                      <Inbox size={22} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      No drivers found
                    </p>
                    <p className="max-w-xs text-xs text-gray-400 dark:text-gray-500">
                      Try adjusting your search or filters, or add a new
                      driver to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b border-gray-100 transition-colors duration-150 last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                >
                  {/* Driver Name */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-300">
                        <CircleUserRound size={20} />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {driver.name}
                      </span>
                    </div>
                  </td>

                  {/* License Number */}
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-700 dark:text-gray-300">
                    {driver.licenseNumber}
                  </td>

                  {/* License Category */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600 dark:text-gray-400">
                    {driver.licenseCategory}
                  </td>

                  {/* License Expiry */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span
                      className={
                        isExpiringSoon(driver.licenseExpiry)
                          ? "font-medium text-red-500 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : ""}
                    </span>
                  </td>

                  {/* Contact Number */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-gray-600 dark:text-gray-400">
                    {driver.contactNumber}
                  </td>

                  {/* Safety Score */}
                  <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300">
                    {driver.safetyScore} / 100
                  </td>

                  {/* Current Status */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <Badge label={driver.status} styles={STATUS_STYLES} />
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewDriver(driver)}
                        title="View driver"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit?.(driver)}
                        title="Edit driver"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-400/10 dark:hover:text-yellow-300"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete?.(driver)}
                        title="Delete driver"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{startItem}</span> to{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{endItem}</span> of{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{totalItems}</span> drivers
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Simple View Modal */}
      {viewDriver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg border-b pb-2">Driver Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">Driver Name</p>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">{viewDriver.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">License Number</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewDriver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">License Category</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewDriver.licenseCategory}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">License Expiry</p>
                <p className="text-gray-900 dark:text-white mt-1">
                  {viewDriver.licenseExpiry ? new Date(viewDriver.licenseExpiry).toLocaleDateString() : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">Contact Number</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewDriver.contactNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-medium">Safety Score</p>
                <p className="text-gray-900 dark:text-white mt-1">{viewDriver.safetyScore} / 100</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs uppercase font-medium">Status</p>
                <div className="mt-1">
                  <Badge label={viewDriver.status} styles={STATUS_STYLES} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setViewDriver(null)}
              className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 text-sm w-full transition active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverTable;