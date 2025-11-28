import { z } from 'zod';

export const signupSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Full Name is required')
        .min(2, 'Full Name must be at least 2 characters')
        .max(50, 'Full Name must be at most 50 characters')
        .refine((value) => value.trim().includes(' '), {
            message: 'Please enter your first and last name',
        }),
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
    confirmPassword: z
        .string()
        .min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;
