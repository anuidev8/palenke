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
    institution: z.string().trim().optional(),
    use_purpose: z.string().trim().optional(),
    data_protection: z.string().trim().optional(),
    instrument_slug: z.string().trim().min(2),
    access_level: AccessLevelSchema,
  })
  .superRefine((value, ctx) => {
    if (value.access_level !== "coordination") {
      return;
    }

    if (!value.institution || value.institution.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["institution"],
        message: "Institution is required for coordination access requests.",
      });
    }

    if (!value.use_purpose || value.use_purpose.length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["use_purpose"],
        message: "Specific use purpose is required for coordination access requests.",
      });
    }

    if (!value.data_protection || value.data_protection.length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["data_protection"],
        message: "Data protection measures are required for coordination access requests.",
      });
    }
  });

export type AccessRequestInput = z.infer<typeof AccessRequestSchema>;
