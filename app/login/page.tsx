"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password, rememberMe });
    alert(`Login Success!\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <i className="bi bi-shield-lock-fill text-white text-3xl sm:text-4xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-envelope-fill text-gray-400 text-lg"></i>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-lock-fill text-gray-400 text-lg"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                  } text-lg`}
                ></i>
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm sm:text-base font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 active:scale-95 sm:hover:scale-[1.02] transition duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <i className="bi bi-box-arrow-in-right text-lg"></i>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-3 sm:px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-google text-red-500 text-xl"></i>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-facebook text-blue-600 text-xl"></i>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-github text-gray-800 text-xl"></i>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-5 sm:mt-6 text-xs sm:text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
          >
            Sign up
            <i className="bi bi-arrow-right"></i>
          </Link>
        </p>

        {/* Back to Home */}
        <p className="text-center mt-3 sm:mt-4">
          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}