import React, { useState, useEffect } from 'react';
import { User, TestPassage, TestResult, AuthSession } from './types/steno';
import { AuthService } from './services/auth';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { ResultModal } from './components/ResultModal';
import { LoginRegister } from './views/LoginRegister';
import { AdminDashboard } from './views/AdminDashboard';
import { StudentDashboard } from './views/StudentDashboard';
import { TestRunner } from './views/TestRunner';
import { Shield, UserCheck, AlertOctagon, RotateCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTest, setActiveTest] = useState<TestPassage | null>(null);
  const [viewingResult, setViewingResult] = useState<TestResult | null>(null);

  // Initialize session on mount
  useEffect(() => {
    // Make sure seed data and auto-expiration run
    StorageService.getUsers();
    const session = AuthService.getCurrentSession();
    if (session) {
      setCurrentUser(session.user);
    }
  }, []);

  const handleAuthSuccess = (session: AuthSession) => {
    setCurrentUser(session.user);
    setActiveTest(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setActiveTest(null);
    setViewingResult(null);
  };

  // Quick switch for demo purposes
  const handleQuickSwitch = (role: 'admin' | 'active_student' | 'expired_student') => {
    setActiveTest(null);
    setViewingResult(null);

    if (role === 'admin') {
      const res = AuthService.login('admin@stenotype.com', 'admin123');
      if (res.session) setCurrentUser(res.session.user);
    } else if (role === 'active_student') {
      const res = AuthService.login('rahul.sharma@gmail.com', 'student123');
      if (res.session) setCurrentUser(res.session.user);
    } else {
      // Trying to switch to expired student
      const res = AuthService.login('priya.verma@gmail.com', 'student123');
      if (res.success && res.session) {
        setCurrentUser(res.session.user);
      } else {
        alert(res.error || 'Access Denied: Student subscription expired.');
        handleLogout();
      }
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchToAdmin={() => handleQuickSwitch('admin')}
        onSwitchToStudent={() => handleQuickSwitch('active_student')}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {!currentUser ? (
          <LoginRegister onAuthSuccess={handleAuthSuccess} />
        ) : activeTest ? (
          <TestRunner
            passage={activeTest}
            currentUser={currentUser}
            onFinishTest={(result) => {
              setActiveTest(null);
              setViewingResult(result);
            }}
            onCancelTest={() => setActiveTest(null)}
          />
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard
            onSelectResultToView={(result) => setViewingResult(result)}
          />
        ) : (
          <StudentDashboard
            currentUser={currentUser}
            onStartTest={(passage) => setActiveTest(passage)}
            onViewResult={(result) => setViewingResult(result)}
          />
        )}
      </main>

      {/* Evaluation Scorecard / Diff Modal */}
      <ResultModal
        result={viewingResult}
        onClose={() => setViewingResult(null)}
        onRetakeTest={() => {
          if (viewingResult) {
            const passage = StorageService.getPassages().find(
              (p) => p.id === viewingResult.testId
            );
            if (passage) setActiveTest(passage);
          }
        }}
      />

      {/* Quick Role & Test Switcher Float (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 p-1.5 rounded-xl bg-white/95 border border-emerald-200 shadow-xl backdrop-blur-md text-xs font-mono">
        <span className="px-2 text-slate-500 text-[11px]">Role Switcher:</span>

        <button
          onClick={() => handleQuickSwitch('admin')}
          className={`px-2.5 py-1 rounded transition-colors ${
            currentUser?.role === 'admin'
              ? 'bg-amber-600 text-white font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-100/70'
          }`}
        >
          Admin
        </button>

        <button
          onClick={() => handleQuickSwitch('active_student')}
          className={`px-2.5 py-1 rounded transition-colors ${
            currentUser?.role === 'student' && currentUser.email === 'rahul.sharma@gmail.com'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-100/70'
          }`}
        >
          Active Student
        </button>

        <button
          onClick={() => handleQuickSwitch('expired_student')}
          title="Try login as expired student to verify subscription expiration block!"
          className="px-2.5 py-1 rounded text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
        >
          Test Expired Student
        </button>
      </div>
    </div>
  );
}
