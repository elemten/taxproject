import { z } from "zod";

const phoneRegex = /^[0-9A-Za-z+().,\-\s#]+$/;
const phoneExtensionRegex = /\b(?:ext\.?|x|extension)\s*\d{1,8}\b/i;

function isValidPhone(value: string) {
  const trimmed = value.trim();
  if (trimmed.length < 7 || trimmed.length > 48) {
    return false;
  }

  if (!phoneRegex.test(trimmed)) {
    return false;
  }

  const extensionless = trimmed.replace(phoneExtensionRegex, "");
  const digitCount = (extensionless.match(/\d/g) ?? []).length;
  return digitCount >= 7 && digitCount <= 15;
}

const optionalString = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const contactSubmitSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().refine(isValidPhone, "Enter a valid phone number"),
  serviceInterest: optionalString(120),
  message: z.string().trim().min(5).max(2000),
});

export const bookingReserveSchema = z.object({
  slotId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().refine(isValidPhone, "Enter a valid phone number"),
  serviceInterest: optionalString(120),
  message: optionalString(2000),
});

export const leadStatusUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "closed"]),
  note: optionalString(500),
});

export const slotCreateSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  timezone: z.string().trim().min(1).max(80).optional(),
  isActive: z.boolean().optional(),
});

export const slotUpdateSchema = slotCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const convertLeadSchema = z.object({
  address: optionalString(240),
});

export const createClientRecordSchema = z.object({
  serviceType: z.enum(["personal_tax", "corporate_tax", "estate", "general"]),
  taxYear: z.number().int().min(1900).max(2200).optional(),
  status: z.string().trim().min(1).max(80).optional(),
  notes: optionalString(4000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ContactSubmitInput = z.infer<typeof contactSubmitSchema>;
export type BookingReserveInput = z.infer<typeof bookingReserveSchema>;
export type LeadStatusUpdateInput = z.infer<typeof leadStatusUpdateSchema>;
export type SlotCreateInput = z.infer<typeof slotCreateSchema>;
export type SlotUpdateInput = z.infer<typeof slotUpdateSchema>;
export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
export type CreateClientRecordInput = z.infer<typeof createClientRecordSchema>;
