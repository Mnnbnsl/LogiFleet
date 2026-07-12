import { useState, useMemo } from "react";
import { RefreshCw, Download, Plus, Search, Wrench } from "lucide-react";
import MaintenanceTable from "./MaintenanceTable";
import AddMaintenance from "./AddMaintenance";
import EditMaintenance from "./EditMaintenance";

// ---------------------------------------------
// MOCK DATA
// ---------------------------------------------
const initialJobs = [
  {
    id: "MNT-001",
    vehicleName: "Ashok Leyland Ecomet",
    regNumber: "PB10AZ2345",
    type: "Oil Change",
    description: "Routine engine oil and filter change.",
    priority: "Low",
    technician: "Rahul Singh",
    workshop: "LogiFleet Workshop A",
    scheduledDate: "2026-07-08",
    completionDate: "2026-07-08",
    estimatedCost: 2500,
    actualCost: 2450,
    partsReplaced: "Oil Filter, Engine Oil",
    odometer: 84210,
    status: "Completed",
    notes: "No issues found during inspection.",
  },
  {
    id: "MNT-002",
    vehicleName: "Eicher Pro Container",
    regNumber: "DL1LX2209",
    type: "Brake Inspection",
    description: "Brake pad wear check and replacement.",
    priority: "High",
    technician: "Ankit Sharma",
    workshop: "North Hub Workshop",
    scheduledDate: "2026-07-05",
    completionDate: "",
    estimatedCost: 8500,
    actualCost: 0,
    partsReplaced: "",
    odometer: 112340,
    status: "In Progress",
    notes: "Front brake pads worn below safety threshold.",
  },
  {
    id: "MNT-003",
    vehicleName: "Tata Signa Tanker",
    regNumber: "PB03N8890",
    type: "General Inspection",
    description: "Quarterly fitness and safety inspection.",
    priority: "Medium",
    technician: "Deepak Kumar",
    workshop: "Punjab Fleet Garage",
    scheduledDate: "2026-07-18",
    completionDate: "",
    estimatedCost: 1200,
    actualCost: 0,
    partsReplaced: "",
    odometer: 95430,
    status: "Scheduled",
    notes: "Standard quarterly checkup.",
  },
  {
    id: "MNT-004",
    vehicleName: "BharatBenz Tanker",
    regNumber: "HR55CX9081",
    type: "Engine Service",
    description: "Full engine overhaul due to overheating.",
    priority: "Critical",
    technician: "Suresh Verma",
    workshop: "Delhi Service Center",
    scheduledDate: "2026-06-28",
    completionDate: "",
    estimatedCost: 45000,
    actualCost: 0,
    partsReplaced: "",
    odometer: 158720,
    status: "In Progress",
    notes: "Engine overhaul pending parts approval.",
  },
  {
    id: "MNT-005",
    vehicleName: "Ashok Leyland Trailer",
    regNumber: "DL8CAF5567",
    type: "Tyre Replacement",
    description: "Replace worn rear tyres.",
    priority: "High",
    technician: "Rahul Singh",
    workshop: "LogiFleet Workshop A",
    scheduledDate: "2026-07-02",
    completionDate: "2026-07-03",
    estimatedCost: 22000,
    actualCost: 21500,
    partsReplaced: "4x Rear Tyres",
    odometer: 201450,
    status: "Completed",
    notes: "Tyres replaced with branded set.",
  },
  {
    id: "MNT-006",
    vehicleName: "Eicher Container XL",
    regNumber: "DL4CAM2298",
    type: "AC Repair",
    description: "Cabin AC not cooling properly.",
    priority: "Medium",
    technician: "Ankit Sharma",
    workshop: "North Hub Workshop",
    scheduledDate: "2026-07-10",
    completionDate: "",
    estimatedCost: 4500,
    actualCost: 0,
    partsReplaced: "",
    odometer: 134560,
    status: "Scheduled",
    notes: "AC compressor suspected faulty.",
  },
  {
    id: "MNT-007",
    vehicleName: "Mahindra Furio Truck",
    regNumber: "PB29K3345",
    type: "Battery Replacement",
    description: "Battery not holding charge.",
    priority: "Medium",
    technician: "Deepak Kumar",
    workshop: "Punjab Fleet Garage",
    scheduledDate: "2026-06-25",
    completionDate: "2026-06-25",
    estimatedCost: 6500,
    actualCost: 6500,
    partsReplaced: "12V Battery",
    odometer: 67890,
    status: "Completed",
    notes: "Old battery disposed as per policy.",
  },
  {
    id: "MNT-008",
    vehicleName: "Tata 407 Mini",
    regNumber: "HR38AC1112",
    type: "Clutch Repair",
    description: "Clutch slipping under load.",
    priority: "High",
    technician: "Suresh Verma",
    workshop: "Delhi Service Center",
    scheduledDate: "2026-07-14",
    completionDate: "",
    estimatedCost: 12000,
    actualCost: 0,
    partsReplaced: "",
    odometer: 42890,
    status: "Scheduled",
    notes: "Driver reported slipping since last week.",
  },
  {
    id: "MNT-009",
    vehicleName: "Mahindra Bolero Pickup",
    regNumber: "PB65B7788",
    type: "Suspension Service",
    description: "Front suspension noise inspection.",
    priority: "Low",
    technician: "Rahul Singh",
    workshop: "LogiFleet Workshop A",
    scheduledDate: "2026-07-01",
    completionDate: "2026-07-01",
    estimatedCost: 3200,
    actualCost: 3000,
    partsReplaced: "Bush Kit",
    odometer: 21870,
    status: "Completed",
    notes: "Bush kit replaced, noise resolved.",
  },
  {
    id: "MNT-010",
    vehicleName: "BharatBenz Heavy Truck",
    regNumber: "PB11L5567",
    type: "Wheel Alignment",
    description: "Uneven tyre wear reported.",
    priority: "Medium",
    technician: "Ankit Sharma",
    workshop: "North Hub Workshop",
    scheduledDate: "2026-07-20",
    completionDate: "",
    estimatedCost: 1800,
    actualCost: 0,
    partsReplaced: "",
    odometer: 178900,
    status: "Scheduled",
    notes: "Recommended after tyre inspection.",
  },
  {
    id: "MNT-011",
    vehicleName: "Mahindra CNG Truck",
    regNumber: "HR51M6678",
    type: "General Inspection",
    description: "CNG cylinder safety check.",
    priority: "Critical",
    technician: "Deepak Kumar",
    workshop: "Punjab Fleet Garage",
    scheduledDate: "2026-06-30",
    completionDate: "2026-07-01",
    estimatedCost: 2000,
    actualCost: 2000,
    partsReplaced: "",
    odometer: 29870,
    status: "Completed",
    notes: "Cylinder certified safe for another year.",
  },
  {
    id: "MNT-012",
    vehicleName: "Tata Ace CNG",
    regNumber: "PB08G4432",
    type: "Oil Change",
    description: "Scheduled oil change interval reached.",
    priority: "Low",
    technician: "Suresh Verma",
    workshop: "Delhi Service Center",
    scheduledDate: "2026-07-22",
    completionDate: "",
    estimatedCost: 1800,
    actualCost: 0,
    partsReplaced: "",
    odometer: 15600,
    status: "Scheduled",
    notes: "Routine service, no issues reported.",
  },
  {
    id: "MNT-013",
    vehicleName: "Tata Electric Pickup",
    regNumber: "HR26DK7789",
    type: "General Inspection",
    description: "EV battery health diagnostic.",
    priority: "Medium",
    technician: "Rahul Singh",
    workshop: "LogiFleet Workshop A",
    scheduledDate: "2026-07-15",
    completionDate: "",
    estimatedCost: 3000,
    actualCost: 0,
    partsReplaced: "",
    odometer: 8420,
    status: "Cancelled",
    notes: "Cancelled - vehicle sent to OEM service instead.",
  },
  {
    id: "MNT-014",
    vehicleName: "Ashok Leyland Ecomet",
    regNumber: "PB10AZ2345",
    type: "Tyre Replacement",
    description: "Spare tyre replacement after puncture.",
    priority: "Low",
    technician: "Ankit Sharma",
    workshop: "North Hub Workshop",
    scheduledDate: "2026-06-20",
    completionDate: "2026-06-20",
    estimatedCost: 5000,
    actualCost: 4800,
    partsReplaced: "1x Tyre",
    odometer: 83900,
    status: "Completed",
    notes: "Puncture repaired, spare replaced.",
  },
  {
    id: "MNT-015",
    vehicleName: "Eicher Pro Container",
    regNumber: "DL1LX2209",
    type: "AC Repair",
    description: "Cabin AC compressor replacement.",
    priority: "High",
    technician: "Deepak Kumar",
    workshop: "Punjab Fleet Garage",
    scheduledDate: "2026-07-25",
    completionDate: "",
    estimatedCost: 9500,
    actualCost: 0,
    partsReplaced: "",
    odometer: 112900,
    status: "Scheduled",
    notes: "Compressor ordered, awaiting delivery.",
  },
];

