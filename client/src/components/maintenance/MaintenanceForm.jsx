// src/components/maintenance/MaintenanceForm.jsx
import { useState } from "react";

const MAINTENANCE_TYPES = [
  "Oil Change", "Engine Service", "Brake Inspection", "Tyre Replacement",
  "Battery Replacement", "AC Repair", "Clutch Repair", "Suspension Service",
  "Wheel Alignment", "General Inspection",
];
const STATUSES = ["Active", "Closed"];

const defaultValues = {
  vehicleId: "",
  type: MAINTENANCE_TYPES[0],
  description: "",
  cost: "",
  status: STATUSES[0],
};

const MaintenanceForm = ({ initialData, onSubmit, onCancel, vehicles = [], submitLabel = "Save" }) => {
  const [formData, setFormData] = useState(() => {
    const data = { ...defaultValues, ...initialData };
    return data;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      alert("Please select a vehicle.");
      return;
    }
    onSubmit(formData);
  };

  const inputClass =
    "w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50";
  const labelClass = "text-xs text-gray-400 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Vehicle Selection */}
        <div>
          <label className={labelClass}>Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={inputClass}
            required
            disabled={!!initialData?.id} // Disable changing vehicle on edit
          >
            <option value="">Select a Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.regNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Maintenance Type */}
        <div>
          <label className={labelClass}>Maintenance Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          >
            {MAINTENANCE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={inputClass}
            placeholder="Brief description of the job"
          />
        </div>

        {/* Cost */}
        <div>
          <label className={labelClass}>Cost (₹)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 2500"
            required
          />
        </div>

        {/* Status */}
        <div>
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

export default MaintenanceForm;