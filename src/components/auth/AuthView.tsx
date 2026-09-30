import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Lock,
  Mail,
  Building,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Briefcase,
  Store,
  Truck,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, signup, resetPassword, setActiveView, users } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('danjuma@apexglobal.com');
  const [signInPassword, setSignInPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [signupType, setSignupType] = useState<'enterprise' | 'vendor'>('enterprise');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('requester');

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'input' | 'sent'>('input');
  const [newPassword, setNewPassword] = useState('');

  // Status message
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const demoRoles: { role: UserRole; title: string; email: string; desc: string; icon: string }[] = [
    {
      role: 'owner',
      title: 'Business Owner / Executive',
      email: 'danjuma@apexglobal.com',
      desc: 'Global financial governance, budget overrides & full analytics',
      icon: '👔',
    },
    {
      role: 'procurement_officer',
      title: 'Procurement Officer',
      email: 's.jenkins@apexglobal.com',
      desc: 'RFQs, bid evaluation, supplier management & purchase orders',
      icon: '📦',
    },
    {
      role: 'approver',
      title: 'Department Approver / Manager',
      email: 'm.chen@apexglobal.com',
      desc: 'Review requisitions, evaluate budget impact, approve or reject',
      icon: '✍️',
    },
    {
      role: 'finance',
      title: 'Finance Comptroller',
      email: 'fatima.fin@apexglobal.com',
      desc: 'Invoices, 3-way matching discrepancies, payment runs',
      icon: '💳',
    },
    {
      role: 'requester',
      title: 'Employee / Requester',
      email: 'e.adebayo@apexglobal.com',
      desc: 'Submit purchase requests, track personal items and delivery status',
      icon: '👤',
    },
    {
      role: 'vendor',
      title: 'External Vendor / Supplier Partner',
      email: 'bids@nexuslogistics.com',
      desc: 'Dedicated Supplier Portal: submit bids, dispatch POs, bill client',
      icon: '🏢',
    },
  ];

  const handleQuickLogin = (email: string, role: UserRole) => {
    login(email, role);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    login(signInEmail);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) {
      setMessage({ type: 'error', text: 'Please provide both your name and business email.' });
      return;
    }
    signup(signupName, signupEmail, signupRole, signupOrg, signupType === 'vendor');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }
    resetPassword(forgotEmail, newPassword);
    setForgotStep('sent');
  };

  return (
    <div className="min-h-screen bg-[#04140e] text-[#f1f5f3] flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Architectural Grid & Subtle Amber Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#143e2f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0a3d2e]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full pb-4 border-b border-[#143e2f]/70">
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center font-extrabold text-[#d4af37] text-lg shadow-md group-hover:border-[#d4af37] transition">
            P
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
              Procura
            </span>
            <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-semibold block mt-0.5">
              Smart Procurement OS
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveView('landing')}
          className="text-xs font-semibold text-slate-300 hover:text-[#d4af37] transition"
        >
          ← Back to Overview
        </button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-[#082117] border border-[#143e2f] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            {/* Header Titles */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d3b2b] border border-[#d4af37]/30 text-[#d4af37] text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Identity & Access Management (RBAC)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {mode === 'signin' && 'Sign in to your Procurement Workspace'}
                {mode === 'signup' && 'Create your Organization or Vendor Account'}
                {mode === 'forgot' && 'Reset your Security Credentials'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {mode === 'signin' && 'Secure multi-entity procurement gateway with role separation.'}
                {mode === 'signup' && 'Register your company or sign up as an approved supplier partner.'}
                {mode === 'forgot' && 'Enter your work email to receive password reset instructions.'}
              </p>
            </div>

            {/* Error / Success Banner */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  message.type === 'error'
                    ? 'bg-rose-950/50 border border-rose-800 text-rose-300'
                    : 'bg-emerald-950/50 border border-emerald-700 text-emerald-300'
                }`}
              >
                <span>{message.text}</span>
              </div>
            )}

            {/* MODE 1: SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setMessage(null);
                      }}
                      className="text-xs text-[#d4af37] hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#143e2f] bg-[#051710] text-[#d4af37] focus:ring-0"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit TLS Secured
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Authorize & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-4 border-t border-[#143e2f] text-center text-xs text-slate-400">
                  Don't have an enterprise account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setMessage(null);
                    }}
                    className="text-[#d4af37] hover:underline font-bold"
                  >
                    Register Organization or Supplier
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: SIGN UP */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSignupType('enterprise');
                        setSignupRole('owner');
                      }}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        signupType === 'enterprise'
                          ? 'bg-[#0d3b2b] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#051710] border-[#143e2f] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Building className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Enterprise / Buyer</div>
                        <div className="text-[10px] text-slate-300">Office, SME, Hospital, Store</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSignupType('vendor');
                        setSignupRole('vendor');
                      }}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                        signupType === 'vendor'
                          ? 'bg-[#0d3b2b] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#051710] border-[#143e2f] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Supplier / Vendor</div>
                        <div className="text-[10px] text-slate-300">Bidding & Fulfilling POs</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {signupType === 'vendor' ? 'Company Legal Name' : 'Organization Name'}
                    </label>
                    <input
                      type="text"
                      value={signupOrg}
                      onChange={(e) => setSignupOrg(e.target.value)}
                      placeholder={signupType === 'vendor' ? 'e.g. Apex Supplies Ltd' : 'e.g. Global Ventures Inc'}
                      className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Representative Full Name
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Samuel Okon"
                      className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="name@business.com"
                      className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Initial System Role
                    </label>
                    {signupType === 'vendor' ? (
                      <input
                        type="text"
                        value="External Supplier / Vendor Portal"
                        disabled
                        className="w-full bg-[#051710]/50 border border-[#143e2f] rounded-xl px-3 py-2 text-xs text-[#d4af37] font-semibold cursor-not-allowed"
                      />
                    ) : (
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value as UserRole)}
                        className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="owner">Business Owner / Exec</option>
                        <option value="procurement_officer">Procurement Officer</option>
                        <option value="approver">Department Manager / Approver</option>
                        <option value="finance">Finance Comptroller</option>
                        <option value="requester">Employee / Requester</option>
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Security Password
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Complete Registration & Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-3 border-t border-[#143e2f] text-center text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setMessage(null);
                    }}
                    className="text-[#d4af37] hover:underline font-bold"
                  >
                    Sign in to existing account
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {forgotStep === 'input' ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Enter your registered corporate email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="e.g. danjuma@apexglobal.com"
                          className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        New Security Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-[#d4af37]/70 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter your new password"
                          className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Update Password & Send Verification</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-5 rounded-xl bg-[#092b1f] border border-[#d4af37]/40 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">Password Updated Successfully</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Your authentication credentials for <strong>{forgotEmail}</strong> have been securely refreshed.
                    </p>
                    <button
                      onClick={() => {
                        setMode('signin');
                        setForgotStep('input');
                        setMessage({ type: 'success', text: 'Password successfully updated. You may now sign in.' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#051b14] font-bold text-xs hover:bg-[#c49f2b] transition"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-[#143e2f] text-center text-xs text-slate-400">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setMessage(null);
                    }}
                    className="text-[#d4af37] hover:underline font-bold"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 1-Click Role Switcher & Persona Testing for University Defense */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] shadow-xl">
              <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Demo & Evaluation Personas</span>
              </div>
              <h2 className="text-sm font-extrabold text-white mb-1">
                Instant 1-Click Role Demonstration
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Click any role below to instantly log in as that persona and verify their strict role-based interface:
              </p>

              <div className="space-y-2">
                {demoRoles.map((dr) => (
                  <button
                    key={dr.role}
                    type="button"
                    onClick={() => handleQuickLogin(dr.email, dr.role)}
                    className="w-full p-2.5 rounded-xl bg-[#051710] hover:bg-[#0c2f21] border border-[#143e2f] hover:border-[#d4af37]/50 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{dr.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
                          {dr.title}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{dr.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* University Capstone Security Notice */}
            <div className="p-4 rounded-xl bg-[#051710]/80 border border-[#143e2f] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RBAC & Segregation of Duties (SoD) Enforced</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Requesters cannot approve their own purchases. Bidders and vendors only view external opportunities and invoices. Financial dispatches require finance comptroller clearance.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-4 border-t border-[#143e2f]/70 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Procura Procurement Operating System • Enterprise Edition</div>
        <div className="text-[#d4af37]/80 text-[11px]">Dark Green & Heritage Gold Design System</div>
      </footer>
    </div>
  );
};
