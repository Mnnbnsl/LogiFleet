// src/components/driver/DriverForm.jsx
import { useState } from "react";
import {
  User,
  Phone,
  IdCard,
  Calendar,
  ShieldCheck,
  Activity,
} from "lucide-react";

/**
 * DriverForm
 * ----------------------------------------------------
 * Shared, reusable form for Add Driver / Edit Driver.
 * Prefills initialData, validates inputs, and submits database-aligned fields.
 * ----------------------------------------------------
 */

const LICENSE_CATEGORIES = ["LMV", "HMV", "MCWG", "PSV", "Trailer"];
const CURRENT_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];

const emptyDriver = {
  name: "",
  contactNumber: "",
  licenseNumber: "",
  licenseCategory: LICENSE_CATEGORIES[0],
  licenseExpiry: "",
  safetyScore: 100,
  status: CURRENT_STATUSES[0],
};

const FieldLabel = ({ children, required }) => (
  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500";

const DriverForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Driver",
}) => {
  const [formData, setFormData] = useState(() => {
    const data = { ...emptyDriver, ...initialData };
    // Handle formatting date for input tag if it is an ISO string/Date
    if (data.licenseExpiry) {
      data.licenseExpiry = new Date(data.licenseExpiry).toISOString().split("T")[0];
    }
    return data;
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "safetyScore") {
      val = val === "" ? "" : Number(val);
    }
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Driver name is required.";
    if (!formData.contactNumber.trim()) {
      nextErrors.contactNumber = "Contact number is required.";
    } else if (formData.contactNumber.replace(/[^0-9]/g, "").length < 10) {
      nextErrors.contactNumber = "Contact number must be at least 10 digits.";
    }
    if (!formData.licenseNumber.trim())
      nextErrors.licenseNumber = "License number is required.";
    if (!formData.licenseExpiry)
      nextErrors.licenseExpiry = "License expiry date is required.";
    if (
      formData.safetyScore !== "" &&
      (formData.safetyScore < 0 || formData.safetyScore > 100)
    ) {
      nextErrors.safetyScore = "Safety score must be between 0 and 100.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
    }
  };

  const errorClass = (field) =>
    errors[field]
      ? "border-red-400 focus:ring-red-400/30 dark:border-red-500"
      : "border-gray-200 focus:border-yellow-400 dark:border-gray-700";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Driver Name */}
        <div>
          <FieldLabel required>Driver Name</FieldLabel>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={formData.name}
              onChange={handleChange("name")}
              className={`${inputBase} pl-9 ${errorClass("name")}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <FieldLabel required>Contact Number</FieldLabel>
          <div className="relative">
            <Phone
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={formData.contactNumber}
              onChange={handleChange("contactNumber")}
              className={`${inputBase} pl-9 ${errorClass("contactNumber")}`}
            />
          </div>
          {errors.contactNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.contactNumber}</p>
          )}
        </div>

        {/* License Number */}
        <div>
          <FieldLabel required>License Number</FieldLabel>
          <div className="relative">
            <IdCard
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="e.g. DL-10239485"
              value={formData.licenseNumber}
              onChange={handleChange("licenseNumber")}
              className={`${inputBase} pl-9 ${errorClass("licenseNumber")}`}
            />
          </div>
          {errors.licenseNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.licenseNumber}
            </p>
          )}
        </div>

        {/* License Category */}
        <div>
          <FieldLabel>License Category</FieldLabel>
          <select
            value={formData.licenseCategory}
            onChange={handleChange("licenseCategory")}
            className={`${inputBase} ${errorClass("licenseCategory")} appearance-none`}
          >
            {LICENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* License Expiry */}
        <div>
          <FieldLabel required>License Expiry</FieldLabel>
          <div className="relative">
            <Calendar
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={formData.licenseExpiry}
              onChange={handleChange("licenseExpiry")}
              className={`${inputBase} pl-9 ${errorClass("licenseExpiry")}`}
            />
          </div>
          {errors.licenseExpiry && (
            <p className="mt-1 text-xs text-red-500">
              {errors.licenseExpiry}
            </p>
          )}
        </div>

        {/* Safety Score */}
        <div>
          <FieldLabel>Safety Score (0-100)</FieldLabel>
          <div className="relative">
            <ShieldCheck
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              placeholder="100"
              min="0"
              max="100"
              value={formData.safetyScore}
              onChange={handleChange("safetyScore")}
              className={`${inputBase} pl-9 ${errorClass("safetyScore")}`}
            />
          </div>
          {errors.safetyScore && (
            <p className="mt-1 text-xs text-red-500">{errors.safetyScore}</p>
          )}
        </div>

        {/* Current Status */}
        <div className="sm:col-span-2">
          <FieldLabel>Current Status</FieldLabel>
          <div className="relative">
            <Activity
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={formData.status}
              onChange={handleChange("status")}
              className={`${inputBase} pl-9 ${errorClass("status")} appearance-none`}
            >
              {CURRENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-yellow-300 hover:shadow-md active:scale-[0.98]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default DriverForm;