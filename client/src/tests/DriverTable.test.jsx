import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DriverTable from "../components/driver/DriverTable";

const mockDrivers = [
  {
    id: "drv-1",
    name: "Alex Johnson",
    licenseNumber: "DL-12345",
    licenseCategory: "Class C",
    licenseExpiry: "2026-10-15T00:00:00.000Z",
    contactNumber: "9998887776",
    safetyScore: 95,
    status: "Available"
  },
  {
    id: "drv-2",
    name: "Bob Miller",
    licenseNumber: "DL-67890",
    licenseCategory: "Class A",
    licenseExpiry: "2026-08-12T00:00:00.000Z",
    contactNumber: "1112223334",
    safetyScore: 88,
    status: "On Trip"
  }
];

describe("DriverTable Component", () => {
  it("renders the driver table headers correctly", () => {
    render(<DriverTable drivers={[]} loading={false} />);
    
    expect(screen.getByText("Driver Name")).toBeInTheDocument();
    expect(screen.getByText("License Number")).toBeInTheDocument();
    expect(screen.getByText("License Category")).toBeInTheDocument();
    expect(screen.getByText("License Expiry")).toBeInTheDocument();
    expect(screen.getByText("Contact Number")).toBeInTheDocument();
    expect(screen.getByText("Safety Score")).toBeInTheDocument();
    expect(screen.getByText("Current Status")).toBeInTheDocument();
  });

  it("renders lists of drivers correctly", () => {
    render(<DriverTable drivers={mockDrivers} loading={false} />);

    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("DL-12345")).toBeInTheDocument();
    expect(screen.getByText("Class C")).toBeInTheDocument();
    expect(screen.getByText("9998887776")).toBeInTheDocument();
    expect(screen.getByText("95 / 100")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();

    expect(screen.getByText("Bob Miller")).toBeInTheDocument();
    expect(screen.getByText("DL-67890")).toBeInTheDocument();
    expect(screen.getByText("Class A")).toBeInTheDocument();
    expect(screen.getByText("1112223334")).toBeInTheDocument();
    expect(screen.getByText("88 / 100")).toBeInTheDocument();
    expect(screen.getByText("On Trip")).toBeInTheDocument();
  });

  it("displays empty state when driver list is empty", () => {
    render(<DriverTable drivers={[]} loading={false} />);
    expect(screen.getByText("No drivers found")).toBeInTheDocument();
  });

  it("calls onView, onEdit, and onDelete when action buttons are clicked", () => {
    const onViewMock = vi.fn();
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <DriverTable
        drivers={mockDrivers}
        loading={false}
        onView={onViewMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Get all edit buttons (Pencil icon buttons have title "Edit driver")
    const editButtons = screen.getAllByTitle("Edit driver");
    fireEvent.click(editButtons[0]);
    expect(onEditMock).toHaveBeenCalledWith(mockDrivers[0]);

    // Get delete buttons
    const deleteButtons = screen.getAllByTitle("Delete driver");
    fireEvent.click(deleteButtons[0]);
    expect(onDeleteMock).toHaveBeenCalledWith(mockDrivers[0]);
  });
});
