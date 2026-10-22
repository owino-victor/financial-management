import { useState } from "react";
import {
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react";
import { formatKES } from "../utils/helpers";

export default function Reports({ data, weeklySatFriTotal }) {
  const [forceShowTest, setForceShowTest] = useState(false);

  const now = new Date();
  const isSunday = now.getDay() === 0;

  // Check if today is the last day of the month
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const isLastDayOfMonth = now.getDate() === lastDayOfMonth;

  // Render trigger condition
  const shouldShowReports = isSunday || isLastDayOfMonth || forceShowTest;

  if (!shouldShowReports) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-slate-400 text-xs">
        <span>No reports scheduled for today. </span>
        <button
          onClick={() => setForceShowTest(true)}
          className="text-emerald-400 hover:underline font-semibold ml-1 inline-flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" /> Preview Sunday / Monthly Summary
        </button>
      </div>
    );
  }

  // Calculate total debt cleared & remaining
  const totalOriginalDebt = data.debtors.reduce(
    (acc, d) => acc + d.originalAmount,
    0,
  );
  const totalPaidDebt = data.debtors.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalRemainingDebt = Math.max(0, totalOriginalDebt - totalPaidDebt);

  // Total deductions
  const totalDeductions = data.deductions.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" /> Financial Summaries
        </h3>
        {forceShowTest && (
          <button
            onClick={() => setForceShowTest(false)}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Hide Preview
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Report Card */}
        {(isSunday || forceShowTest) && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Sunday Weekly Report
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Weekly Inflow
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />{" "}
                  Sat–Fri Received
                </span>
                <span className="font-bold text-white text-sm">
                  {formatKES(weeklySatFriTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-400 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />{" "}
                  Deductions Recorded
                </span>
                <span className="font-bold text-rose-300">
                  {formatKES(totalDeductions)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-slate-400 mb-1 font-medium">
                  Rent & Health Status:
                </p>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div
                    className={`p-1.5 rounded-lg border ${data.rhData.rentPaid ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-amber-950/40 border-amber-500/40 text-amber-300"}`}
                  >
                    Rent (8k): {data.rhData.rentPaid ? "Paid" : "Pending"}
                  </div>
                  <div
                    className={`p-1.5 rounded-lg border ${data.rhData.healthPaid ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-amber-950/40 border-amber-500/40 text-amber-300"}`}
                  >
                    Health (1.05k):{" "}
                    {data.rhData.healthPaid ? "Paid" : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Report Card */}
        {(isLastDayOfMonth || forceShowTest) && (
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> End of Month Report
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                Monthly Audit
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-400">Total Active Debt Left</span>
                <span className="font-bold text-amber-300 text-sm">
                  {formatKES(totalRemainingDebt)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-400">
                  Total Debt Cleared to Date
                </span>
                <span className="font-bold text-emerald-300">
                  {formatKES(totalPaidDebt)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-400">
                  Current Main Account Balance
                </span>
                <span className="font-bold text-white">
                  {formatKES(data.mainBalance)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
