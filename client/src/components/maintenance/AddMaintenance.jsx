import { X } from "lucide-react";
import MaintenanceForm from "./MaintenanceForm";

const AddMaintenance = ({ onClose, onAdd }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2937] rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Schedule Maintenance</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <MaintenanceForm
          onSubmit={onAdd}
          onCancel={onClose}
          submitLabel="Schedule Maintenance"
        />
      </div>
    </div>
  );
};

export default AddMaintenance;