import { z } from "zod";

const deviceId = z
  .string()
  .trim()
  .regex(/^[a-f0-9]{64}$/i);
const appVersion = z.string().trim().min(1).max(40);
export const activationSchema = z
  .object({
    license_key: z.string().trim().min(8).max(120),
    device_id: deviceId,
    app_version: appVersion,
    device_name: z.string().trim().max(255).optional(),
  })
  .strict();
export const validationSchema = z
  .object({
    activation_token: z.string().trim().min(32).max(256),
    device_id: deviceId,
    app_version: appVersion,
  })
  .strict();
export const deactivationSchema = z
  .object({
    activation_token: z.string().trim().min(32).max(256),
    device_id: deviceId,
  })
  .strict();
