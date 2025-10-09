"use client";

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ email: "", password: "", general: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL_DOCSENTRA || "http://localhost:8080"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      if (res.ok) {
        const data = await res.json();
        // ===== JWT Functionality Start =====
        // Store JWT token
        localStorage.setItem("token", data.access_token || "");

        // Store user info (id, name, email, role)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id || null,
            name: data.name || "",
            email: formData.email,
            role: data.role || role,
          })
        );
        // ===== JWT Functionality End =====
        setShowSuccess(true); // Show success popup
        setTimeout(() => {
          setShowSuccess(false);
          // Navigate based on role
          if (data.role === "nurse") {
            navigate("../nurse/dashboard");
          } else if (data.role === "doctor") {
            navigate("../doctor/dashboard");
          } else {
            navigate(`../dashboard/${data.role}`); // Fallback for other roles
          }
        }, 2000); // Close popup and navigate after 2 seconds
      } else {
        const errorData = await res.json();
        // Handle field-specific errors if present
        let newErrors = {
          email: errorData.email || "",
          password: errorData.password || "",
          general: "",
        };
        // Handle 'detail' field (e.g., {"detail": "Incorrect password"})
        if (errorData.detail) {
          // Assume detail is for password if it mentions password, or set as general
          if (errorData.detail.toLowerCase().includes("password")) {
            newErrors.password = errorData.detail;
          } else if (errorData.detail.toLowerCase().includes("username") || errorData.detail.toLowerCase().includes("email")) {
            newErrors.email = errorData.detail;
          } else {
            newErrors.general = errorData.detail;
          }
        }
        setErrors(newErrors);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setErrors({
        email: "",
        password: "",
        general: "Network error, please try again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-manrope">
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <button 
          onClick={() => navigate("../")}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium text-sm">Docsentra</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-4xl">
          {/* Card Container */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Form */}
              <div className="p-8 sm:p-10">
                {/* Heading */}
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                    Login
                  </h1>
                  <p className="text-sm md:text-base text-slate-600">
                    Enter your credentials to access your account
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email or username"
                        className={`w-full pl-11 pr-4 py-2.5 rounded-md border ${
                          errors.email 
                            ? "border-red-500" 
                            : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white text-slate-900 placeholder-slate-500`}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-label="Email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        className={`w-full pl-11 pr-11 py-2.5 rounded-md border ${
                          errors.password 
                            ? "border-red-500" 
                            : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white text-slate-900 placeholder-slate-500`}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
                  </div>

                  {/* General Error */}
                  {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors duration-200 text-sm"
                  >
                    Login
                  </button>

                  {/* Terms */}
                  <p className="text-xs text-slate-500 text-center">
                    By clicking login, you're accepting our{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      terms and conditions
                    </Link>
                    .
                  </p>
                </form>
              </div>

              {/* Right: Info Panel */}
              <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure Access</h3>
                  <p className="text-slate-600 text-sm">
                    Your account is protected with industry-standard security protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <p className="text-lg font-semibold text-slate-900">Successfully Logged In!</p>
          </div>
        </div>
      )}
    </div>
  );
}
