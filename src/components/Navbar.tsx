import React from 'react';
import { User } from '../types/steno';
import { Headphones, Keyboard, ShieldAlert, LogOut, CheckCircle, Clock, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  onSwitchToStudent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchToAdmin,
  onSwitchToStudent,
}) => {
  const getSubscriptionInfo = () => {
    if (!currentUser || currentUser.role !== 'student') return null;

    const expiryTime = new Date(currentUser.subscriptionExpiry).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0 || currentUser.subscriptionStatus === 'expired') {
      return {
        isExpired: true,
        text: 'Subscription Expired',
        subtext: 'Contact Admin',
      };
    }

    return {
      isExpired: false,
      text: `Active (${daysLeft}d left)`,
      subtext: new Date(currentUser.subscriptionExpiry).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
    };
  };

  const subInfo = getSubscriptionInfo();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-emerald-950 font-display">
                StenoTypo
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                Dictation & Typing Portal
              </span>
            </div>
          </div>
        </div>

        {/* User context & actions */}
        {currentUser ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Subscription status tag for students */}
            {currentUser.role === 'student' && subInfo && (
              <div
                className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono border ${
                  subInfo.isExpired
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-100/80 border-emerald-300 text-emerald-800'
                }`}
              >
                {subInfo.isExpired ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{subInfo.text}</span>
              </div>
            )}

            {/* Role indicator */}
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {currentUser.name}
                </p>
                <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-500 font-mono">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="capitalize">{currentUser.role}</span>
                  {currentUser.rollNo && (
                    <span className="hidden lg:inline text-slate-400">· {currentUser.rollNo}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-emerald-100/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono">
            Government Exam Steno & Typing Standards
          </div>
        )}
      </div>
    </header>
  );
};