const MAINTENANCE_TYPES = [
  "Oil Change", "Engine Service", "Brake Inspection", "Tyre Replacement",
  "Battery Replacement", "AC Repair", "Clutch Repair", "Suspension Service",
  "Wheel Alignment", "General Inspection",
];
const STATUSES = ["Scheduled", "In Progress", "Completed", "Cancelled"];
const PAGE_SIZE = 8;

const MaintenancePageContent = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const vehicleOptions = useMemo(
    () => ["All", ...new Set(initialJobs.map((j) => j.vehicleName))],
    []
  );

  // ---------------------------------------------
  // KPI CALCULATIONS
  // ---------------------------------------------
  const kpis = useMemo(() => {
    const now = new Date("2026-07-12");
    const completedThisMonth = jobs.filter((j) => {
      if (j.status !== "Completed" || !j.completionDate) return false;
      const d = new Date(j.completionDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: jobs.length,
      inWorkshop: jobs.filter((j) => j.status === "In Progress").length,
      completedThisMonth,
      upcoming: jobs.filter((j) => j.status === "Scheduled").length,
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
        j.technician.toLowerCase().includes(search.toLowerCase());
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
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  const handleExportCSV = () => {
    const headers = [
      "Maintenance ID", "Vehicle", "Registration Number", "Type", "Technician",
      "Scheduled Date", "Completion Date", "Estimated Cost", "Actual Cost",
      "Priority", "Status",
    ];
    const rows = filteredJobs.map((j) => [
      j.id, j.vehicleName, j.regNumber, j.type, j.technician,
      j.scheduledDate, j.completionDate, j.estimatedCost, j.actualCost,
      j.priority, j.status,
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

  const handleAddJob = (newJob) => {
    const nextId = `MNT-${String(jobs.length + 1).padStart(3, "0")}`;
    setJobs((prev) => [...prev, { ...newJob, id: nextId }]);
    setShowAddModal(false);
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setShowEditModal(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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