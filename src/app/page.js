"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    console.log("rendering")
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     setMessage("");
    //     setLoading(true);

    //     if (!email || !password) {
    //         setError("Please fill in all fields.");
    //         setLoading(false);
    //         return;
    //     }

    //     try {
    //         if (isLogin) {
    //             const res = await fetch("/api/auth/login", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ email, password }),
    //             });
    //             const data = await res.json();
    //             if (res.ok) {
    //                 setMessage("Login successful! Redirecting...");
    //                 setTimeout(() => router.push("/main"), 1200);
    //             } else {
    //                 setError(data.message || "Login failed.");
    //             }
    //         } else {
    //             const res = await fetch("/api/auth/register", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ email, password }),
    //             });
    //             const data = await res.json();
    //             if (res.ok) {
    //                 setMessage("Registration successful! Redirecting...");
    //                 setTimeout(() => router.push("/main"), 1200);
    //             } else {
    //                 setError(data.message || "Registration failed.");
    //             }
    //         }
    //     } catch (err) {
    //         setError("Something went wrong. Please try again.");
    //     }
    //     setLoading(false);
    // };

    const handleGoogleLogin = async () => {
        toast.success("Logged in with Google");
        router.push("/main");
        // setLoading(true);
        // try {
        // const res = await signIn("google", { callbackUrl: "/", redirect: false });
        // } catch (error) {
        // enqueueSnackbar("Google Login Failed", { variant: "error" });
        // } finally {
        // setLoading(false);
        // // }
        // const callbackUrl = encodeURIComponent('http://localhost:3001/auth/callback');
        // window.location.href = `https://localhost:3000/api/auth/signin/google?callbackUrl=${callbackUrl}`;
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">
                    {isLogin ? "Welcome Back!" : "Create an Account"}
                </h1>
                <p className="text-gray-500 text-center mb-6">
                    {isLogin
                        ? "Please login to your account"
                        : "Register to get started"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="you@example.com"
                            type="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Your password"
                            type="password"
                            value={password}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm">
                            {message}
                        </div>
                    )}
                    <button
                        className={`bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 w-full rounded font-semibold ${
                            loading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading
                            ? isLogin
                                ? "Logging in..."
                                : "Registering..."
                            : isLogin
                            ? "Login"
                            : "Register"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-600 text-sm">
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </span>
                    <button
                        className="ml-2 text-blue-700 hover:underline text-sm font-medium"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setMessage("");
                        }}
                        disabled={loading}
                        type="button"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </div>
            </div> */}

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">
                    Welcome Back!
                </h1>
                <p className="text-gray-500 text-center mb-6">
                    Please login to your account
                </p>
                <div className="flex items-center justify-center mb-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition duration-200"
                    >
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT65WTmiisS-2uqMBJ8C-OwNvh02PWiwMLxxg&s"
                            alt="Google Icon"
                            width={20}
                            height={20}
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>


        </div>
    );
}
