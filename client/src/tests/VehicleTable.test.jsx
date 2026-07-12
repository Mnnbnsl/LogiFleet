import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VehicleTable from "../components/vehicle/VehicleTable";

const mockVehicles = [
  {
    id: "veh-1",
    regNumber: "VAN-01",
    name: "Mercedes Sprinter",
    type: "Cargo Van",
    model: "Sprinter Cargo 2024",
    maxLoadCapacity: 1200,
    odometer: 15400,
    acquisitionCost: 45000,
    region: "North",
    assignedDriver: "Alex Johnson",
    currentTrip: "TRP-104",
    status: "Available"
  },
  {
    id: "veh-2",
    regNumber: "TRK-02",
    name: "Volvo VNL",
    type: "Semi-Truck",
    model: "VNL 860 Sleeper",
    maxLoadCapacity: 15000,
    odometer: 120000,
    acquisitionCost: 145000,
    region: "Midwest",
    assignedDriver: "Bob Miller",
    currentTrip: "TRP-202",
    status: "On Trip"
  }
];

describe("VehicleTable Component", () => {
  it("renders the vehicle table headers correctly", () => {
    render(<VehicleTable vehicles={[]} loading={false} page={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByText("Vehicle ID")).toBeInTheDocument();
    expect(screen.getByText("Reg. Number")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("Max Load (kg)")).toBeInTheDocument();
    expect(screen.getByText("Odometer (km)")).toBeInTheDocument();
    expect(screen.getByText("Acq. Cost")).toBeInTheDocument();
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Assigned Driver")).toBeInTheDocument();
    expect(screen.getByText("Current Trip")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders lists of vehicles correctly", () => {
    render(<VehicleTable vehicles={mockVehicles} loading={false} page={1} totalPages={1} onPageChange={() => {}} />);

    expect(screen.getByText("VAN-01")).toBeInTheDocument();
    expect(screen.getByText("Mercedes Sprinter")).toBeInTheDocument();
    expect(screen.getByText("Cargo Van")).toBeInTheDocument();
    expect(screen.getByText("Sprinter Cargo 2024")).toBeInTheDocument();
    expect(screen.getByText("1200 kg")).toBeInTheDocument();
    expect(screen.getByText("15400 km")).toBeInTheDocument();
    expect(screen.getByText("₹45000")).toBeInTheDocument();
    expect(screen.getByText("North")).toBeInTheDocument();
    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("TRP-104")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();

    expect(screen.getByText("TRK-02")).toBeInTheDocument();
    expect(screen.getByText("Volvo VNL")).toBeInTheDocument();
    expect(screen.getByText("Semi-Truck")).toBeInTheDocument();
    expect(screen.getByText("VNL 860 Sleeper")).toBeInTheDocument();
    expect(screen.getByText("15000 kg")).toBeInTheDocument();
    expect(screen.getByText("120000 km")).toBeInTheDocument();
    expect(screen.getByText("₹145000")).toBeInTheDocument();
    expect(screen.getByText("Midwest")).toBeInTheDocument();
    expect(screen.getByText("Bob Miller")).toBeInTheDocument();
    expect(screen.getByText("TRP-202")).toBeInTheDocument();
    expect(screen.getByText("On Trip")).toBeInTheDocument();
  });

  it("displays empty state when vehicle list is empty", () => {
    render(<VehicleTable vehicles={[]} loading={false} page={1} totalPages={1} onPageChange={() => {}} />);
    expect(screen.getByText("No vehicles found matching your filters.")).toBeInTheDocument();
  });
});
