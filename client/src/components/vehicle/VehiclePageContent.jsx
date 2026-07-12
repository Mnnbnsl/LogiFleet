import { useState, useMemo } from "react";
import { RefreshCw, Download, Plus, Search, Truck } from "lucide-react";
import VehicleTable from "./VehicleTable";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";

// ---------------------------------------------
// MOCK DATA
// ---------------------------------------------
const initialVehicles = [
  {
    id: "VEH-001",
    regNumber: "PB10AZ2345",
    name: "Ashok Leyland Ecomet",
    type: "Truck",
    manufacturer: "Ashok Leyland",
    model: "Ecomet 1615",
    year: 2021,
    fuelType: "Diesel",
    capacity: "10 Ton",
    assignedDriver: "Rajwinder Singh",
    currentTrip: "TRP-1042",
    mileage: 84210,
    insuranceExpiry: "2026-11-14",
    fitnessExpiry: "2027-02-10",
    lastService: "2026-05-01",
    vin: "MA3ERLF1S00123456",
    status: "On Trip",
    notes: "Regular highway route Ludhiana-Delhi.",
  },
  {
    id: "VEH-002",
    regNumber: "HR38AC1112",
    name: "Tata 407 Mini",
    type: "Mini Truck",
    manufacturer: "Tata Motors",
    model: "407 Gold SFC",
    year: 2022,
    fuelType: "Diesel",
    capacity: "5 Ton",
    assignedDriver: "Unassigned",
    currentTrip: "-",
    mileage: 42890,
    insuranceExpiry: "2026-09-05",
    fitnessExpiry: "2026-12-22",
    lastService: "2026-06-18",
    vin: "MAT448023N1B78901",
    status: "Available",
    notes: "Used for last-mile city delivery.",
  },
  {
    id: "VEH-003",
    regNumber: "DL1LX2209",
    name: "Eicher Pro Container",
    type: "Container Truck",
    manufacturer: "Eicher",
    model: "Pro 3015",
    year: 2020,
    fuelType: "Diesel",
    capacity: "18 Ton",
    assignedDriver: "Manpreet Kaur",
    currentTrip: "-",
    mileage: 112340,
    insuranceExpiry: "2026-08-01",
    fitnessExpiry: "2026-07-30",
    lastService: "2026-04-02",
    vin: "MEEP3015KL045678",
    status: "Maintenance",
    notes: "Brake pad replacement in progress.",
  },
  {
    id: "VEH-004",
    regNumber: "PB65B7788",
    name: "Mahindra Bolero Pickup",
    type: "Pickup",
    manufacturer: "Mahindra",
    model: "Bolero Pik-Up",
    year: 2023,
    fuelType: "Diesel",
    capacity: "5 Ton",
    assignedDriver: "Gurpreet Singh",
    currentTrip: "TRP-1050",
    mileage: 21870,
    insuranceExpiry: "2027-01-19",
    fitnessExpiry: "2027-03-11",
    lastService: "2026-06-30",
    vin: "MA1TF2CD9P0034512",
    status: "On Trip",
    notes: "Assigned to Zone-3 distribution.",
  },
  {
    id: "VEH-005",
    regNumber: "HR55CX9081",
    name: "BharatBenz Tanker",
    type: "Tanker",
    manufacturer: "BharatBenz",
    model: "3123R",
    year: 2019,
    fuelType: "Diesel",
    capacity: "22 Ton",
    assignedDriver: "Sukhwinder Singh",
    currentTrip: "-",
    mileage: 158720,
    insuranceExpiry: "2026-07-25",
    fitnessExpiry: "2026-09-14",
    lastService: "2026-03-22",
    vin: "MB1B3123RN0056789",
    status: "Out of Service",
    notes: "Engine overhaul pending approval.",
  },
  {
    id: "VEH-006",
    regNumber: "PB08G4432",
    name: "Tata Ace CNG",
    type: "Mini Truck",
    manufacturer: "Tata Motors",
    model: "Ace CNG+",
    year: 2023,
    fuelType: "CNG",
    capacity: "5 Ton",
    assignedDriver: "Unassigned",
    currentTrip: "-",
    mileage: 15600,
    insuranceExpiry: "2027-04-02",
    fitnessExpiry: "2027-05-19",
    lastService: "2026-06-10",
    vin: "MAT600921N2C67890",
    status: "Available",
    notes: "Eco-friendly fleet addition.",
  },
  {
    id: "VEH-007",
    regNumber: "DL8CAF5567",
    name: "Ashok Leyland Trailer",
    type: "Trailer",
    manufacturer: "Ashok Leyland",
    model: "U-3123 Trailer",
    year: 2018,
    fuelType: "Diesel",
    capacity: "22 Ton",
    assignedDriver: "Baljeet Singh",
    currentTrip: "TRP-1061",
    mileage: 201450,
    insuranceExpiry: "2026-10-30",
    fitnessExpiry: "2026-08-05",
    lastService: "2026-02-14",
    vin: "MA9U3123NL0078901",
    status: "On Trip",
    notes: "Long-haul interstate cargo.",
  },
  {
    id: "VEH-008",
    regNumber: "PB29K3345",
    name: "Mahindra Furio Truck",
    type: "Truck",
    manufacturer: "Mahindra",
    model: "Furio 12",
    year: 2022,
    fuelType: "Diesel",
    capacity: "10 Ton",
    assignedDriver: "Harpreet Kaur",
    currentTrip: "-",
    mileage: 67890,
    insuranceExpiry: "2026-12-05",
    fitnessExpiry: "2027-01-28",
    lastService: "2026-06-01",
    vin: "MA6F12KLM0089012",
    status: "Available",
    notes: "Backup unit for peak season.",
  },
  {
    id: "VEH-009",
    regNumber: "HR26DK7789",
    name: "Tata Electric Pickup",
    type: "Pickup",
    manufacturer: "Tata Motors",
    model: "Ace EV",
    year: 2024,
    fuelType: "Electric",
    capacity: "5 Ton",
    assignedDriver: "Simran Kaur",
    currentTrip: "TRP-1072",
    mileage: 8420,
    insuranceExpiry: "2027-06-15",
    fitnessExpiry: "2027-07-20",
    lastService: "2026-06-25",
    vin: "MAT700EV3N0090123",
    status: "On Trip",
    notes: "Pilot EV unit for city zone.",
  },
  {
    id: "VEH-010",
    regNumber: "DL4CAM2298",
    name: "Eicher Container XL",
    type: "Container Truck",
    manufacturer: "Eicher",
    model: "Pro 6031",
    year: 2020,
    fuelType: "Diesel",
    capacity: "18 Ton",
    assignedDriver: "Unassigned",
    currentTrip: "-",
    mileage: 134560,
    insuranceExpiry: "2026-07-10",
    fitnessExpiry: "2026-07-05",
    lastService: "2026-01-30",
    vin: "MEEP6031KL0101234",
    status: "Maintenance",
    notes: "Awaiting fitness re-certification.",
  },
  {
    id: "VEH-011",
    regNumber: "PB11L5567",
    name: "BharatBenz Heavy Truck",
    type: "Truck",
    manufacturer: "BharatBenz",
    model: "4223C",
    year: 2019,
    fuelType: "Diesel",
    capacity: "22 Ton",
    assignedDriver: "Jaspreet Singh",
    currentTrip: "-",
    mileage: 178900,
    insuranceExpiry: "2026-09-22",
    fitnessExpiry: "2026-11-11",
    lastService: "2026-05-15",
    vin: "MB4C4223CN0112345",
    status: "Available",
    notes: "Recently returned from service.",
  },
  {
    id: "VEH-012",
    regNumber: "HR51M6678",
    name: "Mahindra CNG Truck",
    type: "Truck",
    manufacturer: "Mahindra",
    model: "Blazo CNG",
    year: 2023,
    fuelType: "CNG",
    capacity: "10 Ton",
    assignedDriver: "Amrit Pal",
    currentTrip: "TRP-1088",
    mileage: 29870,
    insuranceExpiry: "2027-02-28",
    fitnessExpiry: "2027-04-09",
    lastService: "2026-06-20",
    vin: "MABZCNG4N0123456",
    status: "On Trip",
    notes: "Assigned to dairy cold-chain route.",
  },
  {
    id: "VEH-013",
    regNumber: "PB03N8890",
    name: "Tata Signa Tanker",
    type: "Tanker",
    manufacturer: "Tata Motors",
    model: "Signa 4225",
    year: 2021,
    fuelType: "Diesel",
    capacity: "18 Ton",
    assignedDriver: "Unassigned",
    currentTrip: "-",
    mileage: 95430,
    insuranceExpiry: "2026-08-19",
    fitnessExpiry: "2026-10-02",
    lastService: "2026-04-28",
    vin: "MAT4225SN0134567",
    status: "Available",
    notes: "Fuel transport, weekly route.",
  },
];

const VEHICLE_TYPES = ["Truck", "Mini Truck", "Trailer", "Pickup", "Container Truck", "Tanker"];
const STATUSES = ["Available", "On Trip", "Maintenance", "Out of Service"];
const PAGE_SIZE = 8;

const VehiclePageContent = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  const handleExportCSV = () => {
    const headers = [
      "Vehicle ID", "Registration Number", "Vehicle Name", "Vehicle Type",
      "Manufacturer", "Fuel Type", "Capacity", "Assigned Driver",
      "Current Trip", "Insurance Expiry", "Fitness Expiry", "Status",
    ];
    const rows = filteredVehicles.map((v) => [
      v.id, v.regNumber, v.name, v.type, v.manufacturer, v.fuelType,
      v.capacity, v.assignedDriver, v.currentTrip, v.insuranceExpiry,
      v.fitnessExpiry, v.status,
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

  const handleAddVehicle = (newVehicle) => {
    const nextId = `VEH-${String(vehicles.length + 1).padStart(3, "0")}`;
    setVehicles((prev) => [...prev, { ...newVehicle, id: nextId, currentTrip: "-" }]);
    setShowAddModal(false);
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
    setShowEditModal(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
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