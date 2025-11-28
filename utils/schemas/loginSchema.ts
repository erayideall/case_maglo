import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Please enter an email address')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be at most 50 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
