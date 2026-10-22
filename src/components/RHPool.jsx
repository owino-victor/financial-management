import { useState } from "react";
import { Building, HeartPulse, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function RHPool({
  rhBalance,
  rhData,
  isAdmin,
  onAllocateRH,
  onPayRent,
  onPayHealth,
}) {
  const [allocationInput, setAllocationInput] = useState("");

  const RENT_TARGET = 8000;
  const HEALTH_TARGET = 1050;

  // Calculate days remaining in the current month
  const now = new Date();
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const daysLeft = lastDayOfMonth - now.getDate();

  // Urgency status
  const rentPaid = rhData.rentPaid || false;
  const healthPaid = rhData.healthPaid || false;
  const fullyPaid = rentPaid && healthPaid;

  let urgencyClass = "bg-slate-900 border-slate-800"; // Default theme
  if (!fullyPaid) {
    if (daysLeft <= 0) {
      urgencyClass = "bg-rose-950/80 border-rose-500 animate-pulse"; // Past deadline / last day blinking red
    } else if (daysLeft <= 5) {
      urgencyClass = "bg-rose-900/40 border-rose-600"; // Red
    } else if (daysLeft <= 12) {
      urgencyClass = "bg-amber-900/40 border-amber-500"; // Orange
    }
  } else {
    urgencyClass = "bg-emerald-950/40 border-emerald-500/50"; // Complete green
  }

  const handleAllocate = (e) => {
    e.preventDefault();
    const val = parseFloat(allocationInput);
    if (!isNaN(val) && val > 0) {
      onAllocateRH(val);
      setAllocationInput("");
    }
  };

  return (
    <div
      className={`border rounded-2xl p-5 text-white shadow-xl transition-all ${urgencyClass}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Rent & Health (RH) Pool</h3>
            {!fullyPaid && daysLeft <= 12 && (
              <span className="text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> {daysLeft} days left in
                month
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Allocated Balance:{" "}
            <span className="font-bold text-emerald-400">
              {formatKES(rhBalance)}
            </span>
          </p>
        </div>

        {/* Allocate to Pool */}
        {isAdmin && (
          <form onSubmit={handleAllocate} className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Allocate (KES)"
              value={allocationInput}
              onChange={(e) => setAllocationInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white w-32 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              Add Pool
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Rent Card */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200">Rent</span>
            </div>
            <p className="text-base font-bold text-white">
              {formatKES(RENT_TARGET)}
            </p>
            <span
              className={`text-[10px] uppercase font-bold mt-1 inline-block ${rentPaid ? "text-emerald-400" : "text-amber-400"}`}
            >
              {rentPaid ? "Paid" : "Pending"}
            </span>
          </div>

          {isAdmin && !rentPaid && (
            <button
              onClick={onPayRent}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
            >
              Pay Rent
            </button>
          )}
          {rentPaid && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
        </div>

        {/* Health Cover Card */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-slate-200">Health Cover</span>
            </div>
            <p className="text-base font-bold text-white">
              {formatKES(HEALTH_TARGET)}
            </p>
            <span
              className={`text-[10px] uppercase font-bold mt-1 inline-block ${healthPaid ? "text-emerald-400" : "text-amber-400"}`}
            >
              {healthPaid ? "Paid" : "Pending"}
            </span>
          </div>

          {isAdmin && !healthPaid && (
            <button
              onClick={onPayHealth}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
            >
              Pay Health
            </button>
          )}
          {healthPaid && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
        </div>
      </div>
    </div>
  );
}
