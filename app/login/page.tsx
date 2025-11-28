'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormData } from '@/utils/schemas/loginSchema';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

    const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [loading, isAuthenticated, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If field was previously touched, perform instant validation
        if (touched[name as keyof LoginFormData]) {
            validateSingleField(name as keyof LoginFormData, value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateSingleField(name as keyof LoginFormData, value);
    };

    const validateSingleField = (name: keyof LoginFormData, value: string) => {
        // Validation for a single field
        const result = loginSchema.shape[name].safeParse(value);

        if (result.success) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
            return true;
        } else {
            const errorMessage = result.error.issues[0]?.message || 'Invalid value';
            setErrors(prev => ({
                ...prev,
                [name]: errorMessage
            }));
            return false;
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true,
            password: true
        });

        // Validate entire form with Zod
        const result = loginSchema.safeParse(formData);

        if (result.success) {
            // Validation successful, clear errors
            setErrors({});

            setIsLoading(true);

            try {
                await login(formData.email, formData.password);
                // Login successful, AuthContext will automatically redirect to dashboard
            } catch (error) {
                // Error will be shown with toast (from apiClient interceptor)
                console.error('Login error:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Handle Zod errors
            const formattedErrors: Partial<Record<keyof LoginFormData, string>> = {};

            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    formattedErrors[issue.path[0] as keyof LoginFormData] = issue.message;
                }
            });

            setErrors(formattedErrors);
        }
    };

    // Show loading state while checking authentication
    if (loading) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="flex w-full lg:w-[55%] flex-col px-4 sm:px-8 md:px-12 lg:px-16 xl:px-40 py-8 lg:py-12">
                <div className="w-full max-w-[550px] mx-auto lg:mx-0 flex flex-col  flex-1">
                    {/* Logo - Aligned with form */}
                    <div className="mb-12 lg:mb-48">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={122}
                            height={30}
                            className="object-contain"
                        />
                    </div>

                    {/* Heading */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-[30px] font-semibold text-(--foreground) mb-2">Sign In</h1>
                        <p className="text-[#78778B] text-sm sm:text-base">Welcome back! Please enter your details</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        {/* Email Input */}
                        <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email ? errors.email : ''}
                            autoComplete='new-password'
                            disabled={isLoading}
                        />

                        {/* Password Input */}
                        <Input
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password ? errors.password : ''}
                            autoComplete='new-password'
                            disabled={isLoading}
                        />

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 sm:py-3 px-4 bg-[#c8e85f] hover:bg-[#b8de34] text-black text-sm sm:text-base font-semibold rounded-[10px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && (
                                <svg
                                    className="animate-spin h-5 w-5 text-gray"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            className="w-full py-2.5 sm:py-3 px-4 border border-[#F5F5F5] hover:border-gray-200 rounded-[10px] flex items-center justify-center gap-2 sm:gap-3 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4" />
                                <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853" />
                                <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05" />
                                <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33718L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335" />
                            </svg>
                            <span className="text-[#78778B] text-[16px] sm:text-base font-semibold">Sign in with google</span>
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-[#929EAE]">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-(--foreground) hover:text-(--primary) transition-colors duration-200 font-medium relative inline-block">
                            Sign up
                            <Image
                                width={43}
                                height={5}
                                src={'/images/sign-up-line.svg'}
                                alt='Sign Up Line'
                                className='absolute -bottom-3 left-1/2 -translate-x-1/2'
                            />
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:flex lg:w-[45%] items-center justify-center">
                <div className="relative w-full h-full min-h-screen bg-cover bg-center bg-no-repeat" style={{
                    backgroundImage: 'url(/images/auth-image.png)'
                }}>

                </div>
            </div>
        </div>
    );
}