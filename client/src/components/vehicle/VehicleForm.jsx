import { useState } from "react";

const VEHICLE_TYPES = ["Truck", "Mini Truck", "Trailer", "Pickup", "Container Truck", "Tanker"];
const FUEL_TYPES = ["Diesel", "CNG", "Electric"];
const CAPACITIES = ["5 Ton", "10 Ton", "18 Ton", "22 Ton"];
const STATUSES = ["Available", "On Trip", "Maintenance", "Out of Service"];

const defaultValues = {
  regNumber: "",
  name: "",
  type: VEHICLE_TYPES[0],
  manufacturer: "",
  model: "",
  year: new Date().getFullYear(),
  fuelType: FUEL_TYPES[0],
  capacity: CAPACITIES[0],
  assignedDriver: "Unassigned",
  mileage: 0,
  insuranceExpiry: "",
  fitnessExpiry: "",
  lastService: "",
  vin: "",
  status: STATUSES[0],
  notes: "",
};

const VehicleForm = ({ initialData, onSubmit, onCancel, submitLabel = "Save Vehicle" }) => {
  const [formData, setFormData] = useState({ ...defaultValues, ...initialData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        <div>
          <label className={labelClass}>Registration Number</label>
          <input name="regNumber" value={formData.regNumber} onChange={handleChange} className={inputClass} placeholder="PB10AZ2345" required />
        </div>
        <div>
          <label className={labelClass}>Vehicle Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Ashok Leyland Ecomet" required />
        </div>

        <div>
          <label className={labelClass}>Vehicle Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Manufacturer</label>
          <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={inputClass} placeholder="Tata Motors" required />
        </div>

        <div>
          <label className={labelClass}>Model</label>
          <input name="model" value={formData.model} onChange={handleChange} className={inputClass} placeholder="407 Gold SFC" />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Fuel Type</label>
          <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}>
            {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Capacity</label>
          <select name="capacity" value={formData.capacity} onChange={handleChange} className={inputClass}>
            {CAPACITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Assigned Driver</label>
          <input name="assignedDriver" value={formData.assignedDriver} onChange={handleChange} className={inputClass} placeholder="Unassigned" />
        </div>
        <div>
          <label className={labelClass}>Current Mileage (km)</label>
          <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Insurance Expiry</label>
          <input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Fitness Expiry</label>
          <input type="date" name="fitnessExpiry" value={formData.fitnessExpiry} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className={labelClass}>Last Service</label>
          <input type="date" name="lastService" value={formData.lastService} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>VIN Number</label>
          <input name="vin" value={formData.vin} onChange={handleChange} className={inputClass} placeholder="MAT448023N1B78901" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Additional remarks..."
          />
        </div>
      </div>

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