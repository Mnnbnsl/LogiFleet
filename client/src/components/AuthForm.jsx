import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon, Code, User, Terminal, Briefcase } from 'lucide-react';

export default function AuthForm({ 
  isDarkMode: propIsDarkMode, 
  setIsDarkMode: propSetIsDarkMode, 
  isRegister: propIsRegister, 
  setIsRegister: propSetIsRegister 
}) {
  const navigate = useNavigate();

  // Local state fallbacks in case props are not passed by react-router-dom
  const [localDarkMode, setLocalDarkMode] = useState(true);
  const [localRegister, setLocalRegister] = useState(false);

  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : localDarkMode;
  const setIsDarkMode = propSetIsDarkMode || setLocalDarkMode;
  const isRegister = propIsRegister !== undefined ? propIsRegister : localRegister;
  const setIsRegister = propSetIsRegister || setLocalRegister;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "", // Required by backend
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mainIllustrationAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256";
  const formHeaderAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      let response;

      if (isRegister) {
        response = await API.post("/auth/register", formData);
      } else {
        response = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      if (!isRegister) {
        localStorage.setItem("token", response.data.data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Account created successfully! Please login.");
        setIsRegister(false);
      }

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
      });

    } catch (err) {
      setError(
        err.response?.data?.error?.message || err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-6xl rounded-[24px] border overflow-hidden flex flex-col md:flex-row relative min-h-[680px] transition-all duration-300 ${
      isDarkMode 
        ? 'bg-[#111827] border-slate-800 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]' 
        : 'bg-white border-slate-200 shadow-[0_32px_64px_-15px_rgba(15,23,42,0.08)]'
    }`}>
      
      {/* ================= THEME TOGGLE BUTTON ================= */}
      <div className={`absolute top-6 right-8 z-30 flex items-center rounded-full p-1 border transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button 
          onClick={() => setIsDarkMode(false)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            !isDarkMode 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sun size={13} className="stroke-[2.5]" /> Light
        </button>
        <button 
          onClick={() => setIsDarkMode(true)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            isDarkMode 
              ? 'bg-[#1e293b] text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Moon size={13} className="stroke-[2.5]" /> Dark
        </button>
      </div>

      {/* ================= LEFT SIDE: HERO/TECH PANEL ================= */}
      <div className={`w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0f172a] border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Decorative Blur Ambient Flares */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Branding */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Code size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-wide leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LogiFleet</h1>
            <span className="text-[9px] font-bold tracking-[0.2em] text-blue-600 block mt-0.5">SMART OPERATIONS</span>
          </div>
        </div>

        {/* Dynamic Text Typography */}
        <div className="max-w-md my-auto z-10 pt-12 md:pt-0">
          <h2 className={`text-3xl md:text-[38px] font-extrabold tracking-tight leading-[1.2] transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Manage trips.<br />
            Track expenses.<br />
            <span className="text-blue-600">Optimize ROI.</span>
          </h2>
          <p className={`mt-4 text-sm md:text-base leading-relaxed font-normal transition-colors duration-300 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Join thousands of dispatch managers and drivers using LogiFleet to optimize vehicle operations.
          </p>
        </div>

        {/* ================= REALISTIC DASHBOARD/CODE GRAPHIC ================= */}
        <div className="mt-8 flex justify-center items-end relative h-60 w-full select-none z-10">
          
          {/* Realistic IDE / Terminal Window Card */}
          <div className={`w-full max-w-[400px] rounded-xl border shadow-2xl overflow-hidden font-mono text-xs transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Window Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <div className={`text-[10px] flex items-center gap-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Terminal size={10} /> config.json
              </div>
              <div className="w-10"></div>
            </div>
            
            {/* Window Content Display */}
            <div className="p-4 space-y-1 text-[11px] leading-relaxed">
              <div className="text-slate-400 dark:text-slate-600">// Initialize operations platform</div>
              <div>
                <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">platform</span> ={' '}
                <span className="text-emerald-600 dark:text-emerald-400">"LogiFleet"</span>;
              </div>
              <div className="pt-2">
                <span className="text-blue-600 dark:text-blue-500">const</span>{' '}
                <span className="text-amber-600 dark:text-amber-400">config</span> = &#123;
              </div>
              <div className="pl-4">
                theme: <span className="text-emerald-600 dark:text-emerald-400">"{isDarkMode ? 'dark' : 'light'}"</span>,
              </div>
              <div className="pl-4">
                status: <span className="text-emerald-600 dark:text-emerald-400">'active_session'</span>,
              </div>
              <div className="pl-4">
                version: <span className="text-amber-600 dark:text-amber-500">1.0.0</span>
              </div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* User Micro Badge Overlay */}
          <div className={`absolute -right-2 top-8 rounded-xl p-3 border shadow-lg flex items-center gap-3 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            <img src={mainIllustrationAvatar} className="w-8 h-8 rounded-full object-cover" alt="User Avatar" />
            <div>
              <div className={`text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Admin</div>
              <div className="text-[9px] font-medium text-blue-500">Logistics HQ</div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE: MATTE FORM COMPONENT ================= */}
      <div className={`w-full md:w-1/2 p-6 sm:p-12 md:p-16 flex flex-col justify-center transition-colors duration-300 ${
        isDarkMode ? 'bg-[#111827]' : 'bg-white'
      }`}>
        <div className="w-full max-w-sm mx-auto">
          
          {/* Header Icon Setup */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-full p-0.5 border flex items-center justify-center relative shadow-sm transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src={formHeaderAvatar} 
                  alt="Account Session Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 text-xs p-0.5 rounded-full shadow border transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                👋
              </span>
            </div>
            
            <h3 className={`text-xl font-bold tracking-tight mt-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {isRegister ? 'Create your account' : 'Welcome back!'}
            </h3>
            <p className={`text-xs mt-1 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {isRegister ? 'Get started with your hackathon journey' : 'Sign in with your account to continue'}
            </p>
          </div>

          {/* Form Processing Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-600"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>System Role</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Briefcase size={15} />
                    </span>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-600"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    >
                      <option value="" disabled>Select User Role</option>
                      <option value="FLEET_MANAGER">Fleet Manager</option>
                      <option value="DRIVER">Driver</option>
                      <option value="SAFETY_OFFICER">Safety Officer</option>
                      <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-600"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-600"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Form Settings Options */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className={`flex items-center gap-2 cursor-pointer select-none transition-colors duration-300 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 accent-blue-600" />
                {isRegister ? 'Accept terms' : 'Remember me'}
              </label>
              {!isRegister && (
                <a href="#forgot" className="font-semibold text-blue-600 hover:underline transition-colors">Forgot password?</a>
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            {/* Call To Action Buttons */}
            <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md group active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed" >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
              {!loading && (
                <ArrowRight
                  size={14}
                  className="transform group-hover:translate-x-0.5 transition-transform"
                />
              )}
            </button>
          </form>

          {/* Secure Divider Markup */}
          <div className="relative flex items-center my-6">
            <div className={`flex-grow border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
            <span className={`flex-shrink mx-3 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${
              isDarkMode ? 'text-slate-600' : 'text-slate-400'
            }`}>Secure Connection</span>
            <div className={`flex-grow border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
          </div>

          {/* Alternative Switching Toggle */}
          <p className={`text-center text-xs font-normal transition-colors duration-300 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setError("");
                setFormData({
                  fullName: "",
                  email: "",
                  password: "",
                  role: "",
                });
                setIsRegister(!isRegister);
              }}
              className="font-bold text-blue-600 hover:underline ml-0.5 transition-colors"
            >
              {isRegister ? 'Log in' : 'Create account'}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}