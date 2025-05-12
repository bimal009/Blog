"use client"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, loading } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            await login(data.email, data.password);
            // The router.push('/') is handled in the login function
        } catch (error: any) {
            setError(error.message || 'Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Log in to your blog account
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4 pt-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoComplete="email"
                                className={errors.email ? "border-red-500" : ""}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                    {...register('password')}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="link"
                                className="p-0 h-auto text-sm text-primary"
                                asChild
                            >
                                <a href="/forgot-password">Forgot password?</a>
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col">
                        <Button
                            className="w-full mt-3"
                            type="submit"
                            disabled={isSubmitting || loading}
                        >
                            {(isSubmitting || loading) ? "Logging in..." : "Log in"}
                        </Button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            <span>Don't have an account? </span>
                            <Button
                                variant="link"
                                className="p-0 h-auto text-primary"
                                asChild
                            >
                                <a href="/sign-up">Sign up</a>
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginForm;