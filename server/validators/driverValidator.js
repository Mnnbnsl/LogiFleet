import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(1, "Driver name is required"),

  licenseNumber: z.string().min(1, "License number is required"),

  licenseCategory: z.string().min(1, "License category is required"),

  licenseExpiry: z.coerce.date(),

  contactNumber: z.string().min(10, "Contact number is invalid"),
});

export const updateDriverSchema = createDriverSchema.partial();

export const driverQuerySchema = z.object({
  status: z.string().optional(),

  licenseCategory: z.string().optional(),

  search: z.string().optional(),
});