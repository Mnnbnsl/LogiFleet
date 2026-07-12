import * as vehicleService from "../services/vehicleService.js";

// =============================
// CREATE VEHICLE
// =============================
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      data: {
        vehicle,
      },
    });
  } catch (error) {
    if (error.code === "CONFLICT") {
      return res.status(409).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET ALL VEHICLES
// =============================
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehicles(req.query);

    return res.status(200).json({
      success: true,
      data: {
        vehicles,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET AVAILABLE VEHICLES
// =============================
export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();

    return res.status(200).json({
      success: true,
      data: {
        vehicles,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// GET VEHICLE BY ID
// =============================
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        vehicle,
      },
    });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// UPDATE VEHICLE
// =============================
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: {
        vehicle,
      },
    });
  } catch (error) {
    if (
      error.code === "NOT_FOUND" ||
      error.code === "CONFLICT" ||
      error.code === "VALIDATION_ERROR"
    ) {
      const statusMap = {
        NOT_FOUND: 404,
        CONFLICT: 409,
        VALIDATION_ERROR: 400,
      };

      return res.status(statusMap[error.code]).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// =============================
// DELETE VEHICLE (SOFT DELETE)
// =============================
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        vehicle,
      },
    });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};