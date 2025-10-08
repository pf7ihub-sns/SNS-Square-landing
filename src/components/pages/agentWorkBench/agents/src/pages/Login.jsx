
"use client";

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import BackgroundImg from "../assets/images/bg.png";
import LoginRightImg from "../assets/images/sideright.png";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      {/* Subtle background lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            url(${BackgroundImg}),
            linear-gradient(135deg, rgba(15,23,42,0.03) 1px, transparent 1px),
            linear-gradient(45deg, rgba(15,23,42,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "cover, 32px 32px, 32px 32px",
          backgroundPosition: "center, 0 0, 16px 16px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Form */}
          <div className="p-6 sm:p-10">
            {/* Back */}
            <button
              onClick={() => navigate("../")}
              className="mb-8 inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-lg font-bold tracking-wider text-[#003049]">LOGIN</h1>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome Back!</h2>
              <p className="mt-2 text-[#8E8E8E]">
                <span>Please enter your login credentials to access</span>
                <br />
                <span>your account</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your mail ID or Username"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition bg-white text-slate-900 placeholder-slate-500`}
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your Password"
                    className={`w-full pl-11 pr-11 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition bg-white text-slate-900 placeholder-slate-500`}
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
                {/* <div className="text-right mt-2">
                  <Link to="/" className="text-[16px] text-[#000000] transition hover:text-blue-600">
                    Forgot Password?
                  </Link>
                </div> */}
              </div>

              {/* General Error (for detail messages not tied to specific fields) */}
              {errors.general && <p className="text-red-500 mt-1 text-sm text-center">{errors.general}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#003049] hover:bg-teal-900 text-white py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              {/* Terms */}
              <p className="text-sm text-[#8E8E8E] text-center">
                By clicking login, you’re accepting our{" "}
                <Link to="/terms" className="text-[#003049] hover:underline">
                  terms and conditions
                </Link>
                .
              </p>
            </form>
          </div>

          {/* Right: Promo Panel */}
          <div className="hidden lg:block p-5">
            <div className="h-full w-full relative overflow-hidden">
              {/* <!-- Inner framed panel to mimic thick border --> */}
              <div className="h-full w-full rounded-xl border-[10px] border-white/15 p-5 relative mt-2">
                {/* <!-- Image --> */}
                <img
                  src={LoginRightImg}
                  alt="Healthcare professional"
                  className="absolute bottom-2 right-2 w-full h-full object-contain select-none"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Success Popup --> */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-12 rounded-xl shadow-2xl border border-slate-200 flex items-center space-x-4 transform scale-100 animate-pop">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="text-xl font-semibold text-slate-900">Successfully Logged In!</p>
          </div>
        </div>
      )}
    </div>
  );
}