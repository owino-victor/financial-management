import { CheckCircle2, Circle, Clock } from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function WeeklyTrackerBar({ weekDaysData, target = 1000 }) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Map current day index to 0-6 (Mon-Sun)
  const todayJs = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayIdx = todayJs === 0 ? 6 : todayJs - 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-400" /> Weekly Commitment Strip
        </h3>
        <span className="text-xs text-slate-400">
          Target: {formatKES(target)} / day
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {daysOfWeek.map((dayName, idx) => {
          const dayPaid = weekDaysData[idx] ? weekDaysData[idx].paid : 0;
          const isFullyPaid = dayPaid >= target;
          const isPast = idx < todayIdx;
          const isToday = idx === todayIdx;

          // Determine card styling based on day status
          let statusStyle = "bg-slate-950 border-slate-800 text-slate-500"; // Default future
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
            <div
              key={dayName}
              className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all text-center ${statusStyle}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {dayName}
              </span>

              <div className="my-1.5">
                {isFullyPaid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isPast ? (
                  <Circle className="w-5 h-5 text-amber-400 border-dashed" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <span className="text-[10px] font-semibold">
                {isFullyPaid
                  ? "Done"
                  : dayPaid > 0
                    ? `${Math.round((dayPaid / target) * 100)}%`
                    : isPast
                      ? "Missed"
                      : "-"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
