import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Download, Plus, Search, Wrench } from "lucide-react";
import MaintenanceTable from "./MaintenanceTable";
import AddMaintenance from "./AddMaintenance";
import EditMaintenance from "./EditMaintenance";
import { getMaintenanceLogs, createMaintenance, closeMaintenance } from "../../services/maintenanceService";
import { getVehicles } from "../../services/vehicleService";

const MAINTENANCE_TYPES = [
  "Oil Change", "Engine Service", "Brake Inspection", "Tyre Replacement",
  "Battery Replacement", "AC Repair", "Clutch Repair", "Suspension Service",
  "Wheel Alignment", "General Inspection",
];
const STATUSES = ["Active", "Closed"];
const PAGE_SIZE = 8;

const mapStatusToFrontend = (status) => {
  const map = {
    ACTIVE: "In Progress",
    CLOSED: "Completed"
  };
  return map[status] || status;
};

const MaintenancePageContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [jobs, setJobs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState(urlSearch);
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(urlSearch);
    setPage(1);
  }, [urlSearch]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsRes, vehiclesRes] = await Promise.all([
        getMaintenanceLogs(),
        getVehicles(),
      ]);

      const dbLogs = logsRes.data?.logs || [];
      const mappedLogs = dbLogs.map(log => ({
        id: log.id,
        vehicleId: log.vehicleId,
        vehicleName: log.vehicle?.name || "Unknown Vehicle",
        regNumber: log.vehicle?.regNumber || "",
        type: log.type,
        description: log.description,
        cost: log.cost,
        status: mapStatusToFrontend(log.status),
        createdAt: log.createdAt,
        closedAt: log.closedAt,
      }));

      setJobs(mappedLogs);
      setVehicles(vehiclesRes.data?.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const vehicleOptions = useMemo(() => {
    return ["All", ...new Set(jobs.map((j) => j.vehicleName))];
  }, [jobs]);

  // ---------------------------------------------
  // KPI CALCULATIONS
  // ---------------------------------------------
  const kpis = useMemo(() => {
    const now = new Date();
    const completedThisMonth = jobs.filter((j) => {
      if (j.status !== "Completed" || !j.closedAt) return false;
      const d = new Date(j.closedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: jobs.length,
      inWorkshop: jobs.filter((j) => j.status === "In Progress").length,
      completedThisMonth,
      upcoming: jobs.filter((j) => j.status === "Scheduled" || j.status === "In Progress").length,
    };
  }, [jobs]);

  // ---------------------------------------------
  // FILTERING
  // ---------------------------------------------
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        j.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
        j.regNumber.toLowerCase().includes(search.toLowerCase()) ||
        (j.description && j.description.toLowerCase().includes(search.toLowerCase()));
      const matchesVehicle = vehicleFilter === "All" || j.vehicleName === vehicleFilter;
      const matchesType = typeFilter === "All" || j.type === typeFilter;
      const matchesStatus = statusFilter === "All" || j.status === statusFilter;
      return matchesSearch && matchesVehicle && matchesType && matchesStatus;
    });
  }, [jobs, search, vehicleFilter, typeFilter, statusFilter]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, page]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));

  // ---------------------------------------------
  // HANDLERS
  // ---------------------------------------------
  const handleRefresh = () => {
    loadData();
  };

  const handleExportCSV = () => {
    const headers = [
      "Maintenance ID", "Vehicle", "Registration Number", "Type", "Description",
      "Cost", "Date Created", "Date Closed", "Status",
    ];
    const rows = filteredJobs.map((j) => [
      j.id, j.vehicleName, j.regNumber, j.type, j.description || "",
      j.cost, j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "",
      j.closedAt ? new Date(j.closedAt).toLocaleDateString() : "", j.status,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance_jobs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddJob = async (newJob) => {
    try {
      const payload = {
        vehicleId: newJob.vehicleId,
        type: newJob.type,
        description: newJob.description,
        cost: Number(newJob.cost),
      };
      await createMaintenance(payload);
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Failed to schedule maintenance");
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      if (updatedJob.status === "Closed" || updatedJob.status === "CLOSED") {
        await closeMaintenance(updatedJob.id);
      }
      setShowEditModal(false);
      setSelectedJob(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Failed to update maintenance job");
    }
  };

  const handleDeleteJob = (id) => {
    alert("Maintenance logs cannot be deleted to preserve financial audit trails. You can close active jobs instead.");
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-[#111827] min-h-screen text-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Maintenance Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track vehicle servicing, repairs and workshop activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Maintenance Jobs" value={kpis.total} icon={<Wrench size={18} />} />
        <KpiCard label="Vehicles In Workshop" value={kpis.inWorkshop} accent="text-orange-400" />
        <KpiCard label="Completed This Month" value={kpis.completedThisMonth} accent="text-emerald-400" />
        <KpiCard label="Upcoming Services" value={kpis.upcoming} accent="text-blue-400" />
      </div>

      {/* Business Rule Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <p className="text-yellow-400 font-medium mb-2">Workshop Rules</p>
        <ul className="text-yellow-200/80 text-sm space-y-1 list-disc list-inside">
          <li>Vehicles marked "In Shop" cannot be assigned to trips.</li>
          <li>Completed maintenance automatically changes vehicle status to Available.</li>
          <li>Prevent duplicate active maintenance jobs for the same vehicle.</li>
        </ul>
      </div>

      {/* Workshop Timeline Card */}
      <div className="bg-[#1F2937] border border-gray-700/50 rounded-xl p-5 mb-6 shadow-sm">
        <p className="text-gray-200 font-medium mb-4">Workshop Lifecycle</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
          {[
            { label: "Available", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
            { label: "Maintenance Scheduled", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
            { label: "Vehicle In Workshop", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
            { label: "Maintenance Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
            { label: "Vehicle Available", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
          ].map((stage, idx, arr) => (
            <div key={stage.label} className="flex items-center gap-2 flex-1">
              <div
                className={`flex-1 text-center text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border ${stage.color}`}
              >
                {stage.label}
              </div>
              {idx < arr.length - 1 && (
                <span className="text-gray-600 hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by vehicle, registration or technician..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams((prev) => {
                if (e.target.value) {
                  prev.set('search', e.target.value);
                } else {
                  prev.delete('search');
                }
                return prev;
              });
              setPage(1);
            }}
            className="w-full bg-[#1F2937] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
          />
        </div>

        <select
          value={vehicleFilter}
          onChange={(e) => {
            setVehicleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
        >
          {vehicleOptions.map((v) => (
            <option key={v} value={v}>{v === "All" ? "All Vehicles" : v}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
        >
          <option value="All">All Types</option>
          {MAINTENANCE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
        >
          <option value="All">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
        >
          <Download size={16} />
          Export CSV
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#F5B301] text-gray-900 font-medium rounded-lg px-4 py-2 text-sm hover:brightness-95 transition"
        >
          <Plus size={16} />
          Schedule Maintenance
        </button>
      </div>

      {/* Table */}
      <MaintenanceTable
        jobs={paginatedJobs}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteJob}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Modals */}
      {showAddModal && (
        <AddMaintenance
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddJob}
          vehicles={vehicles}
        />
      )}

      {showEditModal && selectedJob && (
        <EditMaintenance
          job={selectedJob}
          onClose={() => {
            setShowEditModal(false);
            setSelectedJob(null);
          }}
          onUpdate={handleUpdateJob}
          vehicles={vehicles}
        />
      )}
    </div>
  );
};

const KpiCard = ({ label, value, accent = "text-white", icon }) => (
  <div className="bg-[#1F2937] rounded-xl p-4 shadow-sm border border-gray-700/50">
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm">{label}</p>
      {icon && <span className="text-gray-500">{icon}</span>}
    </div>
    <p className={`text-2xl font-semibold mt-2 ${accent}`}>{value}</p>
  </div>
);

export default MaintenancePageContent;