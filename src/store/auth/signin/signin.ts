import { create } from "zustand";
import api from "@/components/utils/api";
import { encryptData } from "@/components/utils/crypto";
import { useNotificationStore } from "@/components/notify/notification";

interface User {
    id?: string;
    username?: string;
    client_name?: string;
    role?: string;
    [key: string]: any;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoginInitiated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    appRole: string;
    email: string;
    password: string;
    otp: string;

    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setOtp: (otp: string) => void;

    initiateLogin: (
        email: string,
        password: string,
        turnstileToken?: string
    ) => Promise<boolean>;

    verifyOtp: (otp: string, turnstileToken?: string) => Promise<boolean>;

    resendOtp: (turnstileToken?: string) => Promise<boolean>;

    login: (
        email: string,
        password: string,
        turnstileToken?: string
    ) => Promise<boolean>;

    logout: () => void;
    resetLoginState: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    isLoginInitiated: false,
    user: {},
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isLoading: false,
    error: null,
    appRole: "",
    email: "",
    password: "",
    otp: "",

    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setOtp: (otp) => set({ otp }),

    initiateLogin: async (email, password, turnstileToken) => {
        set({ isLoading: true, error: null });
        const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };
        try {
            const response = await api.post("/auth/login/initiate", {
                email,
                password,
                // token: turnstileToken,
            });

            // console.log("Login Initiate Response:", response);

            set({
                email,
                password,
                isLoginInitiated: true,
                isLoading: false,
                error: null,
            });

            const { token, user } = response.data;

            typeof window !== "undefined" && localStorage.setItem("token", token);
            typeof window !== "undefined" && localStorage.setItem("name", user.name);
            typeof window !== "undefined" && localStorage.setItem("email", user.email);
            typeof window !== "undefined" && localStorage.setItem("id", user.id);

            const encryptedRole = encryptData(user.role);
            typeof window !== "undefined" && localStorage.setItem("role", encryptedRole ?? "");

            // showNotification("OTP sent to your email!", "success");
            showNotification("Login Successfull!", "success");
            return true;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to Login";
            set({ error: errorMessage, isLoading: false });
            console.error("Login Initiate Error:", err);
            showNotification(errorMessage, "error");
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOtp: async (otp, turnstileToken) => {
        set({ isLoading: true, error: null });
        const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };;
        const { email, password } = get();

        try {
            const response = await api.post("/auth/login/verify", {
                email,
                password,
                otp,
                token: turnstileToken,
            });

            console.log("OTP Verification Response:", response);

            const apiData = response.data?.data || response.data;

            if (!apiData?.user || !apiData?.token) {
                showNotification("Unexpected response from server", "error");
                set({ isLoading: false });
                return false;
            }

            const { token, user } = apiData;

            typeof window !== "undefined" && localStorage.setItem("token", token);
            typeof window !== "undefined" && localStorage.setItem("name", user.username);
            typeof window !== "undefined" && localStorage.setItem("client_name", user.client_name || user.username);
            typeof window !== "undefined" && localStorage.setItem("client_id", user.id);

            const encryptedRole = encryptData(user.role);
            typeof window !== "undefined" && localStorage.setItem("role", encryptedRole ?? "");

            set({
                user,
                token,
                isAuthenticated: true,
                isLoginInitiated: false,
                isLoading: false,
                appRole: user.role,
                password: "",
                otp: "",
            });

            showNotification("Login successful!", "success");
            return true;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "OTP verification failed!";
            set({ error: errorMessage, isLoading: false });
            console.error("OTP Verification Error:", err);
            showNotification(errorMessage, "error");
            return false;
        }
    },

    resendOtp: async (turnstileToken) => {
        set({ isLoading: true, error: null });
        const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };;
        const { email, password } = get();

        try {
            await api.post("/auth/login/initiate", {
                email,
                password,
                token: turnstileToken,
            });

            set({ isLoading: false });
            showNotification("OTP resent successfully!", "success");
            return true;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to resend OTP!";
            set({ error: errorMessage, isLoading: false });
            showNotification(errorMessage, "error");
            return false;
        }
    },

    login: async (email, password, turnstileToken) => {
        // return await get().initiateLogin(email, password, turnstileToken);        
        return await get().initiateLogin(email, password, turnstileToken);
    },

    logout: () => {
        const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };;
        typeof window !== "undefined" && localStorage.removeItem("token");
        typeof window !== "undefined" && localStorage.removeItem("name");
        typeof window !== "undefined" && localStorage.removeItem("role");
        typeof window !== "undefined" && localStorage.removeItem("client_name");
        typeof window !== "undefined" && localStorage.removeItem("client_id");
        typeof window !== "undefined" && localStorage.removeItem("client");

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoginInitiated: false,
            email: "",
            password: "",
            otp: "",
            appRole: "",
            error: null,
        });

        showNotification("Logged out successfully!", "success");
    },

    resetLoginState: () => {
        set({
            isLoginInitiated: false,
            email: "",
            password: "",
            otp: "",
            error: null,
        });
    },

    checkAuth: () => {
        const token = typeof window !== "undefined" && localStorage.getItem("token");
        if (!token) {
            set({ isAuthenticated: false });
            return;
        }

        try {
            const { showNotification } = useNotificationStore.getState() as { showNotification: (message: string, type: string) => void };;
            const payload = JSON.parse(atob(token.split(".")[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (isExpired) {
                typeof window !== "undefined" && localStorage.removeItem("token");
                typeof window !== "undefined" && localStorage.removeItem("name");
                typeof window !== "undefined" && localStorage.removeItem("role");
                typeof window !== "undefined" && localStorage.removeItem("client_name");
                typeof window !== "undefined" && localStorage.removeItem("client_id");
                typeof window !== "undefined" && localStorage.removeItem("client");

                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    appRole: "",
                });

                showNotification("Session expired. Please log in again.", "error");
            } else {
                set({
                    isAuthenticated: true,
                    token,
                });
            }
        } catch (error) {
            console.error("Auth check error:", error);
            set({ isAuthenticated: false });
        }
    },
}));

// Call checkAuth on app load
useAuthStore.getState().checkAuth();
