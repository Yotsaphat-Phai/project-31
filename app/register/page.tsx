"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // ตรวจสอบความแข็งแรงของ password
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { level: 2, text: "Medium", color: "bg-yellow-500" };
    return { level: 3, text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!agreedTerms) {
      alert("Please agree to Terms & Conditions");
      return;
    }

    console.log("Register:", { name, email, phone, password });
    alert(`🎉 Register Success!\nName: ${name}\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <i className="bi bi-person-plus-fill text-white text-3xl sm:text-4xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
            Join us today! It&apos;s free.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <i className="bi bi-person-fill text-pink-500 mr-1"></i>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-person-fill text-gray-400 text-lg"></i>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <i className="bi bi-envelope-fill text-pink-500 mr-1"></i>
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <i className="bi bi-telephone-fill text-pink-500 mr-1"></i>
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-telephone-fill text-gray-400 text-lg"></i>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="08X-XXX-XXXX"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <i className="bi bi-lock-fill text-pink-500 mr-1"></i>
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
                className="w-full pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="At least 6 characters"
                required
                minLength={6}
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition ${
                      passwordStrength.level >= 1 ? passwordStrength.color : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition ${
                      passwordStrength.level >= 2 ? passwordStrength.color : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition ${
                      passwordStrength.level >= 3 ? passwordStrength.color : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Password strength: <span className="font-semibold">{passwordStrength.text}</span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <i className="bi bi-shield-lock-fill text-pink-500 mr-1"></i>
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-shield-lock-fill text-gray-400 text-lg"></i>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-16 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="Re-enter password"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                {confirmPassword && (
                  <>
                    {password === confirmPassword ? (
                      <i className="bi bi-check-circle-fill text-green-500 text-lg"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-red-500 text-lg"></i>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                    } text-lg`}
                  ></i>
                </button>
              </div>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <i className="bi bi-exclamation-circle-fill"></i>
                Passwords do not match
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start text-xs sm:text-sm text-gray-600 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 flex-shrink-0"
              required
            />
            <span className="ml-2">
              I agree to the{" "}
              <a href="#" className="text-pink-600 hover:text-pink-800 font-medium">
                Terms & Conditions
              </a>
              {" "}and{" "}
              <a href="#" className="text-pink-600 hover:text-pink-800 font-medium">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm sm:text-base font-semibold py-3 rounded-xl hover:from-pink-600 hover:to-rose-700 active:scale-95 sm:hover:scale-[1.02] transition duration-200 shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <i className="bi bi-person-check-fill text-lg"></i>
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-3 sm:px-4 bg-white text-gray-500">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button className="flex items-center justify-center border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-google text-red-500 text-xl"></i>
          </button>
          <button className="flex items-center justify-center border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-facebook text-blue-600 text-xl"></i>
          </button>
          <button className="flex items-center justify-center border border-gray-300 rounded-xl py-2.5 hover:bg-gray-50 active:bg-gray-100 transition">
            <i className="bi bi-github text-gray-800 text-xl"></i>
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-5 sm:mt-6 text-xs sm:text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-pink-600 hover:text-pink-800 font-semibold inline-flex items-center gap-1"
          >
            Sign in
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