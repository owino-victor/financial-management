import { useState } from "react";
import { CheckCircle2, Circle, Clock, Edit3, X } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function WeeklyTrackerBar({
  weekDaysData,
  target = 1000,
  isAdmin,
  onUpdateDayAmount,
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Current day index (Mon=0 to Sun=6)
  const todayJs = new Date().getDay(); // 0 is Sun
  const todayIdx = todayJs === 0 ? 6 : todayJs - 1;

  const handleOpenDayModal = (idx) => {
    if (!isAdmin) return;
    setSelectedDayIdx(idx);
    const currentPaid = weekDaysData[idx] ? weekDaysData[idx].paid : 0;
    setCustomAmount(currentPaid > 0 ? currentPaid.toString() : "");
  };

  const handleSaveDayAmount = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!isNaN(val) && val >= 0 && selectedDayIdx !== null) {
      onUpdateDayAmount(selectedDayIdx, val);
      setSelectedDayIdx(null);
      setCustomAmount("");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" /> Weekly Commitment
            Strip
          </h3>
          <p className="text-[11px] text-slate-400">
            {isAdmin
              ? "Click any day to update or recover past entries"
              : "Target: KES 1,000 / day"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {daysOfWeek.map((dayName, idx) => {
          const dayObj = weekDaysData[idx] || { paid: 0 };
          const dayPaid = dayObj.paid || 0;
          const isFullyPaid = dayPaid >= target;
          const isPast = idx < todayIdx;
          const isToday = idx === todayIdx;

          // Check if this was a past missed day that got backfilled later
          const isRecovered = isPast && isFullyPaid;

          // Determine card styling based on day status
          let statusStyle = "bg-slate-950 border-slate-800 text-slate-500";
          if (isFullyPaid) {
            statusStyle =
              "bg-emerald-950/60 border-emerald-500/50 text-emerald-300";
          } else if (isPast) {
            statusStyle = "bg-amber-950/50 border-amber-500/50 text-amber-300";
          } else if (isToday) {
            statusStyle =
              "bg-slate-800 border-emerald-400 text-white shadow-sm";
          }

          return (
            <button
              key={dayName}
              type="button"
              disabled={!isAdmin}
              onClick={() => handleOpenDayModal(idx)}
              className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all text-center relative ${statusStyle} ${
                isAdmin
                  ? "hover:border-emerald-400 hover:scale-[1.02] cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {dayName}
                </span>
                {isAdmin && <Edit3 className="w-2.5 h-2.5 opacity-40" />}
              </div>

              <div className="my-1.5">
                {isFullyPaid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isPast ? (
                  <Circle className="w-5 h-5 text-amber-400 border-dashed" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold">
                  {isFullyPaid
                    ? formatKES(dayPaid)
                    : dayPaid > 0
                      ? formatKES(dayPaid)
                      : isPast
                        ? "Missed"
                        : "-"}
                </span>

                {/* Orange 'Recovered' badge for backfilled past days */}
                {isRecovered && (
                  <span className="text-[9px] font-extrabold uppercase text-amber-400 mt-0.5 tracking-tight">
                    Recovered
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Edit Day Amount Modal */}
      {selectedDayIdx !== null && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-xs text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedDayIdx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold mb-1">
              Update {daysOfWeek[selectedDayIdx]} Entry
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {selectedDayIdx < todayIdx
                ? "Backfilling a past day"
                : "Updating day amount"}
            </p>

            <form onSubmit={handleSaveDayAmount} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Total Amount Received (KES)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDayIdx(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
                >
                  Save Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
