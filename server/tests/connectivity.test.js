import test from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";

const BASE_URL = "http://localhost:5000/api";
const prisma = new PrismaClient();

// Unique identifiers for this test run
const testId = Date.now();
const managerEmail = `manager-${testId}@test-connectivity.com`;
const safetyEmail = `safety-${testId}@test-connectivity.com`;
const testPassword = "password123";

let managerToken = "";
let safetyToken = "";

let testVehicleId = "";
let testDriverId = "";
let testMaintenanceId = "";

test.after(async () => {
  console.log("\n[Cleanup] Cleaning up test records from database...");
  try {
    // Delete maintenance logs
    await prisma.maintenanceLog.deleteMany({
      where: {
        description: { contains: String(testId) }
      }
    });

    // Delete vehicles
    await prisma.vehicle.deleteMany({
      where: {
        regNumber: { startsWith: `TEST-REG-${testId}` }
      }
    });

    // Delete drivers
    await prisma.driver.deleteMany({
      where: {
        licenseNumber: { startsWith: `TEST-DL-${testId}` }
      }
    });

    // Delete test users
    await prisma.user.deleteMany({
      where: {
        email: { endsWith: "@test-connectivity.com" }
      }
    });
  } catch (error) {
    console.error("[Cleanup Error]", error);
  } finally {
    await prisma.$disconnect();
    console.log("[Cleanup] Completed cleanup successfully.");
  }
});

