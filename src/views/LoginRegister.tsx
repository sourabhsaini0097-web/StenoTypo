import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { AuthSession } from '../types/steno';
import { Headphones, ShieldAlert, KeyRound, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginRegisterProps {
  onAuthSuccess: (session: AuthSession) => void;
}

export const LoginRegister: React.FC<LoginRegisterProps> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'student_login' | 'admin_login' | 'register'>('student_login');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = AuthService.login(email, password);
      setIsSubmitting(false);

      if (res.success && res.session) {
        onAuthSuccess(res.session);
      } else {
        setErrorMsg(res.error || 'Authentication failed.');
      }
    }, 200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = AuthService.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        rollNo: regRollNo,
      });
      setIsSubmitting(false);

      if (res.success && res.session) {
        onAuthSuccess(res.session);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    }, 200);
  };

  const setDemoCredentials = (type: 'admin' | 'active_student' | 'expired_student') => {
    setErrorMsg(null);
    if (type === 'admin') {
      setActiveTab('admin_login');
      setEmail('admin@stenotype.com');
      setPassword('admin123');
    } else if (type === 'active_student') {
      setActiveTab('student_login');
      setEmail('rahul.sharma@gmail.com');
      setPassword('student123');
    } else {
      setActiveTab('student_login');
      setEmail('priya.verma@gmail.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-emerald-200 rounded-2xl shadow-xl p-6 sm:p-8 text-slate-800">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25 mb-3">
            <Headphones className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-emerald-950 tracking-tight">
            StenoTypo Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hindi & English Steno Dictation and Typing Assessment
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 p-1 bg-emerald-50 rounded-xl border border-emerald-200 mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student_login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'student_login'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'admin_login'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block mb-0.5">Authentication Notice</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Forms */}
        {activeTab !== 'register' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                {activeTab === 'admin_login' ? 'Admin Email' : 'Student Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin_login' ? 'admin@stenotype.com' : 'student@gmail.com'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm ${
                activeTab === 'admin_login'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <span>Verifying JWT Credentials...</span>
              ) : (
                <>
                  <span>{activeTab === 'admin_login' ? 'Access Admin Console' : 'Sign In as Student'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Vikas Verma"
                className="w-full px-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="vikas@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                  Roll / Exam ID
                </label>
                <input
                  type="text"
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="ST-2026-..."
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                Create Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              * New student registrations receive a 30-day active validity. Admin manages subscription renewals.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Complete Student Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 1-Click Demo Credential Chips */}
        <div className="mt-6 pt-5 border-t border-emerald-100">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 text-center mb-2.5 font-semibold">
            Quick 1-Click Test Accounts
          </p>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="w-full p-2.5 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 text-left flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-800">Admin Account</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">admin@stenotype.com</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('active_student')}
              className="w-full p-2.5 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 text-left flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Active Student</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-medium">Valid Subscription</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('expired_student')}
              className="w-full p-2.5 rounded-lg bg-red-50/60 hover:bg-red-100/70 border border-red-200 text-left flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-semibold text-red-900">Expired Student (Priya)</span>
              </div>
              <span className="text-[11px] font-mono text-red-600 font-medium">Test Expired Block</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
