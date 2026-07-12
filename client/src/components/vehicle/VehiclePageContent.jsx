import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Download, Plus, Search, Truck } from "lucide-react";
import VehicleTable from "./VehicleTable";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "../../services/vehicleService";

const VEHICLE_TYPES = ["Truck", "Mini Truck", "Trailer", "Pickup", "Container Truck", "Tanker", "Cargo Van", "High Roof Van", "Refrigerator Truck", "Box Truck", "Semi-Truck", "Flatbed Truck"];
const STATUSES = ["Available", "On Trip", "Maintenance", "Out of Service"];
const PAGE_SIZE = 8;

const mapStatusToFrontend = (status) => {
  const map = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "Maintenance",
    RETIRED: "Out of Service"
  };
  return map[status] || status;
};

const mapStatusToBackend = (status) => {
  const map = {
    "Available": "AVAILABLE",
    "On Trip": "ON_TRIP",
    "Maintenance": "IN_SHOP",
    "Out of Service": "RETIRED"
  };
  return map[status] || status;
};

const VehiclePageContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState(urlSearch);
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
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      const dbVehicles = res.data?.vehicles || [];
      const mapped = dbVehicles.map(v => ({
        ...v,
        status: mapStatusToFrontend(v.status),
        assignedDriver: v.trips?.[0]?.driver?.name || "Unassigned",
        currentTrip: v.trips?.[0]?.id ? `TRP-${v.trips[0].id.substring(0, 8)}` : "-",
      }));
      setVehicles(mapped);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // ---------------------------------------------
  // KPI CALCULATIONS
  // ---------------------------------------------
  const kpis = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "Available").length,
      onTrip: vehicles.filter((v) => v.status === "On Trip").length,
      maintenance: vehicles.filter((v) => v.status === "Maintenance").length,
    };
  }, [vehicles]);

  // ---------------------------------------------
  // FILTERING
  // ---------------------------------------------
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.regNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.assignedDriver.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || v.type === typeFilter;
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, search, typeFilter, statusFilter]);

  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVehicles.slice(start, start + PAGE_SIZE);
  }, [filteredVehicles, page]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));

  // ---------------------------------------------
  // HANDLERS
  // ---------------------------------------------
  const handleRefresh = () => {
    loadVehicles();
  };

  const handleExportCSV = () => {
    const headers = [
      "Vehicle ID", "Registration Number", "Vehicle Name", "Vehicle Type",
      "Model", "Max Load Capacity (kg)", "Odometer (km)", "Acquisition Cost", "Region", "Assigned Driver",
      "Current Trip", "Status",
    ];
    const rows = filteredVehicles.map((v) => [
      v.id, v.regNumber, v.name, v.type, v.model, v.maxLoadCapacity,
      v.odometer, v.acquisitionCost, v.region || "", v.assignedDriver, v.currentTrip, v.status,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vehicle_registry.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddVehicle = async (newVehicle) => {
    try {
      const payload = {
        regNumber: newVehicle.regNumber,
        name: newVehicle.name,
        type: newVehicle.type,
        model: newVehicle.model,
        maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
        acquisitionCost: Number(newVehicle.acquisitionCost),
        region: newVehicle.region,
        status: mapStatusToBackend(newVehicle.status)
      };
      await createVehicle(payload);
      setShowAddModal(false);
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Failed to add vehicle");
    }
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const statusBackend = mapStatusToBackend(updatedVehicle.status);
      const payload = {
        regNumber: updatedVehicle.regNumber,
        name: updatedVehicle.name,
        type: updatedVehicle.type,
        model: updatedVehicle.model,
        maxLoadCapacity: Number(updatedVehicle.maxLoadCapacity),
        acquisitionCost: Number(updatedVehicle.acquisitionCost),
        region: updatedVehicle.region,
        odometer: Number(updatedVehicle.odometer)
      };
      
      // The backend update schema only allows direct status update if it is AVAILABLE.
      // Other status transitions happen during trip dispatching or maintenance logging.
      if (statusBackend === "AVAILABLE") {
        payload.status = "AVAILABLE";
      }

      await updateVehicle(selectedVehicle.id, payload);
      setShowEditModal(false);
      setSelectedVehicle(null);
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!confirm("Are you sure you want to retire (soft delete) this vehicle?")) return;
    try {
      await deleteVehicle(id);
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.error?.message || err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 bg-[#111827] min-h-screen text-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Vehicle Registry</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage fleet assets, assignments and maintenance readiness.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Vehicles" value={kpis.total} icon={<Truck size={18} />} />
        <KpiCard label="Available" value={kpis.available} accent="text-emerald-400" />
        <KpiCard label="On Trip" value={kpis.onTrip} accent="text-[#F5B301]" />
        <KpiCard label="Under Maintenance" value={kpis.maintenance} accent="text-red-400" />
      </div>

      {/* Business Rule Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <p className="text-yellow-400 font-medium mb-2">Fleet Rules</p>
        <ul className="text-yellow-200/80 text-sm space-y-1 list-disc list-inside">
          <li>Vehicles under maintenance cannot be assigned.</li>
          <li>Insurance and Fitness certificates must be valid.</li>
          <li>One vehicle cannot have two active trips.</li>
        </ul>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by registration, name or driver..."
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
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#1F2937] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
        >
          <option value="All">All Types</option>
          {VEHICLE_TYPES.map((t) => (
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
          Add Vehicle
        </button>
      </div>

      {/* Table */}
      <VehicleTable
        vehicles={paginatedVehicles}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteVehicle}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Modals */}
      {showAddModal && (
        <AddVehicle
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddVehicle}
        />
      )}

      {showEditModal && selectedVehicle && (
        <EditVehicle
          vehicle={selectedVehicle}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVehicle(null);
          }}
          onUpdate={handleUpdateVehicle}
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

export default VehiclePageContent;