test("Connectivity Integration Suite", async (t) => {
  // ==========================================
  // 1. AUTHENTICATION TESTS
  // ==========================================
  await t.test("Auth: Register test Manager & Safety Officer", async () => {
    // Register Manager
    const resManager = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Manager",
        email: managerEmail,
        password: testPassword,
        role: "FLEET_MANAGER"
      })
    });
    assert.strictEqual(resManager.status, 201, "Manager registration should return 201");
    const bodyManager = await resManager.json();
    assert.strictEqual(bodyManager.success, true);

    // Register Safety Officer
    const resSafety = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Safety",
        email: safetyEmail,
        password: testPassword,
        role: "SAFETY_OFFICER"
      })
    });
    assert.strictEqual(resSafety.status, 201, "Safety Officer registration should return 201");
  });

  await t.test("Auth: Login test Manager & Safety Officer and fetch tokens", async () => {
    // Login Manager
    const resManager = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: managerEmail,
        password: testPassword
      })
    });
    assert.strictEqual(resManager.status, 200, "Manager login should return 200");
    const dataManager = await resManager.json();
    managerToken = dataManager.data.token;
    assert.ok(managerToken, "Manager token must be present");

    // Login Safety Officer
    const resSafety = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: safetyEmail,
        password: testPassword
      })
    });
    assert.strictEqual(resSafety.status, 200, "Safety login should return 200");
    const dataSafety = await resSafety.json();
    safetyToken = dataSafety.data.token;
    assert.ok(safetyToken, "Safety token must be present");
  });

  // ==========================================
  // 2. VEHICLE TESTS
  // ==========================================
  await t.test("Vehicles: Create a new vehicle", async () => {
    const res = await fetch(`${BASE_URL}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        regNumber: `TEST-REG-${testId}`,
        name: "Test Truck",
        model: "Volvo TEST 2026",
        type: "Truck",
        maxLoadCapacity: 15000,
        acquisitionCost: 120000,
        region: "North"
      })
    });
    assert.strictEqual(res.status, 201, "Vehicle creation should return 201");
    const body = await res.json();
    testVehicleId = body.data.vehicle.id;
    assert.ok(testVehicleId, "Created vehicle ID must exist");
  });

  await t.test("Vehicles: Retrieve vehicles list", async () => {
    const res = await fetch(`${BASE_URL}/vehicles`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${managerToken}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data.vehicles), "Response must return an array of vehicles");
    const found = body.data.vehicles.find(v => v.id === testVehicleId);
    assert.ok(found, "Created test vehicle should be returned in list");
  });

  await t.test("Vehicles: Attempt direct status update to invalid state (fails)", async () => {
    // Direct status update to IN_SHOP or ON_TRIP via vehicle endpoint is disallowed by backend validators
    const res = await fetch(`${BASE_URL}/vehicles/${testVehicleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        status: "IN_SHOP"
      })
    });
    assert.strictEqual(res.status, 400, "Direct status change to IN_SHOP must return 400 validation error");
  });

  await t.test("Vehicles: Edit vehicle region and model", async () => {
    const res = await fetch(`${BASE_URL}/vehicles/${testVehicleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        region: "South-East",
        model: "Volvo TEST 2026 Modified"
      })
    });
    assert.strictEqual(res.status, 200, "Vehicle details update should return 200");
    const body = await res.json();
    assert.strictEqual(body.data.vehicle.region, "South-East");
    assert.strictEqual(body.data.vehicle.model, "Volvo TEST 2026 Modified");
  });

  // ==========================================
  // 3. DRIVER TESTS
  // ==========================================
  await t.test("Drivers: Create a new driver", async () => {
    const res = await fetch(`${BASE_URL}/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        name: "Test Driver",
        licenseNumber: `TEST-DL-${testId}`,
        licenseCategory: "HMV",
        licenseExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        contactNumber: "9998887776",
        status: "AVAILABLE",
        safetyScore: 92
      })
    });
    assert.strictEqual(res.status, 201, "Driver creation should return 201");
    const body = await res.json();
    testDriverId = body.data.driver.id;
    assert.ok(testDriverId);
  });

  await t.test("Drivers: Edit driver contact details", async () => {
    const res = await fetch(`${BASE_URL}/drivers/${testDriverId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        contactNumber: "1112223334"
      })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.data.driver.contactNumber, "1112223334");
  });

  await t.test("Drivers: Attempt suspension by Manager role (fails)", async () => {
    const res = await fetch(`${BASE_URL}/drivers/${testDriverId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}` // Manager Token
      },
      body: JSON.stringify({
        status: "SUSPENDED"
      })
    });
    assert.strictEqual(res.status, 403, "Manager should be forbidden from suspending drivers (403)");
  });

  await t.test("Drivers: Suspend driver by Safety Officer role (succeeds)", async () => {
    const res = await fetch(`${BASE_URL}/drivers/${testDriverId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${safetyToken}` // Safety Officer Token
      },
      body: JSON.stringify({
        status: "SUSPENDED"
      })
    });
    assert.strictEqual(res.status, 200, "Safety officer must be allowed to suspend drivers (200)");
    const body = await res.json();
    assert.strictEqual(body.data.driver.status, "SUSPENDED");
  });

  // ==========================================
  // 4. MAINTENANCE TESTS
  // ==========================================
  await t.test("Maintenance: Schedule maintenance (vehicle changes to IN_SHOP)", async () => {
    // Schedule maintenance
    const res = await fetch(`${BASE_URL}/maintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        vehicleId: testVehicleId,
        type: "Brake Inspection",
        description: `Test Maintenance run ${testId}`,
        cost: 500
      })
    });
    assert.strictEqual(res.status, 201, "Maintenance scheduling should return 201");
    const body = await res.json();
    testMaintenanceId = body.data.log.id;
    assert.ok(testMaintenanceId);

    // Verify vehicle status has changed to IN_SHOP
    const resVehicle = await fetch(`${BASE_URL}/vehicles/${testVehicleId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${managerToken}` }
    });
    const bodyVehicle = await resVehicle.json();
    assert.strictEqual(bodyVehicle.data.vehicle.status, "IN_SHOP", "Vehicle must transition to IN_SHOP status on active maintenance");
  });

  await t.test("Maintenance: Close maintenance (vehicle changes to AVAILABLE)", async () => {
    // Close the maintenance job
    const res = await fetch(`${BASE_URL}/maintenance/${testMaintenanceId}/close`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${managerToken}` }
    });
    assert.strictEqual(res.status, 200, "Closing maintenance should return 200");
    const body = await res.json();
    assert.strictEqual(body.data.log.status, "CLOSED");

    // Verify vehicle status has reverted back to AVAILABLE
    const resVehicle = await fetch(`${BASE_URL}/vehicles/${testVehicleId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${managerToken}` }
    });
    const bodyVehicle = await resVehicle.json();
    assert.strictEqual(bodyVehicle.data.vehicle.status, "AVAILABLE", "Vehicle must revert to AVAILABLE status on maintenance closure");
  });

  // ==========================================
  // 5. VEHICLE RETIRE (SOFT DELETE)
  // ==========================================
  await t.test("Vehicles: Retire (soft delete) vehicle", async () => {
    const res = await fetch(`${BASE_URL}/vehicles/${testVehicleId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${managerToken}` }
    });
    assert.strictEqual(res.status, 200, "Retiring vehicle should return 200");
    const body = await res.json();
    assert.strictEqual(body.data.vehicle.status, "RETIRED", "Soft delete must mark vehicle as RETIRED");
  });
});
