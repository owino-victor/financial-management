import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function TodayBanner({
  todayData,
  target = 1000,
  isAdmin,
  onAddPayment,
}) {
  const [customAmount, setCustomAmount] = useState("");

  const paid = todayData.paid || 0;
  const percentage = Math.min(100, Math.round((paid / target) * 100));
  const isComplete = paid >= target;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!isNaN(val) && val > 0) {
      onAddPayment(val);
      setCustomAmount("");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white shadow-xl">
      {/* Background Dynamic Progress Fill */}
      <div
        className={`absolute top-0 left-0 bottom-0 transition-all duration-500 ease-out ${
          isComplete
            ? "bg-emerald-600/30 border-r-2 border-emerald-500"
            : "bg-amber-600/25 border-r-2 border-amber-500"
        }`}
        style={{ width: `${percentage}%` }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Day & Balance Readout */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Today's Goal
            </span>
            {isComplete ? (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Target Cleared
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" /> {formatKES(target - paid)}{" "}
                Remaining
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {todayData.dayName} Tracker
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Received:{" "}
            <span className="font-bold text-white">{formatKES(paid)}</span> /{" "}
            {formatKES(target)} ({percentage}%)
          </p>
        </div>

        {/* Free-form Custom Payment Entry (Admin Only) */}
        {isAdmin && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Enter amount (e.g. 240)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-44"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition shadow"
            >
              Add Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
