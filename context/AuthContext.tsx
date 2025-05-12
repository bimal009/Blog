'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/utils';
import { createUser, loginUser, logoutUser, verifyAuth } from '@/lib/actions/userActions';

// Define user type
type User = {
    id: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const result = await verifyAuth(token);

                if (result.success) {
                    setUser(result.user);
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const result = await loginUser({ email, password });

            if (result.status !== 200) {
                throw new Error(result.message || 'Login failed');
            }

            // Store token in localStorage for client-side access
            if (result.token) {
                localStorage.setItem("token", result.token);
            }

            setUser(result.user);
            router.push('/');
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (email: string, password: string, username: string) => {
        setLoading(true);
        try {
            const result = await createUser({ email, password, username });

            if (result.status !== 201) {
                throw new Error(result.message || 'Registration failed');
            }

            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("token");
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};