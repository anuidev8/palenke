import { z } from "zod";

export const AccessLevelSchema = z.enum(["admin", "coordination"]);

export const AccessRequestSchema = z
  .object({
    full_name: z.string().trim().min(2),
    national_id: z.string().trim().min(5),
    email: z.string().trim().email(),
    community: z.string().trim().min(2),
    motivation: z.string().trim().min(10),
    pcn_affiliation: z.string().trim().optional(),
    instrument_slug: z.string().trim().min(2),
    access_level: AccessLevelSchema,
  });

export type AccessRequestInput = z.infer<typeof AccessRequestSchema>;
