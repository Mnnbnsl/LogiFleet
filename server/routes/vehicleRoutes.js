import express from "express";

import {
  createVehicle,
  getVehicles,
  getVehicleById,
  getAvailableVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

// Uncomment after Auth module is ready
// import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET Routes
|--------------------------------------------------------------------------
*/

// GET /api/vehicles
router.get("/", getVehicles);

// GET /api/vehicles/available
router.get("/available", getAvailableVehicles);

// GET /api/vehicles/:id
router.get("/:id", getVehicleById);

/*
|--------------------------------------------------------------------------
| POST Routes
|--------------------------------------------------------------------------
*/

// router.post(
//     "/",
//     authenticate,
//     authorize("FLEET_MANAGER"),
//     createVehicle
// );

// Until Auth is ready
router.post("/", createVehicle);

/*
|--------------------------------------------------------------------------
| PATCH Routes
|--------------------------------------------------------------------------
*/

// router.patch(
//     "/:id",
//     authenticate,
//     authorize("FLEET_MANAGER"),
//     updateVehicle
// );

router.patch("/:id", updateVehicle);

/*
|--------------------------------------------------------------------------
| DELETE Routes
|--------------------------------------------------------------------------
*/

// router.delete(
//     "/:id",
//     authenticate,
//     authorize("FLEET_MANAGER"),
//     deleteVehicle
// );

router.delete("/:id", deleteVehicle);

export default router;