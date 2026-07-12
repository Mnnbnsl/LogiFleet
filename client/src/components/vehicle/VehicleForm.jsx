// src/components/vehicle/VehicleForm.jsx
import { useState } from "react";

const VEHICLE_TYPES = ["Truck", "Mini Truck", "Trailer", "Pickup", "Container Truck", "Tanker", "Cargo Van", "High Roof Van", "Refrigerator Truck", "Box Truck", "Semi-Truck", "Flatbed Truck"];
const STATUSES = ["Available", "On Trip", "Maintenance", "Out of Service"];

const defaultValues = {
  regNumber: "",
  name: "",
  type: VEHICLE_TYPES[0],
  model: "",
  maxLoadCapacity: "",
  odometer: 0,
  acquisitionCost: "",
  region: "",
  status: STATUSES[0],
};

const VehicleForm = ({ initialData, onSubmit, onCancel, submitLabel = "Save Vehicle" }) => {
  const [formData, setFormData] = useState(() => {
    const data = { ...defaultValues, ...initialData };
    // Map maxLoadCapacity to display in capacity if capacity is not defined
    if (initialData?.maxLoadCapacity !== undefined) {
      data.maxLoadCapacity = initialData.maxLoadCapacity;
    }
    return data;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "odometer" || name === "maxLoadCapacity" || name === "acquisitionCost" 
        ? (value === "" ? "" : Number(value)) 
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass =
    "w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50";
  const labelClass = "text-xs text-gray-400 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Registration Number */}
        <div>
          <label className={labelClass}>Registration Number</label>
          <input
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. VAN-01"
            required
          />
        </div>

        {/* Vehicle Name */}
        <div>
          <label className={labelClass}>Vehicle Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Mercedes Sprinter"
            required
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className={labelClass}>Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          >
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className={labelClass}>Model</label>
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Sprinter Cargo 2024"
            required
          />
        </div>

        {/* Max Load Capacity */}
        <div>
          <label className={labelClass}>Max Load Capacity (kg)</label>
          <input
            type="number"
            name="maxLoadCapacity"
            value={formData.maxLoadCapacity}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 1200"
            required
          />
        </div>

        {/* Current Odometer */}
        <div>
          <label className={labelClass}>Current Odometer (km)</label>
          <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            className={inputClass}
            placeholder="0"
          />
        </div>

        {/* Acquisition Cost */}
        <div>
          <label className={labelClass}>Acquisition Cost (₹)</label>
          <input
            type="number"
            name="acquisitionCost"
            value={formData.acquisitionCost}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 45000"
            required
          />
        </div>

        {/* Region */}
        <div>
          <label className={labelClass}>Region</label>
          <input
            name="region"
            value={formData.region || ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. North"
          />
        </div>

        {/* Status */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F5B301] text-gray-900 hover:brightness-95 transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;