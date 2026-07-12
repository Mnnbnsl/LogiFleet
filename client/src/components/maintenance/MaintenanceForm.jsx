import { useState } from "react";

const MAINTENANCE_TYPES = [
  "Oil Change", "Engine Service", "Brake Inspection", "Tyre Replacement",
  "Battery Replacement", "AC Repair", "Clutch Repair", "Suspension Service",
  "Wheel Alignment", "General Inspection",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const WORKSHOPS = ["LogiFleet Workshop A", "North Hub Workshop", "Delhi Service Center", "Punjab Fleet Garage"];
const TECHNICIANS = ["Rahul Singh", "Ankit Sharma", "Deepak Kumar", "Suresh Verma"];
const STATUSES = ["Scheduled", "In Progress", "Completed", "Cancelled"];

const defaultValues = {
  vehicleName: "",
  regNumber: "",
  type: MAINTENANCE_TYPES[0],
  description: "",
  priority: PRIORITIES[0],
  technician: TECHNICIANS[0],
  workshop: WORKSHOPS[0],
  scheduledDate: "",
  completionDate: "",
  estimatedCost: 0,
  actualCost: 0,
  partsReplaced: "",
  odometer: 0,
  status: STATUSES[0],
  notes: "",
};

const MaintenanceForm = ({ initialData, onSubmit, onCancel, submitLabel = "Save" }) => {
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
          <label className={labelClass}>Vehicle</label>
          <input name="vehicleName" value={formData.vehicleName} onChange={handleChange} className={inputClass} placeholder="Ashok Leyland Ecomet" required />
        </div>
        <div>
          <label className={labelClass}>Registration Number</label>
          <input name="regNumber" value={formData.regNumber} onChange={handleChange} className={inputClass} placeholder="PB10AZ2345" required />
        </div>

        <div>
          <label className={labelClass}>Maintenance Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
            {MAINTENANCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className={inputClass}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <input name="description" value={formData.description} onChange={handleChange} className={inputClass} placeholder="Brief description of the issue or job" />
        </div>

        <div>
          <label className={labelClass}>Assigned Technician</label>
          <select name="technician" value={formData.technician} onChange={handleChange} className={inputClass}>
            {TECHNICIANS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Workshop</label>
          <select name="workshop" value={formData.workshop} onChange={handleChange} className={inputClass}>
            {WORKSHOPS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Scheduled Date</label>
          <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Completion Date</label>
          <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Estimated Cost (₹)</label>
          <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Actual Cost (₹)</label>
          <input type="number" name="actualCost" value={formData.actualCost} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Parts Replaced</label>
          <input name="partsReplaced" value={formData.partsReplaced} onChange={handleChange} className={inputClass} placeholder="e.g. Oil Filter, Brake Pads" />
        </div>
        <div>
          <label className={labelClass}>Current Odometer (km)</label>
          <input type="number" name="odometer" value={formData.odometer} onChange={handleChange} className={inputClass} />
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

export default MaintenanceForm;