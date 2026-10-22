import { Shield, ShieldCheck, Wallet, Calendar } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function Header({
  mainBalance,
  weeklySatFriDeposit,
  isAdmin,
  onOpenPinModal,
  onSwitchToMike,
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white p-4 sticky top-0 z-30 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Brand & User Selector */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400">
              Finance Tracker
            </h1>
            <p className="text-xs text-slate-400">
              Viewing as:{" "}
              <span className="font-semibold text-white">
                {isAdmin ? "Victor (Admin)" : "Mike"}
              </span>
            </p>
          </div>

          <div className="sm:hidden">
            {isAdmin ? (
              <button
                onClick={onSwitchToMike}
                className="flex items-center gap-1 text-xs bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-full"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Active
              </button>
            ) : (
              <button
                onClick={onOpenPinModal}
                className="flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Login
              </button>
            )}
          </div>
        </div>

        {/* Balances Summary */}
        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
          {/* Main Total */}
          <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl min-w-[140px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Main Balance</span>
            </div>
            <p className="text-lg font-bold text-white tracking-wide">
              {formatKES(mainBalance)}
            </p>
          </div>

          {/* Sat - Fri Weekly Contribution */}
          <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl min-w-[140px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Sat–Fri Received</span>
            </div>
            <p className="text-lg font-bold text-blue-300 tracking-wide">
              {formatKES(weeklySatFriDeposit)}
            </p>
          </div>
        </div>

        {/* Desktop Admin Toggle */}
        <div className="hidden sm:block">
          {isAdmin ? (
            <button
              onClick={onSwitchToMike}
              className="flex items-center gap-1.5 text-xs bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl transition"
            >
              <ShieldCheck className="w-4 h-4" /> Admin (Victor)
            </button>
          ) : (
            <button
              onClick={onOpenPinModal}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <Shield className="w-4 h-4" /> Switch to Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
